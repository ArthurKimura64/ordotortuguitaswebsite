function eventCaesar() {
    let command = document.querySelector('input[name="btnradio"]:checked').value
    document.getElementById("output").value = `${
        caesar(
            document.getElementById("input").value, command) || ""
        }`
    
}

function eventCaesarDecrypt(command) {
    document.getElementById("output").value = `${
        caesar(
            document.getElementById("input").value, command
        ) || ""
        }`
}

function eventChangeCaesar() {
  let command = document.querySelector('input[name="btnradio"]:checked').value
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
    let result = ""
    if (command == "decrypt" && (document.getElementById("allPossibilities").checked)) {
        
        for (let i = 1; i <= 26; i++) {
            result +=  caesarCipher(message, i, command) + "\n"
        }
    } else {
        result = caesarCipher(message, document.getElementById("inclement").value, command)
    }
    return result
}
function caesarCipher(message, shift, command) {
    if (command == "decrypt") shift *= -1
    shift = parseInt(shift % 26 + 26) % 26
  
    // Define the shifted alphabet
    const shiftedAlphabet = [...Array(26)].map((_, i) =>
      String.fromCharCode(((i + shift) % 26) + 65)
    );
  
    // Define the shifted alphabet for lowercase letters
    const shiftedAlphabetLowercase = [...Array(26)].map((_, i) =>
      String.fromCharCode(((i + shift) % 26) + 97)
    );
  
    // Define a mapping for Portuguese modified letters
    const portugueseMapping = {
      "Á": "A",
      "À": "A",
      "Â": "A",
      "Ã": "A",
      "Ç": "C",
      "É": "E",
      "Ê": "E",
      "Í": "I",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ú": "U",
      "Ü": "U",
      "á": "a",
      "à": "a",
      "â": "a",
      "ã": "a",
      "ç": "c",
      "é": "e",
      "ê": "e",
      "í": "i",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ú": "u",
      "ü": "u"
    };
  
    // Replace the Portuguese modified letters in the message
    message = message.replace(/[ÁÀÂÃÇÉÊÍÓÔÕÚÜáàâãçéêíóôõúü]/g, (char) => portugueseMapping[char]);
  
    // Perform the Caesar cipher on the message
    const result = message.replace(/[a-zA-Z]/g, (char) => {
      const charCode = char.charCodeAt(0);
      const index = charCode >= 97? charCode - 97 : charCode - 65;
      const shiftedChar = charCode >= 97 ? shiftedAlphabetLowercase[index] : shiftedAlphabet[index];
  
      return shiftedChar;
    });
  
    return result;
  }

// Adicionar event listeners para os eventos "input" e "keyup"
document.getElementById("input").addEventListener("input", eventCaesar)
document.getElementById("input").addEventListener("keyup", eventCaesar)
document.querySelectorAll('input[name="btnradio"]').forEach((choice) => choice.addEventListener("change", eventChangeCaesar))
document.getElementById("minus").addEventListener("click", () => {
    document.getElementById("inclement").value = parseInt(document.getElementById("inclement").value || 0) - 1
    eventCaesar()
})

document.getElementById("allPossibilities").addEventListener("change", eventCaesar)
document.getElementById("plus").addEventListener("click", () => {
    document.getElementById("inclement").value = parseInt(document.getElementById("inclement").value || 0) + 1
    eventCaesar()
})
document.getElementById("inclement").addEventListener("change", eventCaesar)
// Chamar a função inicialmente para exibir o valor inicial (se houver)
eventCaesar()
