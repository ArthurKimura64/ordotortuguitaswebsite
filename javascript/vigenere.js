function updateOutput(value) {document.getElementById("output").value = value || ""}


  

function eventVigenere() {
    let command = document.querySelector('input[name="command"]:checked').value
    let input = document.getElementById("input").value
    let key = document.getElementById("key").value || "A"
    let alphabet = document.getElementById("alphabet").value
    let result = vigenereCipher(input, alphabet, key, command)
    updateOutput(result)
}

function eventChangeVigenere() {
    let provisory = document.getElementById("output").value
    document.getElementById("output").value = document.getElementById("input").value
    document.getElementById("input").value = provisory
    eventVigenere()
}

function vigenereCipher(message, alphabet, key, command) {
    // Define a mapping for Portuguese modified letters
    const portugueseMapping = {
        "Á": "A", "À": "A", "Â": "A", "Ã": "A", "Ç": "C", "É": "E", "Ê": "E", "Í": "I",
        "Ó": "O", "Ô": "O", "Õ": "O", "Ú": "U", "Ü": "U", "á": "a", "à": "a", "â": "a",
        "ã": "a", "ç": "c", "é": "e", "ê": "e", "í": "i", "ó": "o", "ô": "o", "õ": "o",
        "ú": "u", "ü": "u"
    };
    
    // Replace the Portuguese modified letters in the message
    message = message.replace(/[ÁÀÂÃÇÉÊÍÓÔÕÚÜáàâãçéêíóôõúü]/g, (char) => portugueseMapping[char]);
    const keyArray = key.split('').map(c => alphabet.indexOf(c))
    result = ""

    // Perform the Caesar cipher on the message
    for (let i = 0; i < message.length; i++) {
        char = message[i]
        const isLetter = char >= 'A' && char <= 'Z';
        document.getElementById("output").value += "pasdas\n"

        if (!isLetter) {
            result += char
            if (char.match(/\s/)) {
                message = message.replace(/\s/, "")
                i--
            }
            continue
        }
        
        const shift = keyArray[i % keyArray.length];
        const charCode = alphabet.indexOf(char);
        const indexCharCode = (command == "encrypt" ? (charCode + shift)  : (charCode - shift + 26)) % 26;
        result += alphabet[indexCharCode]
    }

    return result
}

// Adicionar event listeners para os eventos "input" e "keyup"
document.getElementById("input").addEventListener("input", eventVigenere)
document.getElementById("input").addEventListener("keyup", eventVigenere)
document.getElementById("key").addEventListener("input", eventVigenere)
document.getElementById("key").addEventListener("keyup", eventVigenere)
document.querySelectorAll('input[name="command"]').forEach((choice) => choice.addEventListener("change", eventChangeVigenere))
//document.getElementById('ciphermode').forEach((choice) => choice.addEventListener("change", eventVigenere))
document.getElementById('alphabet').addEventListener("change", eventVigenere)

eventVigenere()
