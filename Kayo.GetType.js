!function (global) {
    "use strict";

    function GetType (obj) {
        if (obj === undefined)
            return "Undefined";

        return Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1];
    };

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = GetType;
    else
        global.Kayo.GetType = global.k.GetType = GetType;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

