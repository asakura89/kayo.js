!(function (self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.Hide = window.Kayo.Hide || function (el) {
        el.className += " hidden";
    };

    self.Kayo.Show = window.Kayo.Show || function (el) {
        el.className = el.className.replace(/(^|\b)hidden(\b|$)/gi, "").trim();
    };
})(window);
