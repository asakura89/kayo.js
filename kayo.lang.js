!(function (self) {
    "use strict";

    var Constant = {
        Comma: ",",
        Dot: ".",
        IdLang: "id-id"
    };

    self.Kayo = window.Kayo || {};
    self.Kayo.Lang = window.Kayo.Lang || [];
    self.Kayo.GlobalConfig = window.Kayo.GlobalConfig || {
        __language__: undefined,
        DecimalSeparator: undefined,
        ThousandSeparator: undefined,
        DecimalPlaces: 2,
        DateFormat: undefined,
        TimeFormat: undefined
    };

    Object.defineProperty(self.Kayo.GlobalConfig, "Language", {
        get: function () { return this.__language__; },
        set: function (lang) {
            this.__language__ = lang.toLowerCase();
            this.DecimalSeparator = lang.toLowerCase() === Constant.IdLang ? Constant.Comma : Constant.Dot;
            this.ThousandSeparator = lang.toLowerCase() === Constant.IdLang ? Constant.Dot : Constant.Comma;
        }
    });

    self.Kayo.GlobalConfig.Language = "en-us";
    self.Kayo.GetString = window.Kayo.GetString || function () {
        if (arguments.length <= 0)
            return "";

        var code = arguments[0];
        var localizedString = self.Kayo.Lang[self.Kayo.GlobalConfig.Language.toLowerCase()][code];
        if (!localizedString)
            return "";

        if (arguments.length > 1) {
            var params = {};
            for (var i = 1; i < arguments.length; i++)
                params[Number(i - 1)] = arguments[i];

            return self.Kayo.VariableReplace(localizedString, params);
        }

        return localizedString;
    };
})(window);
