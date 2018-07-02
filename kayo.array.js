!(function (self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.Max = function (arr, prop) {
        return arr.reduce(function (p, n) {
            return prop !== undefined && prop !== null && prop !== "" ?
                [p, n].filter(function (i) {
                    return i[prop] === Math.max(p[prop], n[prop]);
                })[0] :
                Math.max(p, n);
        });
    };

    self.Kayo.Min = function (arr, prop) {
        return arr.reduce(function (p, n) {
            return prop !== undefined && prop !== null && prop !== "" ?
                [p, n].filter(function (i) {
                    return i[prop] === Math.min(p[prop], n[prop]);
                })[0] :
                Math.min(p, n);
        });
    };

})(window);
