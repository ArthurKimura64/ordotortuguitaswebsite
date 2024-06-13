function updateOutput(value) {
    document.getElementById("output").value = value || "";
}

function eventCaesar() {
    let command = document.querySelector('input[name="command"]:checked').value
    updateOutput(caesar(document.getElementById("input").value, command));
}

function eventCaesarDecrypt(command) {
    updateOutput(caesar(document.getElementById("input").value, command));
}

function eventChangeCaesar() {
  let command = document.querySelector('input[name="command"]:checked').value
  if (command == "encrypt") {
    document.getElementById("allPossibilities").checked = false
    document.getElementById("allPossibilities").setAttribute("disabled", "disabled")
    eventCaesarDecrypt("decrypt")
  }
  if (command == "decrypt") document.getElementById("allPossibilities").removeAttribute("disabled")

  let provisory = document.getElementById("output").value
  document.getElementById("output").value = document.getElementById("input").value
  document.getElementById("input").value = provisory

  eventCaesar()
}

function caesar(message, command) {
    if (command === "decrypt" && document.getElementById("allPossibilities").checked) {
        return decryptAllPossibilities(message);
    }
    return caesarCipher(message, document.getElementById("inclement").value, command);
}

function decryptAllPossibilities(message) {
    let result = "";
    for (let i = 1; i <= 26; i++) {
        result += caesarCipher(message, i, "decrypt") + "\n";
    }
    return result;
}

function caesarCipher(message, shift, command) {
    shift = parseInt(shift)
    let alphabetType = document.querySelector('input[name="alphabet"]:checked').value
    if (command == "decrypt") shift *= -1;
    let letterShift = (shift % 26 + 26) % 26;
    let alphabet = [];
    let lowerAlphabet = [];
    let numbers = []

    // Define the alphabet based on the selected type
    switch (alphabetType) {
        case "alphanumeric":
            numbers = [...Array.from(Array(10).keys())]
        case "alphabet":
            alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 65))
            lowerAlphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97))
            break
        case "ascii":
            alphabet = [...Array(127)].map((_, i) => String.fromCharCode(i + 1))
            lowerAlphabet = alphabet;
            break;
        default:
            throw new Error("Invalid alphabet type");
    }

    // Define a mapping for Portuguese modified letters
    const portugueseMapping = {
        "Á": "A", "À": "A", "Â": "A", "Ã": "A", "Ç": "C", "É": "E", "Ê": "E", "Í": "I",
        "Ó": "O", "Ô": "O", "Õ": "O", "Ú": "U", "Ü": "U", "á": "a", "à": "a", "â": "a",
        "ã": "a", "ç": "c", "é": "e", "ê": "e", "í": "i", "ó": "o", "ô": "o", "õ": "o",
        "ú": "u", "ü": "u"
    };

    // Replace the Portuguese modified letters in the message
    message = message.replace(/[ÁÀÂÃÇÉÊÍÓÔÕÚÜáàâãçéêíóôõúü]/g, (char) => portugueseMapping[char]);

    // Perform the Caesar cipher on the message
    const result = message.replace(/[a-zA-Z0-9!-\[\]-~]/g, (char) => {
        const isLower = char >= 'a' && char <= 'z';
        const isUpper = char >= 'A' && char <= 'Z';
        const isDigit = char >= '0' && char <= '9';

        if (alphabetType === "normal" && !isLower && !isUpper) return char;
        if (alphabetType === "alphanumeric" && !isLower && !isUpper && !isDigit) return char;

        if (alphabetType === "alphanumeric" && isDigit) {
            if ((numbers.indexOf(parseInt(char)) + shift) % numbers.length < 0) {
                return numbers[numbers.length  + ((numbers.indexOf(parseInt(char)) + shift) % numbers.length)]
            }
            return numbers[(numbers.indexOf(parseInt(char)) + shift) % numbers.length]
        }

        const alphabetToUse = isLower ? lowerAlphabet : alphabet;
        const index = alphabetToUse.indexOf(char);

        if (index === -1) return char;

        const shiftedIndex = (index + letterShift) % alphabetToUse.length;
        return alphabetToUse[shiftedIndex];
    });

    return result
}

// Adicionar event listeners para os eventos "input" e "keyup"
document.getElementById("input").addEventListener("input", eventCaesar)
document.getElementById("input").addEventListener("keyup", eventCaesar)
document.querySelectorAll('input[name="command"]').forEach((choice) => choice.addEventListener("change", eventChangeCaesar))
document.getElementById("minus").addEventListener("click", () => {
    document.getElementById("inclement").value = parseInt(document.getElementById("inclement").value || 0) - 1
    eventCaesar()
})
document.querySelectorAll('input[name="alphabet"]').forEach((choice) => choice.addEventListener("change", eventCaesar))

document.getElementById("allPossibilities").addEventListener("change", eventCaesar)
document.getElementById("plus").addEventListener("click", () => {
    document.getElementById("inclement").value = parseInt(document.getElementById("inclement").value || 0) + 1
    eventCaesar()
})
document.getElementById("inclement").addEventListener("change", eventCaesar)
// Chamar a função inicialmente para exibir o valor inicial (se houver)
eventCaesar()
