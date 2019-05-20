!(function (self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.ValidateASPError = function (errorMessage) {
        var result = {
            IsASPError: false,
            Message: errorMessage
        };

        var tmp = document.createElement("div");
        tmp.innerHTML = errorMessage;

        var comment = self.Kayo
            .AsArray(tmp.children)
            .filter(el => el.nodeType === 8);

        if (comment.length > 0) {
            result.IsASPError = true;
            result.Message = comment[0].nodeValue;
        }

        return result;
    };

    self.Kayo.OnAjaxError = function (data, action) {
        var result = self.Kayo.ValidateASPError(data.responseText);
        var message = result.IsASPError ? result.Message : data.responseText;
        if (action)
            action(message);
        console.log(message);
    };
})(window);
