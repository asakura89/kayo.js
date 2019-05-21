!(function ($, self) {
    "use strict";

    self.Kayo = window.Kayo || {};
    self.Kayo.GetType = obj => obj === undefined ? "Undefined" : Object.prototype.toString.call(obj).match(/^\[object\s+(.*?)\]$/)[1];

    self.Kayo.AsArray = arrayLike => Array.prototype.slice.call(arrayLike);

    self.Kayo.ArrayJoin = (array, separator) => Array.prototype.join.call(array, separator);

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

    self.Kayo.ValueOrDefault = el =>
        (!el.value || el.value === null || el.value === "" ?
            (self.Kayo.GetType(el) === "HTMLInputElement" &&
                (el.type === "number" ? "0" : "")) :
            el.value.trim());

    self.Kayo.VariableReplace = (string2Replace, replacements) =>
        (replacements && replacements !== null ?
            string2Replace
                .replace(/(\$\w*)/g, $0 =>
                    replacements[$0.replace(/\$/g, "")] === undefined ? $0 : replacements[$0.replace(/\$/g, "")]) :
        string2Replace);

    self.Kayo.RedirectTo = function (url, delay) { setTimeout(function() { window.location.href = url; }, delay ? delay : 1500); };

    self.Kayo.StringFormat = function (message, param) {
        if (self.Kayo.GetType(param) !== "Array")
            throw new self.Kayo.InvalidOperationException("param is not an Array.");

        for (var counter = 0; counter < param.length; counter++)
            message = message.replace(`{${counter}}`, param[counter].toString());

        return message;
    };

    self.Kayo.PopulateDropdownList = function (select, dataList, nameSelector, valueSelector) {
        if (self.Kayo.GetType(dataList) !== "Array")
            throw new self.Kayo.InvalidOperationException("dataList is not an Array.");

        var counter = 0;
        var optsLength = select.options.length;
        for (; counter < optsLength; counter++)
            select.options.remove(0);

        for (counter = 0; counter < dataList.length; counter++) {
            var opt = document.createElement("option");
            opt.text = nameSelector(dataList[counter]);
            opt.value = valueSelector(dataList[counter]);
            select.options.add(opt);
        }
    };

    function DisableControl(selectors, isDisabled) {
        if (self.Kayo.GetType(selectors) !== "Array")
            throw new self.Kayo.InvalidOperationException("selectors of Disable must be an Array.");

        selectors.forEach(selector => {
            var elements = self.Kayo.AsArray(document.querySelectorAll(selector));
            elements.forEach(el => {
                el.removeAttribute("readonly");
                el.removeAttribute("disabled");

                switch (self.Kayo.GetType(el)) {
                    case "HTMLAnchorElement":
                        el.className = self.Kayo.ArrayJoin(self.Kayo.AsArray(el.classList).filter(clss => clss !== "disabled"), " ") + (isDisabled ? " disabled" : "");
                        break;
                    case "HTMLInputElement":
                        // NOTE: firefox has bug which never readonlied input with type="number" so just disable all except input type="text"
                        // see this: https://support.mozilla.org/en-US/questions/1004206
                        if (isDisabled)
                            el.setAttribute(el.getAttribute("type") === "text" ? "readonly" : "disabled", "");
                        break;
                    default:
                        if (isDisabled)
                            el.setAttribute("disabled", "");
                        break;
                }
            });
        });
    }

    self.Kayo.Disable = selectors => DisableControl(selectors, true);
    self.Kayo.Enable = selectors => DisableControl(selectors, false);

    self.Kayo.Clear = function (selectors) {
        if (self.Kayo.GetType(selectors) !== "Array")
            throw new self.Kayo.InvalidOperationException("selectors of Clear must be an Array.");

        selectors.forEach(selector => {
            var elements = self.Kayo.AsArray(document.querySelectorAll(selector));
            elements.forEach(el => {
                switch (self.Kayo.GetType(el)) {
                    case "HTMLInputElement":
                        if (el.getAttribute("type") === "checkbox")
                            el.removeAttribute("checked");
                        else if (el.getAttribute("type") === "number")
                            el.value = 0;
                        else
                            el.value = "";
                        break;
                    case "HTMLSelectElement":
                        el.options.selectedIndex = 0;
                        break;
                    default:
                        el.value = "";
                        break;
                }
            });
        });
    };

    self.Kayo.Hide = function (selectors) {
        if (self.Kayo.GetType(selectors) !== "Array")
            throw new self.Kayo.InvalidOperationException("selectors of Hide must be an Array.");

        selectors
            .map(selector => self.Kayo.AsArray(document.querySelectorAll(selector)))
            .reduce((ela, elb) => ela.concat(elb), [])
            .forEach(el => el.className = el.className.replace(/(^|\b)hidden(\b|$)/gi, "").trim() + " hidden");
    };

    self.Kayo.Show = function (selectors) {
        if (self.Kayo.GetType(selectors) !== "Array")
            throw new self.Kayo.InvalidOperationException("selectors of Show must be an Array.");

        selectors
            .map(selector => self.Kayo.AsArray(document.querySelectorAll(selector)))
            .reduce((ela, elb) => ela.concat(elb), [])
            .forEach(el => el.className = el.className.replace(/(^|\b)hidden(\b|$)/gi, "").trim());
    };

    self.Kayo.ValidateMandatory = function (selectors, predicate) {
        if (predicate && self.Kayo.GetType(predicate) !== "Function")
            throw new self.Kayo.InvalidOperationException("predicate must be a function.");

        if (self.Kayo.GetType(selectors) !== "Array")
            throw new self.Kayo.InvalidOperationException("selectors of Validate Mandatory must be an Array.");

        var errElements = [];
        selectors.forEach(function (selector) {
            var elements = self.Kayo.AsArray(document.querySelectorAll(selector));
            elements.forEach(function (el) {
                var value = self.Kayo.ValueOrDefault(el);
                var isNotValid = predicate ? !predicate(value, el) : value === "" || value === "0";
                if (isNotValid) {
                    el.className = el.className.replace(/(^|\b)mandatory-empty(\b|$)/gi, "").trim() + " mandatory-empty";
                    errElements.push(el);
                }
            });
        });

        if (errElements.length > 0) {
            var mandatoryTimer = setTimeout(function () {
                for (var counter = 0; counter < errElements.length; counter++) {
                    var el = errElements[counter];
                    el.className = el.className.replace(/(^|\b)mandatory-empty(\b|$)/gi, "").trim();
                }

                clearTimeout(mandatoryTimer);
            }, 10000);
        }

        return errElements.length === 0;
    };

    /*
    $.fn.onOnce = function (a, b, c) {
        $(this)
            .off(a, b)
            .on(a, b, c);
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
    */

})(window.jQuery, window);
