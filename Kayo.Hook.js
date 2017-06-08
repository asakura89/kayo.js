/// ref Kayo.GetType.js
/// ref Kayo.ViewData.js
/// ref Kayo.InvalidOperationException.js
!function (global) {
    "use strict";

    var Hook = function () {
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
    }();

    if (typeof global.Kayo === "undefined")
        global.Kayo = {};
    if (typeof global.k === "undefined")
        global.k = {};
    if (typeof module === "object" && typeof module.exports === "object")
        module.exports = Hook;
    else
        global.Kayo.Hook = global.k.Hook = Hook;
}(typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);

