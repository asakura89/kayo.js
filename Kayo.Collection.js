!function (global) {
    "use strict";

    var Collection = function () {
        return {
            Sum: function (arr, prop) {
                return arr.reduce(function (p, n) {
                    return prop !== undefined && prop !== null && prop !== "" ?
                        Number(p[prop]) + Number(n[prop]) : Number(p) + Number(n);
                });
            },

            Min: function (arr, prop) {
                return arr.reduce(function (p, n) {
                    return prop !== undefined && prop !== null && prop !== "" ?
                        [p, n].filter(function (i) {
                            return i[prop] === Math.min(p[prop], n[prop]);
                        })[0] :
                        Math.min(p, n);
                });
            },

            Max: function (arr, prop) {
                return arr.reduce(function (p, n) {
                    return prop !== undefined && prop !== null && prop !== "" ?
                        [p, n].filter(function (i) {
                            return i[prop] === Math.max(p[prop], n[prop]);
                        })[0] :
                        Math.max(p, n);
                });
            }
        };
    }();

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = Collection;
    else
        global.Kayo.Collection = global.k.Collection = Collection;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

