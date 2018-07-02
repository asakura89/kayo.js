!(function ($, self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.GetType = function (obj) {
        if (obj === undefined)
            return "Undefined";

        return Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1];
    };

    self.Kayo.Extend = function (target, source) {
        for (var prop in source) {
            var propInfo = Object.getOwnPropertyDescriptor(source, prop);
            if (propInfo) {
                delete target[prop];
                Object.defineProperty(target, prop, propInfo);
            }
        }
        return target;
    };

    self.Kayo.InvalidOperationException = function (message) {
        var ex = Error.call(self);
        return self.Kayo.Extend(ex, {
            name: "InvalidOperationException",
            message: message ? "InvalidOperationException: " + message : "",
            stack: ex.stack
        });
    };

    self.Kayo.ViewData = (function () {
        var tmp = {};

        return {
            Get: function (key) {
                if (tmp.hasOwnProperty(key))
                    return tmp[key];
                return undefined;
            },
            Add: function (key, value) {
                tmp[key] = value;
            },
            Remove: function (key) {
                delete tmp[key];
            },
            Clear: function () {
                tmp = {};
            },
            GetKeys: function () {
                var keys = [];
                for (var key in tmp)
                    if (tmp.hasOwnProperty(key))
                        keys.push(key);
                return keys;
            }
        };
    })();

    self.Kayo.Hook = (function () {
        var vd = Object.create(self.Kayo.ViewData);
        return {
            Run: function (key, params) {
                var hook = vd.Get(key);
                if (!hook)
                    throw new self.Kayo.InvalidOperationException("There's no Hook with name '" + key + "'");
                return hook.apply(self, params);
            },
            Add: function (key, value) {
                if (self.Kayo.GetType(value) !== "Function")
                    throw new self.Kayo.InvalidOperationException("Not a function.");
                vd.Add(key, value);
            }
        };
    })();

    self.Kayo.ValueOrDefault = function(el) {
        var elval = el.value;
        if (elval === undefined || elval === null || elval === "")
            return self.Kayo.GetType(el) === "HTMLInputElement" &&
                el.type === "number" ? "0" : "";

        return elval.trim();
    };

    self.Kayo.VariableReplace = function (string2Replace, replacements) {
        if (replacements !== undefined || replacements !== null)
            return string2Replace
                .replace(/(\$\w*)/g, function ($0) {
                    return replacements[$0.replace(/\$/g, "")] === undefined ? $0 : replacements[$0.replace(/\$/g, "")];
                });

        return string2Replace;
    };

    self.Kayo.RedirectTo = function (url, delay) {
        setTimeout(function () { window.location.href = url; }, delay ? delay : 1500);
    };

    self.Kayo.StringFormat = function (message, param) {
        if (self.Kayo.GetType(param) !== "Array")
            throw new self.Kayo.InvalidOperationException("param is not array.");

        for (var i = 0; i < param.length; i++)
            message = message.replace("{" + i + "}", param[i].toString());

        return message;
    };

    self.Kayo.PopulateDropdownList = function (select, dataList, nameSelector, valueSelector) {
        if (self.Kayo.GetType(dataList) !== "Array")
            throw new self.Kayo.InvalidOperationException("dataList is not array.");

        for (var i = 0; i < select.options.length; i++)
            select.options.remove(0);

        for (var i = 0; i < dataList.length; i++) {
            var opt = document.createElement("option");
            opt.text = nameSelector(dataList[i]);
            opt.value = valueSelector(dataList[i]);
            select.options.add(opt);
        }
    };

    $.fn.valOrDefault = function () {
        var $this = $(this);
        var $thisval = $this.val();
        if ($thisval === undefined || $thisval === null || $thisval === "")
            return self.Kayo.GetType($this[0]) === "HTMLInputElement" &&
                $this.attr("type") === "number" ? "0" : "";

        return $thisval.trim();
    };

    $.fn.onOnce = function (a, b, c) {
        $(this)
            .off(a, b)
            .on(a, b, c);
    };

    self.ValueOrDefault = function(el) {
        var elval = el.value;
        if (elval === undefined || elval === null || elval === "")
            return self.Kayo.GetType(el) === "HTMLInputElement" &&
                el.type === "number" ? "0" : "";

        return elval.trim();
    };

    function DisableControl(idList, isDisabled) {
        if (self.Kayo.GetType(idList) !== "Array")
            throw new self.Kayo.InvalidOperationException("idList of Disable must be an Array of selector.");

        idList.forEach(function (item) {
            var element = $(item);
            element.removeAttr("readonly").removeAttr("disabled");
            // NOTE: firefox has bug which never readonlied input with type="number" so just disable all except input type="text"
            // see this: https://support.mozilla.org/en-US/questions/1004206
            element.prop(self.Kayo.GetType(element[0]) === "HTMLInputElement" && element.attr("type") === "text" ? "readonly" : "disabled", isDisabled);
        });
    }

    self.Kayo.Disable = function (idList) { DisableControl(idList, true); };
    self.Kayo.Enable = function (idList) { DisableControl(idList, false); };

    self.Kayo.Clear = function (idList) {
        if (self.Kayo.GetType(idList) !== "Array")
            throw new self.Kayo.InvalidOperationException("idList of Clear must be an Array of selector.");

        idList.forEach(function (item) {
            var element = $(item);
            var elementType = self.Kayo.GetType(element[0]);
            switch (elementType) {
                case "HTMLInputElement":
                    var elType = element.attr("type");
                    if (elType === "checkbox")
                        element.prop("checked", false);
                    else
                        element.val(elType === "number" ? 0 : "");
                    break;
                case "HTMLSelectElement":
                    element.val(element[0].options[0].value);
                    break;
                default:
                    element.val("");
                    break;
            }
        });
    };

    self.Kayo.ValidateMandatory = function (idList, predicate) {
        if (predicate && self.Kayo.GetType(predicate) !== "Function")
            throw new self.Kayo.InvalidOperationException("predicate must be a function.");

        if (self.Kayo.GetType(idList) !== "Array")
            throw new self.Kayo.InvalidOperationException("idList of Clear must be an Array of selector.");

        var mandatoryEmptyList = [];
        idList.forEach(function (id) {
            var $elements = Array.from($(id));
            $elements.forEach(function (el) {
                var $el = $(el);
                var elValue = $el.valOrDefault();
                var isNotValid = predicate ? !predicate(elValue) : elValue === "" || elValue === "0";
                if (isNotValid) {
                    $el.addClass("mandatory-empty");
                    mandatoryEmptyList.push($el);
                }
            });
        });

        if (mandatoryEmptyList.length > 0) {
            var mandatoryTimer = setTimeout(function () {
                for (var i = 0; i < mandatoryEmptyList.length; i++)
                    $(mandatoryEmptyList[i]).removeClass("mandatory-empty");
                clearTimeout(mandatoryTimer);
            }, 10000);
        }
        return mandatoryEmptyList.length === 0;
    };

    $(document).ready(function () {
        $(document).on("keydown", function (e) {
            if ((document.activeElement.getAttribute("type") !== "text" || document.activeElement.getAttribute("type") !== "number") &&
                (document.activeElement.readOnly || document.activeElement.disabled)) {
                if (e.keyCode === 8)
                    e.preventDefault();
            }
        });
    });
})(window.jQuery, window);
