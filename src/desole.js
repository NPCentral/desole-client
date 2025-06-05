var uuidv4 = require('./helpers/uuidv4');

function Desole(config) {
    'use strict';

    // Set default tags
    this.url = config.url;
    this.tags = config.tags || {};
    this.ignore = config.ignore || [];
    this.modules = config.modules || ['onerror', 'console', 'unhandledrejection'];
    this.app = {
        name:
            (config.app && config.app.name) ||
            (global && global.location && global.location.hostname),
        version: (config.app && config.app.version) || false,
        stage: (config.app && config.app.stage) || false,
    };

    if (!config.manualInit) {
        this.attach();
    }
}

Desole.isErrorObject = function (obj) {
    'use strict';

    var o = {};
    var type = o.toString.apply(obj);
    return type === '[object Object]' || type === '[object Error]';
};

Desole.prototype.attach = function () {
    'use strict';

    var self = this;
    if (self.modules.indexOf('onerror') > -1) {
        self._originalOnError = global && global.onerror;
        global.onerror = function (message, url, lineNo, columnNo, err) {
            var isErrObj = Desole.isErrorObject(err);
            self.track({
                severity: 'error',
                stack: (isErrObj && err.stack) || String(err),
                type: (isErrObj && err.name) || '',
                message: message || String(err),
            });

            if (self._originalOnError) {
                self._originalOnError(global, [message, url, lineNo, columnNo, err]);
            }
        };
    }

    if (self.modules.indexOf('console') > -1) {
        self._originalConsoleError = console && console.error;

        console.error = function () {
            var args = Array.prototype.slice.call(arguments);
            var stack;
            function stringify(item) {
                try {
                    return typeof item === 'object' ? JSON.stringify(item) : String(item);
                } catch (e) { }
                return String(item);
            }
            stack = args.map(stringify);
            self.track({
                severity: 'info',
                stack: stack.join(', '),
                type: 'ConsoleError',
                message:
                    (args.length && args[0] && stringify(args[0].message)) ||
                    args.join(', '),
            });

            self._originalConsoleError.apply(this, arguments);
        };
    }

    if (self.modules.indexOf('unhandledrejection') > -1) {
        self._originalUnhandledRejection = global.onunhandledrejection;

        global.onunhandledrejection = function (err) {
            self.track({
                severity: 'warning',
                stack: '',
                type: err.type || 'UnhandledPromiseRejection',
                message: err.reason,
            });

            if (self._originalUnhandledRejection) {
                self._originalUnhandledRejection.apply(this, arguments);
            }
        };
    }
};

Desole.prototype.detach = function () {
    'use strict';

    if (this.modules.indexOf('onerror') > -1) {
        global.onerror = this._originalOnError;
    }

    if (this.modules.indexOf('console') > -1) {
        console.error = this._originalConsoleError;
    }

    if (this.modules.indexOf('unhandledrejection') > -1) {
        global.onunhandledrejection = this._originalUnhandledRejection;
    }
};

Desole.prototype.track = function (clientOptions) {
    'use strict';

    var msg = 'unknown error';
    var http = new global.XMLHttpRequest(),
        url = this.url,
        options = {
            severity: clientOptions.severity,
            type: clientOptions.type,
            message: clientOptions.message,
            timestamp: clientOptions.timestamp || Date.now(),
            resource:
                clientOptions.resource ||
                (global && global.location && global.location.href),
            app: {
                name: (clientOptions.app && clientOptions.app.name) || this.app.name,
                version:
                    (clientOptions.app && clientOptions.app.version) || this.app.version,
                stage: (clientOptions.app && clientOptions.app.stage) || this.app.stage,
            },
            endpoint: {
                id: (clientOptions.endpoint && clientOptions.endpoint.id) || uuidv4(),
                language:
                    (clientOptions.endpoint && clientOptions.endpoint.language) ||
                    (global.navigator && global.navigator.language),
                platform:
                    (clientOptions.endpoint && clientOptions.endpoint.platform) ||
                    (global.navigator && global.navigator.platform),
            },
            tags: clientOptions.tags || this.tags,
        };

    options.stack = clientOptions.stack;
    if (typeof options.stack !== 'string') {
        try {
            options.stack = JSON.stringify(options.stack);
        } catch (err) {
            console.log('Stack trace conversion to string failed', err);
            try {
                msg = JSON.stringify(err);
            } catch (e) { }
            options.stack = 'Stack trace conversion to string failed: ' + msg;
        }
    }

    var errorMsgRE = [
        /Object Not Found Matching Id/i,
        /ResizeObserver loop completed with undelivered notifications/i,
        /Timeout/,
        /Timeout \(B\)/
    ];

    if (errorMsgRE.some(re => re.test(options.message || '') || re.test(options.stack || ''))) {
        console.log(`filtered out: ${JSON.stringify(options)}`);
        return;
    }

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');

    http.send(JSON.stringify(options));
};

Desole.prototype.captureException = function (e) {
    'use strict';

    return this.track({
        severity: 'error',
        stack: e.stack,
        type: e.name,
        message: e.message,
    });
};

module.exports = Desole;
