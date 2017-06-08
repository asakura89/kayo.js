/// ref Kayo.Extend.js
!function (global) {
    "use strict";

    function InvalidOperationException (message) {
        var ex = Error.call(self);
        return global.k.Extend(ex, {
            name: "InvalidOperationException",
            message: message ? "InvalidOperationException: " + message : "",
            stack: ex.stack
        })
    };

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = InvalidOperationException;
    else
        global.Kayo.InvalidOperationException = global.k.InvalidOperationException = InvalidOperationException;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

