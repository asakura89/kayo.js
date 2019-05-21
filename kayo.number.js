!(function (self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.NumeralsOnly = function (e) {
        if (!self.Kayo && !self.Kayo.GlobalConfig && !self.Kayo.GlobalConfig.Language)
            throw new self.Kayo.InvalidOperationException("kayo.lang.js must be included and Kayo.GlobalConfig.Language must be configured.");

        // NOTE: please aware of this
        https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        var keyEvent = e || window.event;
        var key = keyEvent.keyCode || keyEvent.which;
        var allowed = [
            46, // Delete
            8, // Backspace
            9, // Tab
            27, // Esc
            13, // Enter
            35, // End
            36, // Home
            37, // left arrow
            38, // up arrow
            39, // right arrow
            40, // down arrow
            (self.Kayo.GlobalConfig.Language === "en-us" ? 190 : 188) // 190 is . (Dot) and 188 is , (Comma)
            /* 110, // Numpad .
            190 // Numpad , */
        ];
        if (allowed.indexOf(key) !== -1 ||
        (e.keyCode === 65 && e.ctrlKey === true) || // Ctrl+A
        (e.keyCode >= 48 && e.keyCode <= 57 && e.shiftKey === false)) // Numbers
            return true;
        else {
            e.preventDefault();
            return false;
        }
    };

    /*

    Initialize textbox into decimal-formatted textbox
    @param {Object} config - Object consist of Element, DecimalSeparator, and ThousandSeparator
    @example
    Decimalize({ Element: document.querySelector("input[class=decimal-textbox]") });
    @example
    Decimalize({
        Element: document.querySelector("input[class=decimal-textbox]"),
        DecimalSeparator: ".",
        ThousandSeparator: ","
    });

    */
    self.Kayo.Decimalize = function (element) {
        if (!self.Kayo && !self.Kayo.GlobalConfig && !self.Kayo.GlobalConfig.Language)
            throw new self.Kayo.InvalidOperationException("kayo.lang.js must be included and Kayo.GlobalConfig.Language must be configured.");

        function ConvertIntoCulturedNumber(iel) {
            var nStr = iel.value;
            nStr += '';
            var x = nStr.split(self.Kayo.GlobalConfig.DecimalSeparator);
            if (!x[0])
                x[0] = "0";
            var x1 = x[0];
            if (!x[1])
                x[1] = "00";
            var x2 = x.length > 1 ? self.Kayo.GlobalConfig.DecimalSeparator + x[1] : "";
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1))
                x1 = x1.replace(rgx, "$1" + self.Kayo.GlobalConfig.ThousandSeparator + "$2");

            iel.value = x1 + x2;
            return true;
        }

        // https://stackoverflow.com/a/874722/1181782
        function StripOutCulture(iel) {
            var nStr = iel.value;
            nStr = nStr.replace(new RegExp("\\" + self.Kayo.GlobalConfig.ThousandSeparator, "g"), "");
            iel.value = nStr;
            iel.focus();

            return true;
        }

        element.removeEventListener("focus", function (e) { StripOutCulture(element); });
        element.removeEventListener("blur", function (e) { ConvertIntoCulturedNumber(this); });
        element.removeEventListener("keydown", self.Kayo.NumeralsOnly);

        element.addEventListener("focus", function (e) { StripOutCulture(element); });
        element.addEventListener("blur", function (e) { ConvertIntoCulturedNumber(this); });
        element.addEventListener("keydown", self.Kayo.NumeralsOnly);
    };

    self.Kayo.ZeroedInteger = integer => integer.toString().padStart(2, "0");
})(window);
