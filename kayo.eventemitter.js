!(function (self) {
    "use strict";

    self.Kayo = window.Kayo || {};

    self.Kayo.EmitterException = function (message) {
        var ex = Error.call(self);
        return self.Kayo.Extend(ex, {
            name: "EmitterException",
            message: message ? "EmitterException: " + message : "",
            stack: ex.stack
        });
    };

    self.Kayo.EmitterEventArgs = function(eventName) {
        if (!eventName)
            throw new self.Kayo.ArgumentNullException("eventName cannot be null or empty.");

        this.EventName = eventName;
        this.EventData = {};
        for (var idx = 1; idx < arguments.length; idx++) {
            var current = arguments[idx];
            if (current.key === undefined || current.value === undefined)
                throw new self.Kayo.InvalidOperationException("eventData is not valid. Must be {key, value} object.");

           this.EventData[current.key] = value;
        }
    };

    self.Kayo.Emitter = function() { this.events = {}; };
    self.Kayo.Emitter.prototype = {
        On: function (name, callback) {
            if (!name)
                throw new self.Kayo.EmitterException('Name must be specified.');

            if (typeof callback !== 'function')
                throw new self.Kayo.EmitterException('Invalid callback.');

            if (!this.events[name])
                this.events[name] = [];

            this.events[name].push(callback);
        },
        Off: function (name, callback) {
            if (!name)
                throw new self.Kayo.EmitterException('Name must be specified.');

            if (!this.events[name])
                return;

            if (!callback) {
                delete this.events[name];
                return;
            }

            this.events[name] = this.events[name]
                .filter(function (cb) {
                    return cb !== callback;
                });
        },
        Once: function (name, callback) {
            if (!name)
                throw new self.Kayo.EmitterException('Name must be specified.');

            if (typeof callback !== 'function')
                throw new self.Kayo.EmitterException('Invalid callback.');

            var onceWrapper = function () {
                var args = [];
                for (var idx = 0; idx < arguments.length; idx++)
                    args[idx] = arguments[idx];

                this.Off(name, onceWrapper);
                callback.apply(this, args);
            };

            this.On(name, onceWrapper);
        },
        Emit: function (name) {
            var args = [];
            for (var idx = 1; idx < arguments.length; idx++)
                args[idx - 1] = arguments[idx];

            if (!name)
                throw new self.Kayo.EmitterException('Name must be specified.');

            if (!this.events[name])
                return;

            this
                .events[name]
                .forEach(function (callback) {
                    callback.apply(this, args);
                });
        },
        Count: function () {
            return Object.keys(this.events).length;
        }
    };

})(window);
