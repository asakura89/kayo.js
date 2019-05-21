!(function (self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.SetFieldNotValid = function (sender, args, message) {
        sender.innerText = message;
        args.IsValid = false;
        window.Page_IsValid = false;
        return;
    };
})(window);
