!function (global) {
    "use strict";

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

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = Extend;
    else
        global.Kayo.Extend = global.k.Extend = Extend;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

