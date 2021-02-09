
intellisense.enableMicrosoftAjaxLog = function (logLevel) { 
/// <summary>Enables Microsoft Ajax VSIntellisense extension logging</summary>
/// <param name="logLevel" type="String">Acceptable values are "info", "warning", and "error"</param>

    intellisense.logMessage("Passed in log level is " + logLevel);
    if(logLevel) {
        switch(logLevel.trim().toLowerCase())
        {
            case "info":
                intellisense["MicrosoftAjaxLogLevelInfo"] = true;
                intellisense.logMessage("Setting log level info.");
                // Intentional fallthrough
            case "warning":
                intellisense["MicrosoftAjaxLogLevelWarning"] = true;
                intellisense.logMessage("Setting log level warning.");
                // Intentional fallthrough
            case "error":
                intellisense["MicrosoftAjaxLogLevelError"] = true;
                intellisense.logMessage("Setting log level error.");
        }
    }
};


(function () {


    function logError(message) {
        intellisense.logMessage("MicrosoftAjax.intellisense error: " + message);
    }

    function logWarning(message) {
        intellisense.logMessage("MicrosoftAjax.intellisense warning: " + message);
    }

    function logInfo(message) {
        intellisense.logMessage("MicrosoftAjax.intellisense info: " + message);
    }

    // Override runtime validation functions to improve perf and avoid unnecessary errors
    Function._validateParams = function Function$_validateParams(params, expectedParams, validateParameterCount) {
        return null;
    }

    String._toFormattedString = function String$_toFormattedString(useLocale, args) {
        return "";
    }


    function getMetaFieldNames(functionObject) {
        /// <summary>Returns the names of the doc-comment fields defined in the passed in function</summary>
        /// <param name="functionObject" type="Function">Function to search for doc-comment field definitions</param>
        /// <returns type="Object">Map of meta-field names to "MetaField" marker string.</returns>

        if(!functionObject) {
            return null;
        }

        var functionDocComments = getFunctionDocComments(functionObject);
        if (!functionDocComments) {
            return null;
        }

        var fieldSet = {};

        var fieldNamesRegExp = /<field\s+[^>]*name=[\'\"]{1}([^\'\"]*)[\'\"]{1}/g;
        var fieldNameCaptureIndex = 1;
        var results;
        while (results = fieldNamesRegExp.exec(functionDocComments)) {
            var metaField = results[fieldNameCaptureIndex];
            if (logInfos) logInfo("Found meta-field: " + metaField); 
            fieldSet[metaField] = "MetaField";
        }

        return fieldSet;
    }

    function getFunctionDocComments(functionObject) {
        /// <summary>Returns XML doc-comment text of function</summary>
        /// <param name="functionObject" type="Function">Function to search for doc-comments</param>
        /// <returns type="String">Doc-comment content after stripping the leading ///</returns>

        var functionCode = functionObject.toString();
        var functionDocComments = "";

        var line;
        var nextLineStartPos = functionCode.indexOf('{');

        if (nextLineStartPos < 0)
            return null;
        else
            nextLineStartPos++;

        while ((line = getLine(nextLineStartPos, functionCode)) && (line.length > 0)) {
            var docCommentLine = getDocCommentLine(line);
            if (docCommentLine == null)
                break;
            else if (docCommentLine.length > 0)
                functionDocComments += docCommentLine;

            nextLineStartPos += line.length;
        }

        if (logInfos) logInfo("Got function doc-comments: " + functionDocComments);

        return functionDocComments;
    }

    function getLine(startPosition, multiLineText) {
        /// <summary>First line starting at the specified position within passed in text</summary>
        /// <param name="startPosition" type="Number">Search start position</param>
        /// <param name="multiLineText" type="String">Multi-line text to search for the next line</param>
        /// <returns type="String">Single line starting at the specified position or null at the end of the text.</returns>
   
        if (startPosition === undefined || multiLineText === undefined)
            return null;

        if(startPosition >= multiLineText.length)
            return null;

        for(var position = startPosition; position < multiLineText.length; position++) {
            if(multiLineText[position] == '\r' || multiLineText[position] == '\n') {
                if (multiLineText[position] == '\r' && position + 1 < multiLineText.length && multiLineText[position + 1] == '\n')
                    position++;
                return multiLineText.substring(startPosition, position + 1);
            }
        }

        return multiLineText.substring(startPosition);
    }

    function getDocCommentLine(line) {
        /// <summary>Returns text of the XML doc-comment one the line</summary>
        /// <param name="line" type="String"></param>
        /// <returns type="String">Doc-comment line content stripping leading ///, or null if the line is not a doc-comment line</returns>

        var docComment = "///";

        line = line.trim();

        // Blank lines are fine
        if (line.length == 0)
            return "";

        // Non-blank line that doesn't start with "///" is not considered a doc-comment line
        if (!line.startsWith(docComment))
            return null;
        
        // Don't allow more than three slashes at the start
        if (line.length > docComment.length && line[docComment.length + 1] == '/')
            return null;

        // Empty doc-comment lines are fine
        if (line.length == docComment.length)
            return "";

        return line.substring(docComment.length);
    }


    intellisense.addEventListener('statementcompletion', function (e) {

        function addInheritedItems() {
            
            if(intellisense["MicrosoftAjaxLogLevelInfo"]) logInfo("In addInheritedItems");

            if (contextMsAjaxType == "class") {
                if (e.target.resolveInheritance) {
                    var childMemberCache = new Object();
                    for (var member in e.target) {
                        childMemberCache[member] = member;
                    }
             
                    e.target.resolveInheritance();
             
                    for (var member in e.target) {
                        if (!childMemberCache[member]) {
                            var kind = isFunction(e.target[member]) ? "method" : "field";
                            e.items.push({ name: member, kind: kind, value: e.target[member], parentObject: e.target }); 
                        }
                    }
                }
            }

            if (logInfos) logInfo("Exiting addInheritedItems");
        }


        function isFunction(obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        }

        function filterItems() {

            if (logInfos) logInfo("Entering filterItems for " + e.items.length + " items");

            e.items = e.items.filter(filterItem);

            if (logInfos) logInfo("Exiting filterItems");

        }

        function filterItem(item) {

            if (logInfos) logInfo("");
            if (logInfos) logInfo("Filtering item: " + item.name);

            var hidden = false;
            var msAjaxType = null;
        
            hidden = item.name[0] == "_";
            hidden |= item.name.indexOf("$") > 0;

            if (hidden) {
                var contextIsThis = false;
                if (e.targetName && e.targetName == "this") { 
                    contextIsThis = true;
                }
                if (logInfos) logInfo("Context is this: " + contextIsThis + " (it is " + e.targetName + ")");
                if (contextIsThis && !isGlobalScope) {
                    // Don"t hide any members when completion is invoked on "this."
                    // and "this" is not global scope
                    hidden = false;
                }
                else if (isGlobalScope) {
                    if (logInfos) logInfo("In global scope item value for item " + item.name + " is " + item.value);
                    msAjaxType = getMicrosoftAjaxTypeForObject(item.value);
                    if (msAjaxType == null) {
                        hidden = false;
                    }
                }
            }

            // For Enums and Flags, we show fields only
            if (!hidden && isEnumContext) {

                if (item.kind != "field") {
                    hidden = true;
                    if (logInfos) logInfo("Filtering out non-field member " + item.name + " on a " + contextMsAjaxType);
                }
                else if (enumMetaFields && (enumMetaFields[item.name] != "MetaField")) {
                    hidden = true;
                    if (logInfos) logInfo("Filtering out non-meta-field member " + item.name + " on a " + contextMsAjaxType);
                }
            }

            return !hidden;
        }

        function setItemsGlyphs() {
            e.items.forEach(setItemGlyph);
        }

        function setItemGlyph(item) {

            if (logInfos) logInfo("Setting item glyph for: " + item.name);

            if (isEnumContext) {
                item.glyph = "vs:GlyphGroupEnumMember";
            }
            else if (item.name.indexOf("set_") == 0 || item.name.indexOf("get_") == 0) {
                if (item.kind == "method") {
                    item.kind = "property";
                }
            }
            else if (item.name.indexOf("add_") == 0 || item.name.indexOf("remove_") == 0) {
                if (item.kind == "method") {
                    item.glyph = "vs:GlyphGroupEvent";
                }
            }
            else {
                var itemValue = item.value;
                if(itemValue) {
                    var ajaxType = getMicrosoftAjaxType(itemValue);
                    if (ajaxType != null) {
                        switch (ajaxType) {
                            case "class":
                                item.glyph = "vs:GlyphGroupClass";
                                break;
                            case "namespace":
                                item.glyph = "vs:GlyphGroupNamespace";
                                break;
                            case "interface":
                                item.glyph = "vs:GlyphGroupInterface";
                                break;
                            case "enum":
                            case "flags":
                                item.glyph = "vs:GlyphGroupEnum";
                            default:
                                if (logErrors) logError("Unknown Microsoft Ajax type: " + ajaxType);
                        }
                    }
                }
            }
        }

        function isFlagsOrEnumItem(item) {
            if (logInfos) logInfo("Entering isFlagsOrEnumItem for: " + item.name);
            var microsoftAjaxType = getMicrosoftAjaxTypeForObject(item.value);
            return isFlagsOrEnumType(microsoftAjaxType);
        }

        function isFlagsOrEnumType(microsoftAjaxType) {
            return microsoftAjaxType == "enum" || microsoftAjaxType == "flags";
        }

        function getMicrosoftAjaxTypeForObject(object) {
            
            var ajaxType = null;

            if (object) {
                ajaxType = getMicrosoftAjaxType(object);

                if (ajaxType == null) {
                    var objectConstructor = object.constructor;
                    if (objectConstructor) {
                        ajaxType = getMicrosoftAjaxType(objectConstructor);
                        if (ajaxType != null) { 
                            if (logInfos) logInfo("Got MS Ajax type for object constructor: " + ajaxType);
                        }
                    }
                }
                else {
                    if (logInfos) logInfo("Got MS Ajax type for object itself: " + ajaxType);
                }
            }

            return ajaxType;
        }

        function getMicrosoftAjaxType(obj) {

            var ajaxType = null;

            if (obj.__class)
                ajaxType = "class";
            else if (obj.__interface)
                ajaxType = "interface";
            else if (obj.__namespace)
                ajaxType = "namespace";
            else if (obj.__flags)
                ajaxType = "flags";
            else if (obj.__enum)
                ajaxType = "enum";

            return ajaxType;
        }

        function isGlobalScopeCompletionList() {

            var result = false;

            for (var i = 0; i < e.items.length; i++) {
                if (e.items[i].name == "break") {
                    result = true;
                    break;
                }
            }

            return result;
        }

        var logErrors = !!intellisense["MicrosoftAjaxLogLevelError"];
        var logWarnings = !!intellisense["MicrosoftAjaxLogLevelWarning"];
        var logInfos = !!intellisense["MicrosoftAjaxLogLevelInfo"];
        
        if (logInfos) logInfo("In addCompletionHandler\n");
//        if (logInfos) logInfo("e.target is " + e.target);
        if (logInfos) logInfo("e.targetName is " + e.targetName);
        if (logInfos) logInfo("e.offset is " + e.offset);

        var isGlobalScope = isGlobalScopeCompletionList();
        var contextMsAjaxType = isGlobalScope ? null : getMicrosoftAjaxTypeForObject(e.target);
        var isEnumContext = contextMsAjaxType != null ? isFlagsOrEnumType(contextMsAjaxType) : false;
        var enumMetaFields = isEnumContext ? getMetaFieldNames(e.target) : {};

        if (logInfos) logInfo("isGlobalScope is " + isGlobalScope);
        if (logInfos) logInfo("contextMsAjaxType is " + contextMsAjaxType + "\n");
        if (logInfos) logInfo("isEnumContext is " + isEnumContext + "\n");

        addInheritedItems();
        filterItems();
        setItemsGlyphs();
    });
    

    intellisense.addEventListener('signaturehelp', function (e) {

        function getPropertyType(comments) {
            /// <param name="comments" type="String" />

            var propertyType = "";

            var docCommentStart = comments.indexOf("<value");
            if (docCommentStart == -1) {
                if (logWarnings) logWarning("<value> doc comment is not found.");
                return "";
            }

            var docCommentEnd = comments.indexOf("</value>", docCommentStart);
            if (docCommentEnd == -1) {
                docCommentEnd = comments.indexOf("/>", docCommentStart);
                if (docCommentEnd == -1) {
                    if (logWarnings) logWarning("End of <value> doc comment is not found.");
                    return "";
                }
            }

            var typeStart = comments.indexOf("type", docCommentStart);
            if (typeStart == -1 || typeStart > docCommentEnd)
                return "";

            var typeValueStart = comments.indexOf("\"", typeStart);
            if (typeValueStart == -1 || typeValueStart > docCommentEnd)
                return "";

            var typeValueEnd = comments.indexOf("\"", typeValueStart + 1);
            if (typeValueEnd == -1 || typeValueEnd > docCommentEnd)
                return "";

            propertyType = comments.substring(typeValueStart + 1, typeValueEnd);

            return propertyType;
        }

        function fixupSetterSignature(signature) {
            if (logInfos) logInfo("Fixing signature for type " + getterType);
            if (getterType) {                
                if (signature.params.length > 0) {
                    signature.params[0].type = getterType;
                }
            }
            else {
                if(intellisense["MicrosoftAjaxLogLevelError"]) logError("No getter.");
            }
        }

        function fixupSetter() {

            var baseName = e.functionHelp.functionName.substring("set_".length);
            var getterName = "get_" + baseName;

            if (e.parentObject) {
                var getterFunction = e.parentObject[getterName];
                if (getterFunction) {
                    var comments = intellisense.getFunctionComments(getterFunction);
                    if (comments && comments.inside) { 
                        if (logInfos) logInfo("Comments is " + comments.inside);
                        getterType = getPropertyType(comments.inside);
                        if (logInfos) logInfo("Matching getter type is " + getterType);
                        if (e.functionHelp.signatures) {
                            e.functionHelp.signatures.forEach(fixupSetterSignature);
                        }
                    }
                    else { 
                        if (logWarnings) logWarning("No doc-comments in matching getter " + getterName);
                    }
                }
                else {
                    if (logWarnings) logWarning("No matching getter for seter " + e.functionHelp.functionName);
                }
            }
        }

        var logErrors = !!intellisense["MicrosoftAjaxLogLevelError"];
        var logWarnings = !!intellisense["MicrosoftAjaxLogLevelWarning"];
        var logInfos = !!intellisense["MicrosoftAjaxLogLevelInfo"];

        if (logInfos) logInfo("In addEventListener(functionHelp)");

        var getterType = null;

        if (e.functionHelp.functionName.indexOf("set_") == 0 && e.functionHelp.functionName.length > "set_".length) {
            fixupSetter();
        }
    });

})();



// SIG // Begin signature block
// SIG // MIIaXAYJKoZIhvcNAQcCoIIaTTCCGkkCAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFPGYDTpJfBfR
// SIG // iQoQ/FjJVFoUdD+5oIIVLTCCBKAwggOIoAMCAQICCmEZ
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
// SIG // VmSsmsysl5gpipeQh+qdtjCCBLowggOioAMCAQICCmEC
// SIG // jkIAAAAAAB8wDQYJKoZIhvcNAQEFBQAwdzELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBMB4XDTEyMDEwOTIyMjU1OFoXDTEz
// SIG // MDQwOTIyMjU1OFowgbMxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // DTALBgNVBAsTBE1PUFIxJzAlBgNVBAsTHm5DaXBoZXIg
// SIG // RFNFIEVTTjpGNTI4LTM3NzctOEE3NjElMCMGA1UEAxMc
// SIG // TWljcm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCASIw
// SIG // DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJbsjkdN
// SIG // VMJclYDXTgs9v5dDw0vjYGcRLwFNDNjRRi8QQN4LpFBS
// SIG // EogLQ3otP+5IbmbHkeYDym7sealqI5vNYp7NaqQ/56ND
// SIG // /2JHobS6RPrfQMGFVH7ooKcsQyObUh8yNfT+mlafjWN3
// SIG // ezCeCjOFchvKSsjMJc3bXREux7CM8Y9DSEcFtXogC+Xz
// SIG // 78G69LPYzTiP+yGqPQpthRfQyueGA8Azg7UlxMxanMTD
// SIG // 2mIlTVMlFGGP+xvg7PdHxoBF5jVTIzZ3yrDdmCs5wHU1
// SIG // D92BTCE9djDFsrBlcylIJ9jC0rCER7t4utV0A97XSxn3
// SIG // U9542ob3YYgmM7RHxqBUiBUrLHUCAwEAAaOCAQkwggEF
// SIG // MB0GA1UdDgQWBBQv6EbIaNNuT7Ig0N6JTvFH7kjB8jAf
// SIG // BgNVHSMEGDAWgBQjNPjZUkZwCu1A+3b7syuwwzWzDzBU
// SIG // BgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLm1pY3Jv
// SIG // c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNyb3Nv
// SIG // ZnRUaW1lU3RhbXBQQ0EuY3JsMFgGCCsGAQUFBwEBBEww
// SIG // SjBIBggrBgEFBQcwAoY8aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNyb3NvZnRUaW1lU3Rh
// SIG // bXBQQ0EuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4IBAQBz/30unc2NiCt8feNeFXHp
// SIG // aGLwCLZDVsRcSi1o2PlIEZHzEZyF7BLUVKB1qTihWX91
// SIG // 7sb1NNhUpOLQzHyXq5N1MJcHHQRTLDZ/f/FAHgybgOIS
// SIG // CiA6McAHdWfg+jSc7Ij7VxzlWGIgkEUvXUWpyI6zfHJt
// SIG // ECfFS9hvoqgSs201I2f6LNslLbldsR4F50MoPpwFdnfx
// SIG // Jd4FRxlt3kmFodpKSwhGITWodTZMt7MIqt+3K9m+Kmr9
// SIG // 3zUXzD8Mx90Gz06UJGMgCy4krl9DRBJ6XN0326RFs5E6
// SIG // Eld940fGZtPPnEZW9EwHseAMqtX21Tyi4LXU+Bx+BFUQ
// SIG // axj0kc1Rp5VlMIIFvDCCA6SgAwIBAgIKYTMmGgAAAAAA
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
// SIG // zjEp/w7FW1zYTRuh2Povnj8uVRZryROj/TGCBJswggSX
// SIG // AgEBMIGHMHkxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xIzAhBgNV
// SIG // BAMTGk1pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENBAgph
// SIG // GcyTAAEAAABmMAkGBSsOAwIaBQCggcYwGQYJKoZIhvcN
// SIG // AQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEO
// SIG // MAwGCisGAQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFEu1
// SIG // Oc480dKYvqDsD1jdZc9R3KU1MGYGCisGAQQBgjcCAQwx
// SIG // WDBWoDyAOgBNAGkAYwByAG8AcwBvAGYAdABBAGoAYQB4
// SIG // AC4AaQBuAHQAZQBsAGwAaQBzAGUAbgBzAGUALgBqAHOh
// SIG // FoAUaHR0cDovL21pY3Jvc29mdC5jb20wDQYJKoZIhvcN
// SIG // AQEBBQAEggEAvv/b/ldq710M2VTs+aDI+naxnNduRLw0
// SIG // eAQ4kfZa+MrOxjbJz++tPGx0kwV5xBRdxajz0Iszra8a
// SIG // 8DTSA8Cb/WwM78ygy2Iq1JqoOWCwCd9Z1dIGPwc5XZeZ
// SIG // QlO8vyMRc6ntgE0mvmmNOBLjjsH7V4FciDW+gr4Rdp3/
// SIG // Q9695SCl1938EtJZEjZnTYVx+W/acojMXDWahjA0PQBc
// SIG // U0RRNDMoxyBi75KfRsSb1vJL3y9ClCtwFBq43+jG8eB+
// SIG // 9ttUWZAB7vYo0F8sl/JbBnj+vNgYJGr2dThEAM6fXC8K
// SIG // 3H4alPjH9BDYReKTLF18V1iCB3H7MclqZ/y0GOwSLa3N
// SIG // i6GCAh8wggIbBgkqhkiG9w0BCQYxggIMMIICCAIBATCB
// SIG // hTB3MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSEwHwYDVQQDExhN
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0ECCmECjkIAAAAA
// SIG // AB8wCQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkq
// SIG // hkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTEyMDcyNzAx
// SIG // NDYyNlowIwYJKoZIhvcNAQkEMRYEFAcpewoxirBrICQz
// SIG // 1meraqj+rF6KMA0GCSqGSIb3DQEBBQUABIIBAH4QKNxW
// SIG // 8KbTrS515E8lyIp2EeuxcXVc7KX0rGZmLRBuAkatSVME
// SIG // A4iZOwIWPbcsM+pdBD+q94bCY5RjLg77SSa8sn3AjvME
// SIG // 7GvBTk4nKv1JZZU4cwUKmkREeOhtS0t/5oLPdyV/Uo86
// SIG // F67o/TgPls4LWmAKFDS7sSOG2Zz64fVW7cQ2rnL+uMyw
// SIG // Fi/HqCCKGMaivp6Z+51v0F9lRGZYxTjUKcR9gUvf78/t
// SIG // rV96UfM+EcueVbP5+VRTKeqNWiy9OVeC40EH89SfP4yd
// SIG // IH6rSsVIhrL46F4bUZXA/VYCgqtnZRjtJxvBZXWBol8z
// SIG // j808Ttq3j/I1KGk2/w86uKGSDjU=
// SIG // End signature block
