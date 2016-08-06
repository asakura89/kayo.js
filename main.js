!(function (self) {
    "use strict";

    function GetType (obj) {
        if (obj === undefined)
            return "Undefined";

        return Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1];
    };

    function Extend (target, source) {
        for (var prop in source) {
            var propInfo = Object.getOwnPropertyDescriptor(source, prop);
            if (propInfo) {
                delete target[prop];
                Object.defineProperty(target, prop, propInfo);
            }
        }
        return target;
    };

    function InvalidOperationException (message) {
        var ex = Error.call(self);
        return Extend(ex, {
            name: "InvalidOperationException",
            message: message ? "InvalidOperationException: " + message : "",
            stack: ex.stack
        })
    };

    var ViewData = (function () {
        var tmp = {};

        return {
            Get: function (key) {
                if (tmp.hasOwnProperty(key))
                    return tmp[key];
                return undefined;
            },
            Add: function (key, value) {
                tmp[key] = value;
            },
            Remove: function (key) {
                delete tmp[key];
            },
            Clear: function () {
                tmp = {};
            },
            GetKeys: function () {
                var keys = [];
                for (var key in tmp)
                    if (tmp.hasOwnProperty(key))
                        keys.push(key);
                return keys;
            }
        };
    })();

    var Hook = (function () {
        var vd = ViewData;
        return {
            Run: function (key, params) {
                var hook = vd.Get(key);
                if (!hook)
                    throw new InvalidOperationException("There's no Hook with name '" + key + "'");
                hook.apply(self, params);
            },
            Add: function (key, value) {
                if (GetType(value) !== "Function")
                    throw new InvalidOperationException("Not a function.");
                vd.Add(key, value);
            }
        };
    })();

    module.exports = {
        GetType: GetType,
        Extend: Extend,
        InvalidOperationException: InvalidOperationException,
        ViewData: ViewData,
        Hook: Hook
    };
})(global);

