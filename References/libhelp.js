(function () {
    function applyDoc(obj, docMethods) {
        for (var m in docMethods) {
            var docm = docMethods[m];
            if (typeof docm != "function")
                continue;
            var original = obj[m];
            if (original && typeof original == "function") {
                original._$doc = docm;
            }
        }
        _$nonRemovable(obj);
    }

    function applyHooks(obj, type, docMethods) {
        var createHook = typeof type == "function" ? 
            function (original, doc) {
                function hook() {
                    var result = original.apply(this, arguments);
                    if (result === null)
                        return _$getTrackingNull(new type());
                    else if(result === undefined)
                        return _$getTrackingUndefined(new type());
                    else if (typeof result == "object" && result._$isExceptionObject)
                        return new type();
                    return result;
                } 
                hook._$doc = doc;
                return hook;
            } :
            function (original, doc) {
                function hook() {
                    var result = original.apply(this, arguments);
                    if (result === null)
                        return _$getTrackingNull(type);
                    else if(result === undefined)
                        return _$getTrackingUndefined(type);
                    else if (typeof result == "object" && result._$isExceptionObject)
                        return type;
                    return result;
                } 
                hook._$doc = doc;
                return hook;
            };
        for (var m in docMethods) {
            var docm = docMethods[m];
            if (typeof docm != "function")
                continue;
            var original = obj[m];
            if (original && typeof original == "function") 
                obj[m] = createHook(original, docm);
        }
        _$nonRemovable(obj);
    }

    // RegExp object    
    applyDoc(RegExp.prototype, {
        exec: function () {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <returns type="Array" />
            /// </signature>
        },
        compile: function () {
            /// <signature>
            ///     <param name="pattern" type="RegExp" />
            ///     <param name="flags" type="String" optional="true" />
            ///     <returns type="RegExp" />
            /// </signature>
        },
        test: function (string) {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        }
    });

    applyDoc(JSON, {
        parse: function () {
            /// <signature>
            ///     <param name="text" type="String" />
            ///     <param name="reviver" type="Function" optional="true" />
            /// </signature>
        },
        stringify: function () {
            /// <signature>
            ///     <param name="value" />
            ///     <param name="replacer" optional="true" />
            ///     <param name="space" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        }
    });

    // Object prototype
    applyDoc(Object.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        valueOf: function () {
            /// <signature>
            /// </signature>
        },
        hasOwnProperty: function () {
            /// <signature>
            ///     <param name="V" type="String" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        isPrototypeOf: function () {
            /// <signature>
            ///     <param name="V" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        propertyIsEnumerable: function () {
            /// <signature>
            ///     <param name="V" type="String" />
            ///     <returns type="Boolean" />
            /// </signature>
        }
    });

    // Array prototype
    applyDoc(Array.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        concat: function () {
            /// <signature>
            ///     <param name="..." optional="true" />
            ///     <returns type="Array" />
            /// </signature>
        },
        join: function () {
            /// <signature>
            ///     <param name="separator" type="String" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        },
        pop: function () {
            /// <signature>
            /// </signature>
        },
        push: function () {
            /// <signature>
            ///     <param name="..." optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        reverse: function () {
            /// <signature>
            ///     <returns type="Array" />
            /// </signature>
        },
        shift: function () {
            /// <signature>
            /// </signature>
        },
        slice: function () {
            /// <signature>
            ///     <param name="start" type="Number" />
            ///     <param name="end" type="Number" />
            ///     <returns type="Array" />
            /// </signature>
        },
        sort: function () {
            /// <signature>
            ///     <param name="comparefn" type="Function" />
            ///     <returns type="Array" />
            /// </signature>
        },
        splice: function () {
            /// <signature>
            ///     <param name="start" type="Number" />
            ///     <param name="deleteCount" type="Number" />
            ///     <param name="..." optional="true" />
            ///     <returns type="Array" />
            /// </signature>
        },
        unshift: function () {
            /// <signature>
            ///     <param name="..." optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        indexOf: function () {
            /// <signature>
            ///     <param name="searchElement" />
            ///     <param name="fromIndex" type="Number" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        lastIndexOf: function () {
            /// <signature>
            ///     <param name="searchElement" />
            ///     <param name="fromIndex" type="Number" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        every: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="value" />
            ///             <param name="index" type="Number" />
            ///             <param name="traversedObject" />
            ///             <returns type="Boolean" />
            ///         </signature>
            ///     </param>
            ///     <param name="thisArg" optional="true" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        some: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="value" />
            ///             <param name="index" type="Number" />
            ///             <param name="traversedObject" />
            ///             <returns type="Boolean" />
            ///         </signature>
            ///     </param>
            ///     <param name="thisArg" optional="true" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        forEach: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="value" />
            ///             <param name="index" type="Number" />
            ///             <param name="traversedObject" />
            ///         </signature>
            ///     </param>
            ///     <param name="thisArg" optional="true" />
            /// </signature>
        },
        map: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="value" />
            ///             <param name="index" type="Number" />
            ///             <param name="traversedObject" />
            ///         </signature>
            ///     </param>
            ///     <param name="thisArg" optional="true" />
            ///     <returns type="Array" />
            /// </signature>
        },
        filter: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="value" />
            ///             <param name="index" type="Number" />
            ///             <param name="traversedObject" />
            ///             <returns type="Boolean" />
            ///         </signature>
            ///     </param>
            ///     <param name="thisArg" optional="true" />
            ///     <returns type="Array" />
            /// </signature>
        },
        reduce: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="previousValue" />
            ///             <param name="currentValue" />
            ///             <param name="currentIndex" type="Number" />
            ///             <param name="traversedObject" />
            ///         </signature>
            ///     </param>
            ///     <param name="initialValue" optional="true"/>
            /// </signature>
        },
        reduceRight: function () {
            /// <signature>
            ///     <param name="callbackfn" type="Function">
            ///         <signature>
            ///             <param name="previousValue" />
            ///             <param name="currentValue" />
            ///             <param name="currentIndex" type="Number" />
            ///             <param name="traversedObject" />
            ///         </signature>
            ///     </param>
            ///     <param name="initialValue" optional="true"/>
            /// </signature>
        }
    });

    // String prototype
    applyDoc(String.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        valueOf: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        charAt: function () {
            /// <signature>
            ///     <param name="pos" type="Number" />
            ///     <returns type="String" />
            /// </signature>
        },
        charCodeAt: function () {
            /// <signature>
            ///     <param name="pos" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        concat: function () {
            /// <signature>
            ///     <param name="..." type="String" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        },
        indexOf: function () {
            /// <signature>
            ///     <param name="searchString" type="String" />
            ///     <param name="position" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        lastIndexOf: function () {
            /// <signature>
            ///     <param name="searchString" type="String" />
            ///     <param name="position" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        localeCompare: function () {
            /// <signature>
            ///     <param name="that" type="String" />
            ///     <param name="position" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        match: function () {
            /// <signature>
            ///     <param name="regexp" type="RegExp" />
            ///     <returns type="Array" />
            /// </signature>
        },
        replace: function () {
            /// <signature>
            /// 	<param name="searchValue" type="String" />
            /// 	<param name="replaceValue" type="String" />
            /// 	<returns type="String" />
            /// </signature>
            /// <signature>
            /// 	<param name="searchRegexp" type="RegExp" />
            /// 	<param name="replaceValue" type="String" />
            /// 	<returns type="String" />
            /// </signature>
            /// <signature>
            /// 	<param name="searchRegexp" type="RegExp" />
            /// 	<param name="replaceFunction" type="Function" />
            /// 	<returns type="String" />
            /// </signature>
            /// <signature>
            /// 	<param name="searchValue" type="String" />
            /// 	<param name="replaceFunction" type="Function" />
            /// 	<returns type="String" />
            /// </signature>
        },
        search: function () {
            /// <signature>
            ///     <param name="regexp" type="RegExp" />
            ///     <returns type="Number" />
            /// </signature>
        },
        slice: function () {
            /// <signature>
            ///     <param name="start" type="Number" />
            ///     <param name="end" type="Number" />
            ///     <returns type="String" />
            /// </signature>
        },
        split: function () {
            /// <signature>
            ///     <param name="separator" type="String" />
            ///     <param name="limit" type="Number" />
            ///     <returns type="Array" />
            /// </signature>
            /// <signature>
            ///     <param name="separator" type="RegExp" />
            ///     <param name="limit" type="Number" />
            ///     <returns type="Array" />
            /// </signature>
        },
        substring: function () {
            /// <signature>
            ///     <param name="start" type="Number" />
            ///     <param name="end" type="Number" />
            ///     <returns type="String" />
            /// </signature>
        },
        toLowerCase: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleLowerCase: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toUpperCase: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleUpperCase: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        trim: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        substr: function () {
            /// <signature>
            ///     <param name="start" type="Number" />
            ///     <param name="length" type="Number" />
            ///     <returns type="String" />
            /// </signature>
        },
        anchor: function () {
            /// <signature>
            ///     <param name="name" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        big: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        blink: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        bold: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        fixed: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        fontcolor: function () {
            /// <signature>
            ///     <param name="color" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        fontsize: function () {
            /// <signature>
            ///     <param name="size" type="Number" />
            ///     <returns type="String" />
            /// </signature>
        },
        italics: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        link: function () {
            /// <signature>
            ///     <param name="href" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        small: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        strike: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        sub: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        sup: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        }
    });

    // Boolean prototype
    applyDoc(Boolean.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        valueOf: function () {
            /// <signature>
            ///     <returns type="Boolean" />
            /// </signature>
        }
    });

    // Number prototype
    applyDoc(Number.prototype, {
        toString: function () {
            /// <signature>
            ///     <param name="radix" type="Number" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        valueOf: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        toFixed: function () {
            /// <signature>
            ///     <param name="fractionDigits" type="Number" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        },
        toExponential: function () {
            /// <signature>
            ///     <param name="fractionDigits" type="Number" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        },
        toPrecision: function () {
            /// <signature>
            ///     <param name="precision" type="Number" optional="true" />
            ///     <returns type="String" />
            /// </signature>
        }
    });

    // Math
    applyDoc(Math, {
        abs: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        acos: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        asin: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        atan: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        atan2: function () {
            /// <signature>
            ///     <param name="y" type="Number" />
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        ceil: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>

        },
        cos: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        exp: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        floor: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        log: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        max: function () {
            /// <signature>
            ///     <param name="value1" type="Number" />
            ///     <param name="value2" type="Number" />
            ///     <param name="..." optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        min: function () {
            /// <signature>
            ///     <param name="value1" type="Number" />
            ///     <param name="value2" type="Number" />
            ///     <param name="..." optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        pow: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <param name="y" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        random: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        round: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        sin: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        sqrt: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        tan: function () {
            /// <signature>
            ///     <param name="x" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        }
    });

    // Date prototype
    applyDoc(Date.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toDateString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toTimeString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleDateString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toLocaleTimeString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        valueOf: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getTime: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getFullYear: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCFullYear: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getMonth: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCMonth: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getDate: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCDate: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getDay: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCDay: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getHours: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCHours: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getMinutes: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCMinutes: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getSeconds: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCSeconds: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getMilliseconds: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getUTCMilliseconds: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        getTimezoneOffset: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        setTime: function () {
            /// <signature>
            ///     <param name="time" type="Number"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setMilliseconds: function () {
            /// <signature>
            ///     <param name="ms" type="Number"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCMilliseconds: function () {
            /// <signature>
            ///     <param name="ms" type="Number"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setSeconds: function () {
            /// <signature>
            ///     <param name="sec" type="Number"/>
            ///     <param name="ms" type="Number" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCSeconds: function () {
            /// <signature>
            ///     <param name="sec" type="Number" />
            ///     <param name="ms" type="Number" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        setMinutes: function () {
            /// <signature>
            ///     <param name="min" type="Number" />
            ///     <param name="sec" type="Number" optional="true"/>
            ///     <param name="ms" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCMinutes: function () {
            /// <signature>
            ///     <param name="min" type="Number" />
            ///     <param name="sec" type="Number" optional="true"/>
            ///     <param name="ms" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setHours: function () {
            /// <signature>
            ///     <param name="hour" type="Number" />
            ///     <param name="min" type="Number" optional="true" />
            ///     <param name="sec" type="Number" optional="true" />
            ///     <param name="ms" type="Number" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCHours: function () {
            /// <signature>
            ///     <param name="hour" type="Number" />
            ///     <param name="min" type="Number" optional="true"/>
            ///     <param name="sec" type="Number" optional="true"/>
            ///     <param name="ms" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setDate: function () {
            /// <signature>
            ///     <param name="date" type="Number"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCDate: function () {
            /// <signature>
            ///     <param name="date" type="Number"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setMonth: function () {
            /// <signature>
            ///     <param name="month" type="Number" />
            ///     <param name="date" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCMonth: function () {
            /// <signature>
            ///     <param name="month" type="Number"/>
            ///     <param name="date" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setFullYear: function () {
            /// <signature>
            ///     <param name="year" type="Number"/>
            ///     <param name="month" type="Number" optional="true"/>
            ///     <param name="date" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        setUTCFullYear: function () {
            /// <signature>
            ///     <param name="year" type="Number" />
            ///     <param name="month" type="Number" optional="true" />
            ///     <param name="date" type="Number" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        },
        toUTCString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toISOString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        toJSON: function () {
            /// <signature>
            ///     <param name="key" type="Number"/>
            ///     <returns type="String" />
            /// </signature>
        },
        getYear: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        setYear: function () {
            /// <signature>
            ///     <param name="year" type="Number"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        toGMTString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        getVarDate: function () {
            /// <signature>
            ///     <returns type="VariantDate" />
            /// </signature>
        }
    });

    // Function 
    applyDoc(Function.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        apply: function () {
            /// <signature>
            /// <param name="thisArg" />
            /// <param name="argArray" type="Array" />
            /// </signature>
        },
        call: function () {
            /// <signature>
            ///     <param name="thisArg" />
            ///     <param name="..." optional="true" />
            /// </signature>   
        },
        bind: function () {
            /// <signature>
            ///     <param name="thisArg" />
            ///     <param name="..." optional="true" />
            ///     <returns type="Function" />
            /// </signature>   
        }
    });

    // Global object
    applyDoc(this, {
        eval: function () {
            /// <signature>
            ///     <param name="x" type="String" />
            /// </signature>
        },
        parseInt: function () {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <param name="radix" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        parseFloat: function () {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <returns type="Number" />
            /// </signature>
        },
        isNaN: function (number) {
            /// <signature>
            ///     <param name="number" type="Number" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        isFinite: function (number) {
            /// <signature>
            ///     <param name="number" type="Number" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        decodeURI: function (encodedURI) {
            /// <signature>
            ///     <param name="encodedURI" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        decodeURIComponent: function (encodedURIComponent) {
            /// <signature>
            ///     <param name="encodedURIComponent" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        encodeURI: function (uri) {
            /// <signature>
            ///     <param name="uri" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        encodeURIComponent: function (uriComponent) {
            /// <signature>
            ///     <param name="uriComponent" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        escape: function () {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        unescape: function () {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <returns type="String" />
            /// </signature>
        },
        Object: function () {
            /// <signature>
            /// </signature>
            /// <signature>
            ///     <param name="value" />
            /// </signature>
        },
        Function: function () {
            /// <signature>
            ///     <returns type="Function" />
            /// </signature>
            /// <signature>
            ///     <param name="body" type="String" />
            ///     <returns type="Function" />
            /// </signature>
            /// <signature>
            ///     <param name="..." type="String" optional="true" />
            ///     <param name="body" type="String" />
            ///     <returns type="Function" />
            /// </signature>
        },
        Array: function () {
            /// <signature>
            ///     <returns type="Array" />
            /// </signature>
            /// <signature>
            ///     <param name="len" type="Number" />
            ///     <returns type="Array" />
            /// </signature>
            /// <signature>
            ///     <param name="arg1" />
            ///     <param name="arg2" />
            ///     <param name="..." optional="true" />
            ///     <returns type="Array" />
            /// </signature>
        },
        String: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
            /// <signature>
            ///     <param name="value" />
            ///     <returns type="String" />
            /// </signature>
        },
        Boolean: function () {
            /// <signature>
            ///     <returns type="Boolean" />
            /// </signature>
            /// <signature>
            ///     <param name="value" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        Number: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
            /// <signature>
            ///     <param name="value" />
            ///     <returns type="Number" />
            /// </signature>
        },
        Date: function () {
            /// <signature>
            ///     <returns type="Date" />
            /// </signature>
            /// <signature>
            ///     <param name="date" type="String" />
            ///     <returns type="Date" />
            /// </signature>
            /// <signature>
            ///     <param name="year" type="Number"/>
            ///     <param name="month" type="Number"/>
            ///     <param name="date" type="Number" optional="true" />
            ///     <param name="hours" type="Number" optional="true" />
            ///     <param name="minutes" type="Number" optional="true" />
            ///     <param name="seconds" type="Number" optional="true" />
            ///     <param name="ms" type="Number" optional="true" />
            ///     <returns type="Date" />
            /// </signature>
        },
        RegExp: function () {
            /// <signature>
            ///     <param name="pattern" type="RegExp" />
            ///     <param name="flags" type="String" optional="true" />
            ///     <returns type="RegExp" />
            /// </signature>
        },
        Error: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="Error" />
            /// </signature>
        },
        EvalError: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="EvalError" />
            /// </signature>
        },
        RangeError: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="RangeError" />
            /// </signature>
        },
        ReferenceError: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="ReferenceError" />
            /// </signature>
        },
        SyntaxError: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="SyntaxError" />
            /// </signature>
        },
        TypeError: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="TypeError" />
            /// </signature>
        },
        URIError: function () {
            /// <signature>
            ///     <param name="message" type="String" optional="true" />
            ///     <returns type="URIError" />
            /// </signature>
        },
        Int8Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Int8Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Int8Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Int8Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Int8Array" />
            /// </signature>
        },
        Uint8Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Uint8Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Uint8Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Uint8Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Uint8Array" />
            /// </signature>
        },
        Int16Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Int16Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Int16Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Int16Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Int16Array" />
            /// </signature>
        },
        Uint16Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Uint16Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Uint16Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Uint16Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Uint16Array" />
            /// </signature>
        },
        Int32Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Int32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Int32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Int32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Int32Array" />
            /// </signature>
        },
        Uint32Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Uint32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Uint32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Uint32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Uint32Array" />
            /// </signature>
        },
        Float32Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Float32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Float32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Float32Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Float32Array" />
            /// </signature>
        },
        Float64Array: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Float64Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray"/>
            ///     <returns type="Float64Array" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType='Number' />
            ///     <returns type="Float64Array" />
            /// </signature>
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number"/>
            ///     <param name="length" type="Number"/>
            ///     <returns type="Float64Array" />
            /// </signature>
        },
        ArrayBuffer: function () {
            /// <signature>
            ///     <param name="length" type="Number"/>
            ///     <returns type="ArrayBuffer" />
            /// </signature>
        },
        DataView: function () {
            /// <signature>
            ///     <param name="buffer" type="ArrayBuffer"/>
            ///     <param name="byteOffset" type="Number" optional="true"/>
            ///     <param name="byteLength" type="Number" optional="true"/>
            ///     <returns type="DataView" />
            /// </signature>
        },
        ScriptEngine: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        },
        ScriptEngineMajorVersion: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        ScriptEngineMinorVersion: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        ScriptEngineBuildVersion: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        },
        CollectGarbage: function () {
            /// <signature>
            /// </signature>
        },
        CanvasPixelArray: function () {
            /// <signature>
            ///     <returns type="CanvasPixelArray" />
            /// </signature>
        }
    });

    // Date
    applyDoc(Date, {
        parse: function () {
            /// <signature>
            ///     <param name="string" type="String" />
            ///     <returns type="Number" />
            /// </signature>
        },
        UTC: function () {
            /// <signature>
            ///     <param name="year" type="Number"/>
            ///     <param name="month" type="Number"/>
            ///     <param name="date" type="Number" optional="true"/>
            ///     <param name="hours" type="Number" optional="true"/>
            ///     <param name="minutes" type="Number" optional="true"/>
            ///     <param name="seconds" type="Number" optional="true"/>
            ///     <param name="ms" type="Number" optional="true"/>
            ///     <returns type="Number" />
            /// </signature>
        },
        now: function () {
            /// <signature>
            ///     <returns type="Number" />
            /// </signature>
        }
    });

    // String object
    applyDoc(String, {
        fromCharCode: function () {
            /// <signature>
            /// 	<param name="char0" type="Number" optional="true" />
            /// 	<param name="..." optional="true" />
            /// 	<returns type="String" />
            /// </signature>
        }
    });

    // Error object
    applyDoc(Error.prototype, {
        toString: function () {
            /// <signature>
            ///     <returns type="String" />
            /// </signature>
        }
    });

    // Object object
    applyHooks(Object, Object, {
        create: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <param name="Properties" optional="true" />
            /// </signature>
        },
        defineProperty: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <param name="P" type="String" />
            ///     <param name="Attributes" type="Object" />
            /// </signature>
        },
        defineProperties: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <param name="Properties" type="Object" />
            /// </signature>
        },
        getPrototypeOf: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            /// </signature>
        },
        freeze: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Object" />
            /// </signature>
        },
        preventExtensions: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Object" />
            /// </signature>
        },
        seal: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Object" />
            /// </signature>
        }
    });

    applyHooks(Object, { value: true, writable: true, enumerable: true, configurable: true}, {
        getOwnPropertyDescriptor: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <param name="P" type="String" />
            /// </signature>
        }
    });

    applyHooks(Object, [""], {
        getOwnPropertyNames: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Array" />
            /// </signature>
        },
        keys: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Array" />
            /// </signature>
        }
    });

    applyHooks(Object, true, {
        isSealed: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        isFrozen: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Boolean" />
            /// </signature>
        },
        isExtensible: function () {
            /// <signature>
            ///     <param name="O" type="Object" />
            ///     <returns type="Boolean" />
            /// </signature>
        }
    });

    // Array
    applyDoc(Array, {
        isArray: function () {
            /// <signature>
            ///     <param name="arg" />
            ///     <returns type="Boolean" />
            /// </signature>
        }
    });

    var dataViewDoc = {
        getByte: function () {
            /// <signature>
            ///     <param name="byteOffset" type="Number" />
            ///     <returns type="Number" />
            /// </signature>
        },
        getBytes: function () {
            /// <signature>
            ///     <param name="byteOffset" type="Number" />
            ///     <param name="littleEndian" type="Boolean" optional="true" />
            ///     <returns type="Number" />
            /// </signature>
        }
    };

    // DataView object
    applyDoc(DataView.prototype, {
        getInt8: dataViewDoc.getByte,
        getUint8: dataViewDoc.getByte,
        getInt16: dataViewDoc.getBytes,
        getUint16: dataViewDoc.getBytes,
        getInt32: dataViewDoc.getBytes
    });

    // Typed array
    var typedArray = {
        set: function () {
            /// <signature>
            ///     <param name="index" type="Number" />
            ///     <param name="value" type="Number" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="TypedArray" />
            ///     <param name="offset" type="Number" optional="true" />
            /// </signature>
            /// <signature>
            ///     <param name="array" type="Array" elementType="Number" />
            ///     <param name="offset" type="Number" optional="true" />
            /// </signature>
        },
        subarray: function () {
            /// <signature>
            ///     <param name="begin" type="Number" />
            ///     <param name="end" type="Number" optional="true" />
            /// </signature>
        }
    };
    applyDoc(Int8Array.prototype, typedArray);
    applyDoc(Uint8Array.prototype, typedArray);
    applyDoc(Int16Array.prototype, typedArray);
    applyDoc(Uint16Array.prototype, typedArray);
    applyDoc(Int32Array.prototype, typedArray);
    applyDoc(Uint32Array.prototype, typedArray);
    applyDoc(Float32Array.prototype, typedArray);
    applyDoc(Float64Array.prototype, typedArray);
})();
// SIG // Begin signature block
// SIG // MIIaNAYJKoZIhvcNAQcCoIIaJTCCGiECAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFIz6COB0iGa4
// SIG // eWjZY93aXQTyfS5yoIIVLTCCBKAwggOIoAMCAQICCmEZ
// SIG // zJMAAQAAAGYwDQYJKoZIhvcNAQEFBQAweTELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IENv
// SIG // ZGUgU2lnbmluZyBQQ0EwHhcNMTExMDEwMjAzMjI1WhcN
// SIG // MTMwMTEwMjAzMjI1WjCBgzELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjENMAsGA1UECxMETU9QUjEeMBwGA1UEAxMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMIIBIjANBgkqhkiG9w0BAQEF
// SIG // AAOCAQ8AMIIBCgKCAQEA7lu+fREk44YG4Gb/SLUXvQLk
// SIG // tAwy8HI+fS6H106hsadDL/dlnjHhMjFFrtfBJIQh1y61
// SIG // hH76NdNTHNe2UR5Pzma567cMAv0pXK2oh/bKIrTVvwh1
// SIG // 9Ypwj2PX74oe6Y9DJGRa04d9kG07rHbNVzZ96LwQVqyY
// SIG // 8IldLmTGryYJXh5jFfE9vxaPmYgCwzC3wQtgHw9yzNa3
// SIG // qDUShpuhCwrmk1uO+lScwfMZX0KNEp8dP5C3JxODGTKC
// SIG // HfPZh9QhsjyitgdP1ySq7o31s9n6+TlPp+nyr1lS9NxB
// SIG // my8RcGPd6t6q8W0hBBBTM7uyT8XhU7JBZUduN/a86ZsW
// SIG // QZFrLlswwwIDAQABo4IBHTCCARkwEwYDVR0lBAwwCgYI
// SIG // KwYBBQUHAwMwHQYDVR0OBBYEFBtSDvMRKrfAicMRgT3U
// SIG // lli5o1NuMA4GA1UdDwEB/wQEAwIHgDAfBgNVHSMEGDAW
// SIG // gBTLEejK0rQWWAHJNy4zFha5TJoKHzBWBgNVHR8ETzBN
// SIG // MEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9NaWNDb2RTaWdQQ0FfMDgt
// SIG // MzEtMjAxMC5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsG
// SIG // AQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NlcnRzL01pY0NvZFNpZ1BDQV8wOC0zMS0yMDEw
// SIG // LmNydDANBgkqhkiG9w0BAQUFAAOCAQEApVs2bK1Om2kS
// SIG // 42+KAptpd8NsZHIoiNk9RW0sGHvUKC8T4llqG8ILNLeK
// SIG // /eq5lOwHMeZq9HUE06faXjoGnhD9qQ29nFFDb/9nlJzh
// SIG // z3zwJLA1zINd7trAbzZJwFoKV/Zz4Z7z4whMOz4vzNLN
// SIG // 7k8icPcEHwKmS5u4j1yIDjaUbDMHuKmtUaDQwtyOIhK9
// SIG // w9+C11ah993wpSBXEBCd7qyGdGxxm8Hw8sJwXqfbbU03
// SIG // WJlNeUDQNF1aJa5n6xtORgawjCkfoxCPpTOfI9X4tUZ9
// SIG // 4O5jmJBLPgWoL7AYs1mkr0FTjggFEC0qyToGTBwuqTFR
// SIG // VmSsmsysl5gpipeQh+qdtjCCBLowggOioAMCAQICCmEF
// SIG // EzYAAAAAABowDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTExMDcyNTIwNDIxN1oXDTEy
// SIG // MTAyNTIwNDIxN1owgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjoxNTlDLUEzRjctMjU3MDElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJw0mBnJ
// SIG // CSljmQIWdaiIV32hu6lBEvxkkaXWBXi/d9zs5q64UE7A
// SIG // 4xq97bf9+CCKcTmqcpJyn4oJ5RPvkUHtYSVrUa3uqEO1
// SIG // YUIsnfIdsdL8t/V7o3N2E7Mro9uUYYBVoQ9t3djsFv+F
// SIG // f5aeiH8ALo56JLponY/GyvSQeXrhm+8GXX74LsNqFZw8
// SIG // FC/n1ZTIIhtRy6lVhiG3WvNBEjmf8FWpTqolK2P7kXI8
// SIG // D3zAlnLcwaPBCMrexcm1wApfpZwLqnIKXQpAfS6Y0Kuy
// SIG // iI+GgOh90b5Va+BYLMg2P/nmEcPwQwWFeAMX5SynKXzT
// SIG // 4pUXAGzb3K08GToC4H1i1M72HT0CAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBT2g4sghxHug8vb3oWi0miGN2F0kDAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBi9AUNT+cba4LnUgzfeYyo
// SIG // VYEzl9Okysn+r0jbe9pveihPx9C3idjRppnMkVYAOzjo
// SIG // tzIv7vnPa9mY3tYC9UJYUmuO2kDcFqCz1L8mFctIQszT
// SIG // /bT65ESJZg9CDl73BJ8jSFu0iUHE2mz4NvQ/wh4V35hM
// SIG // AMSy7N5fAQFDnLhC1iLIk5qeyaUYZ/xHhB6RXZvydvex
// SIG // jnIdgHY8NhFGyn46SPOv40n2FzONuwBjgpxXo1anw26Q
// SIG // oz6Vt/xk0V0YwgsBUGOn/PPRgJ6E4zI03VeVQKNtftrr
// SIG // LloItBAGXjLJCekygnEWp/rGr2aYifnZnrVfECOjd4Dy
// SIG // TdYoAHJQhbzlMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
// SIG // MTANBgkqhkiG9w0BAQUFADBfMRMwEQYKCZImiZPyLGQB
// SIG // GRYDY29tMRkwFwYKCZImiZPyLGQBGRYJbWljcm9zb2Z0
// SIG // MS0wKwYDVQQDEyRNaWNyb3NvZnQgUm9vdCBDZXJ0aWZp
// SIG // Y2F0ZSBBdXRob3JpdHkwHhcNMTAwODMxMjIxOTMyWhcN
// SIG // MjAwODMxMjIyOTMyWjB5MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSMwIQYDVQQDExpNaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBALJyWVwZMGS/HZpgICBCmXZTbD4b1m/My/Hqa/6X
// SIG // FhDg3zp0gxq3L6Ay7P/ewkJOI9VyANs1VwqJyq4gSfTw
// SIG // aKxNS42lvXlLcZtHB9r9Jd+ddYjPqnNEf9eB2/O98jak
// SIG // yVxF3K+tPeAoaJcap6Vyc1bxF5Tk/TWUcqDWdl8ed0WD
// SIG // hTgW0HNbBbpnUo2lsmkv2hkL/pJ0KeJ2L1TdFDBZ+NKN
// SIG // Yv3LyV9GMVC5JxPkQDDPcikQKCLHN049oDI9kM2hOAaF
// SIG // XE5WgigqBTK3S9dPY+fSLWLxRT3nrAgA9kahntFbjCZT
// SIG // 6HqqSvJGzzc8OJ60d1ylF56NyxGPVjzBrAlfA9MCAwEA
// SIG // AaOCAV4wggFaMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0O
// SIG // BBYEFMsR6MrStBZYAck3LjMWFrlMmgofMAsGA1UdDwQE
// SIG // AwIBhjASBgkrBgEEAYI3FQEEBQIDAQABMCMGCSsGAQQB
// SIG // gjcVAgQWBBT90TFO0yaKleGYYDuoMW+mPLzYLTAZBgkr
// SIG // BgEEAYI3FAIEDB4KAFMAdQBiAEMAQTAfBgNVHSMEGDAW
// SIG // gBQOrIJgQFYnl+UlE/wq4QpTlVnkpDBQBgNVHR8ESTBH
// SIG // MEWgQ6BBhj9odHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
// SIG // cGtpL2NybC9wcm9kdWN0cy9taWNyb3NvZnRyb290Y2Vy
// SIG // dC5jcmwwVAYIKwYBBQUHAQEESDBGMEQGCCsGAQUFBzAC
// SIG // hjhodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpL2Nl
// SIG // cnRzL01pY3Jvc29mdFJvb3RDZXJ0LmNydDANBgkqhkiG
// SIG // 9w0BAQUFAAOCAgEAWTk+fyZGr+tvQLEytWrrDi9uqEn3
// SIG // 61917Uw7LddDrQv+y+ktMaMjzHxQmIAhXaw9L0y6oqhW
// SIG // nONwu7i0+Hm1SXL3PupBf8rhDBdpy6WcIC36C1DEVs0t
// SIG // 40rSvHDnqA2iA6VW4LiKS1fylUKc8fPv7uOGHzQ8uFaa
// SIG // 8FMjhSqkghyT4pQHHfLiTviMocroE6WRTsgb0o9ylSpx
// SIG // bZsa+BzwU9ZnzCL/XB3Nooy9J7J5Y1ZEolHN+emjWFbd
// SIG // mwJFRC9f9Nqu1IIybvyklRPk62nnqaIsvsgrEA5ljpnb
// SIG // 9aL6EiYJZTiU8XofSrvR4Vbo0HiWGFzJNRZf3ZMdSY4t
// SIG // vq00RBzuEBUaAF3dNVshzpjHCe6FDoxPbQ4TTj18KUic
// SIG // ctHzbMrB7HCjV5JXfZSNoBtIA1r3z6NnCnSlNu0tLxfI
// SIG // 5nI3EvRvsTxngvlSso0zFmUeDordEN5k9G/ORtTTF+l5
// SIG // xAS00/ss3x+KnqwK+xMnQK3k+eGpf0a7B2BHZWBATrBC
// SIG // 7E7ts3Z52Ao0CW0cgDEf4g5U3eWh++VHEK1kmP9QFi58
// SIG // vwUheuKVQSdpw5OPlcmN2Jshrg1cnPCiroZogwxqLbt2
// SIG // awAdlq3yFnv2FoMkuYjPaqhHMS+a3ONxPdcAfmJH0c6I
// SIG // ybgY+g5yjcGjPa8CQGr/aZuW4hCoELQ3UAjWwz0wggYH
// SIG // MIID76ADAgECAgphFmg0AAAAAAAcMA0GCSqGSIb3DQEB
// SIG // BQUAMF8xEzARBgoJkiaJk/IsZAEZFgNjb20xGTAXBgoJ
// SIG // kiaJk/IsZAEZFgltaWNyb3NvZnQxLTArBgNVBAMTJE1p
// SIG // Y3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
// SIG // eTAeFw0wNzA0MDMxMjUzMDlaFw0yMTA0MDMxMzAzMDla
// SIG // MHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xITAfBgNVBAMTGE1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQTCCASIwDQYJKoZI
// SIG // hvcNAQEBBQADggEPADCCAQoCggEBAJ+hbLHf20iSKnxr
// SIG // LhnhveLjxZlRI1Ctzt0YTiQP7tGn0UytdDAgEesH1VSV
// SIG // FUmUG0KSrphcMCbaAGvoe73siQcP9w4EmPCJzB/LMySH
// SIG // nfL0Zxws/HvniB3q506jocEjU8qN+kXPCdBer9CwQgSi
// SIG // +aZsk2fXKNxGU7CG0OUoRi4nrIZPVVIM5AMs+2qQkDBu
// SIG // h/NZMJ36ftaXs+ghl3740hPzCLdTbVK0RZCfSABKR2YR
// SIG // JylmqJfk0waBSqL5hKcRRxQJgp+E7VV4/gGaHVAIhQAQ
// SIG // MEbtt94jRrvELVSfrx54QTF3zJvfO4OToWECtR0Nsfz3
// SIG // m7IBziJLVP/5BcPCIAsCAwEAAaOCAaswggGnMA8GA1Ud
// SIG // EwEB/wQFMAMBAf8wHQYDVR0OBBYEFCM0+NlSRnAK7UD7
// SIG // dvuzK7DDNbMPMAsGA1UdDwQEAwIBhjAQBgkrBgEEAYI3
// SIG // FQEEAwIBADCBmAYDVR0jBIGQMIGNgBQOrIJgQFYnl+Ul
// SIG // E/wq4QpTlVnkpKFjpGEwXzETMBEGCgmSJomT8ixkARkW
// SIG // A2NvbTEZMBcGCgmSJomT8ixkARkWCW1pY3Jvc29mdDEt
// SIG // MCsGA1UEAxMkTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNh
// SIG // dGUgQXV0aG9yaXR5ghB5rRahSqClrUxzWPQHEy5lMFAG
// SIG // A1UdHwRJMEcwRaBDoEGGP2h0dHA6Ly9jcmwubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL21pY3Jvc29m
// SIG // dHJvb3RjZXJ0LmNybDBUBggrBgEFBQcBAQRIMEYwRAYI
// SIG // KwYBBQUHMAKGOGh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY2VydHMvTWljcm9zb2Z0Um9vdENlcnQuY3J0
// SIG // MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
// SIG // BQUAA4ICAQAQl4rDXANENt3ptK132855UU0BsS50cVtt
// SIG // DBOrzr57j7gu1BKijG1iuFcCy04gE1CZ3XpA4le7r1ia
// SIG // HOEdAYasu3jyi9DsOwHu4r6PCgXIjUji8FMV3U+rkuTn
// SIG // jWrVgMHmlPIGL4UD6ZEqJCJw+/b85HiZLg33B+JwvBhO
// SIG // nY5rCnKVuKE5nGctxVEO6mJcPxaYiyA/4gcaMvnMMUp2
// SIG // MT0rcgvI6nA9/4UKE9/CCmGO8Ne4F+tOi3/FNSteo7/r
// SIG // vH0LQnvUU3Ih7jDKu3hlXFsBFwoUDtLaFJj1PLlmWLMt
// SIG // L+f5hYbMUVbonXCUbKw5TNT2eb+qGHpiKe+imyk0Bnca
// SIG // Ysk9Hm0fgvALxyy7z0Oz5fnsfbXjpKh0NbhOxXEjEiZ2
// SIG // CzxSjHFaRkMUvLOzsE1nyJ9C/4B5IYCeFTBm6EISXhrI
// SIG // niIh0EPpK+m79EjMLNTYMoBMJipIJF9a6lbvpt6Znco6
// SIG // b72BJ3QGEe52Ib+bgsEnVLaxaj2JoXZhtG6hE6a/qkfw
// SIG // Em/9ijJssv7fUciMI8lmvZ0dhxJkAj0tr1mPuOQh5bWw
// SIG // ymO0eFQF1EEuUKyUsKV4q7OglnUa2ZKHE3UiLzKoCG6g
// SIG // W4wlv6DvhMoh1useT8ma7kng9wFlb4kLfchpyOZu6qeX
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBHMwggRv
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggaAwGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFMnf
// SIG // P/sLAiSF3mmP98no77E9VH57MEAGCisGAQQBgjcCAQwx
// SIG // MjAwoBaAFABsAGkAYgBoAGUAbABwAC4AagBzoRaAFGh0
// SIG // dHA6Ly9taWNyb3NvZnQuY29tMA0GCSqGSIb3DQEBAQUA
// SIG // BIIBAOivuXhHeDUXESbmVWNtj6/u7n7qAfOo//gKDxFo
// SIG // PV4EdcT949bF/rFNiQZ5rm6ps5MYToLCrDFd/FKiBzve
// SIG // fy8tLobyKTlPPYZFYhanfDAQ5w5aPmlQjrZeEd5X1KBJ
// SIG // 82D0pVWREMUT9CWeKITngYyvhoo7Hx6zPKOedmKmegZ4
// SIG // e5j5uV2xS9fp6Mo+5SnzceRgS/wD8JLXn4k+ZWJeeQkO
// SIG // bxW+IUU+WsVQX4Cx4JqYP7xdUH9dYrvKyf2qPtxgAQfj
// SIG // RDODjjGCclUZhCYMRWgKRIA8DG9cAkXYv8QwCcmPlYmA
// SIG // lSqblix8VFr3dUcAk2E3h+0WltbX81mZLSX7V5+hggId
// SIG // MIICGQYJKoZIhvcNAQkGMYICCjCCAgYCAQEwgYUwdzEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBAgphBRM2AAAAAAAaMAcG
// SIG // BSsOAwIaoF0wGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEH
// SIG // ATAcBgkqhkiG9w0BCQUxDxcNMTIwNzI3MDE0NjI2WjAj
// SIG // BgkqhkiG9w0BCQQxFgQU3lXiVRCbUaO9pqz6KEFsXVQu
// SIG // uu4wDQYJKoZIhvcNAQEFBQAEggEAVDtJJDBZNoIxm64z
// SIG // DUr8IUbcSzur6CjhfTiE5chGypeoGsNtwBcKTxYnRi+1
// SIG // 38SKfbfm44oxsPuPArLp+8jUGNwA+dYox2b8MB1PvK/e
// SIG // fzXsVuO5ohdLeVD0aYUFUIFB6BZ93C8ZKTWHZ2cn6LpA
// SIG // AzfHs/QdBGb2NcXjwXzKx0W6w3ErQkwY/n9hWecBwTib
// SIG // BtPzxkOFF2AhMdDIPWrBCKVGXLPNchH79x1/Xw4hP6d9
// SIG // b7oVZfkteS6V1TJOdXeWbZrvtbz5flzM5AOjo+4SDr21
// SIG // /a/wtaSQLetttvs1pdnY2Bpefnmo/5m+vwHJ4mu0yjPT
// SIG // r8LWbn1PolNGPD1+Iw==
// SIG // End signature block
