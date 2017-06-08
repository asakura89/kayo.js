!function (global) {
    "use strict";

    function RedirectTo (url, delay) {
        setTimeout(function () { window.location.href = url; }, delay ? delay : 1500);
    };

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = RedirectTo;
    else
        global.Kayo.RedirectTo = global.k.RedirectTo = RedirectTo;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

