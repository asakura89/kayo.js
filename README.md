# Kayo

Utility js library

## GetType

```javascript
var Kayo = require("kayo.js");

console.log(Kayo.GetType(1));
console.log(Kayo.GetType(15.7));
console.log(Kayo.GetType(NaN));
console.log(Kayo.GetType("heyy hoo"));
console.log(Kayo.GetType({}));
console.log(Kayo.GetType(function () {}));
```

### Output

Number  
Number  
Number  
String  
Object  
Function  

## Extend

```javascript
var Kayo = require("kayo.js");

var original = {
    Name: "Original",
    Func: function () {
        console.log("original function");
    }
};

var extended = Kayo.Extend(original, {
    NewName: "Extended",
    NewFunc: function () {
        console.log("new function");
    }
});

extended.NewFunc();
console.log(extended);
```

### Output

new function                                                                                                                               
{ Name: 'Original',                                                                                                                        
  Func: [Function],                                                                                                                        
  NewName: 'Extended',                                                                                                                     
  NewFunc: [Function] }

## InvalidOperationException

```javascript
var Kayo = require("kayo.js");

try {
    throw new Kayo.InvalidOperationException("this is a custom error.");
}
catch (ex) {
    console.log(ex.message);
}
```

### Output

InvalidOperationException: this is a custom error.

## ViewData

```javascript
var ViewData = require("kayo.js").ViewData;

ViewData.Add("ProcessId", "2016070700005");
console.log(ViewData.Get("ProcessId"));
```

### Output

2016070700005

## Hook

```javascript
var Hook = require("kayo.js").Hook;

Hook.Add("GetName", function (name) {
    console.log("heyy hoo " + name);
});
Hook.Add("GetProcessId", function () {
    console.log("2016070900427");
});

Hook.Run("GetName", ["Jack"]);
Hook.Run("GetProcessId");
```

### Output

heyy hoo Jack                                                                                                                              
2016070900427