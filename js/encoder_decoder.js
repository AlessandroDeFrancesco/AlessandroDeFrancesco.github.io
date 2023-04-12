function encodeString(clearText, key) {
    var encodedKey = key.toString(16);
    var encodedString = make2DigitsLong(encodedKey);
    for(var n=0; n < clearText.length; n++) {
        var charCode = clearText.charCodeAt(n);
        var encoded = charCode ^ key;
        var value = encoded.toString(16);
        encodedString += make2DigitsLong(value);
    }
    return encodedString;
}

function make2DigitsLong(value){
    return value.length === 1 
        ? '0' + value
        : value;
}

function decodeString(encodedString) {
    var clearText = ""; 
    var keyInHex = encodedString.substr(0, 2);
    var key = parseInt(keyInHex, 16);
    for (var n = 2; n < encodedString.length; n += 2) {
        var charInHex = encodedString.substr(n, 2);
        var char = parseInt(charInHex, 16);
        var output = char ^ key;
        clearText += String.fromCharCode(output);
    }
    return clearText;
}

function showDecoded(element, event, showHref, showText){
	event.preventDefault();
	element.onclick = null;
	var encoded = element.dataset["mlobf"];
	var decoded = decodeString(encoded);
	if (showHref)
		element.href = decoded;
	if (showText)
		element.text = decoded;
}