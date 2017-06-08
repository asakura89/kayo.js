!function (global) {
    "use strict";

    var ViewData = function () {
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
    }();

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = ViewData;
    else
        global.Kayo.ViewData = global.k.ViewData = ViewData;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

