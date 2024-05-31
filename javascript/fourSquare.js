function eventFourSquareCipher() {
  document.getElementById("output").value = `${
    fourSquareCipher(
      document.getElementById("input").value,
      document.querySelector('input[name="btnradio"]:checked').value
    ) || ""
  }`
}

function eventFourSquareCipherDecrypt(command) {
  document.getElementById("output").value = `${
    fourSquareCipher(
      document.getElementById("input").value,
      command
    ) || ""
  }`
}
function eventChangeFourSquareCipher() {
  let command = document.querySelector('input[name="btnradio"]:checked').value
  if (command == "encrypt") {
    document.getElementById("allPossibilities").checked = false;
    document.getElementById("allPossibilities").setAttribute('disabled', 'disabled');
    eventFourSquareCipherDecrypt("decrypt")
  }
  if (command == "decrypt") document.getElementById("allPossibilities").removeAttribute('disabled');
  
  let provisory = document.getElementById("output").value
  document.getElementById("output").value = document.getElementById("input").value
  document.getElementById("input").value = provisory
  
  eventFourSquareCipher()
}

function fourSquareCipher(cipher, command) {
  cipher = inputTreatment(cipher)
  let matrix = []
  result = ""
  for (let i = 1; i <= 4; i++) {
    matrix.push(
      generateKeySquare(document.getElementById(`key${i}`).value, document.getElementById(`letter${i}`).value)
    )
  }
  if (command == "encrypt") result = fourSquare(cipher, matrix, [0, 1, 2, 3], command)
  if (command == "decrypt") {
    if (document.getElementById("allPossibilities").checked) {
      for (let a = 0; a < 4; a++) {
        for (let b = 0; b < 4; b++) {
          if (b == a) continue
          for (let c = 0; c < 4; c++) {
            if (c == b || c == a) continue
            for (let d = 0; d < 4; d++) {
              if (d == c || d == b || d == a) continue
              result += fourSquare(cipher, matrix, [a, b, c, d], command) + "\n"
            }
          }
        }
      }
    } else {
      result = fourSquare(cipher, matrix, [0, 1, 2, 3], command)
    }
  }
  return result
}
function fourSquare(cipher, matrix, ordem, command) {
  let message = []
  for (let i = 0; i < cipher.length; i++) {
    if (command == "decrypt") {
      let line1 = Math.floor(matrix[ordem[1]].indexOf(cipher[i]) / 5)
      let column1 = matrix[ordem[2]].indexOf(cipher[i + 1]) % 5
      message.push(matrix[ordem[0]][line1 * 5 + column1])

      let line2 = Math.floor(matrix[ordem[2]].indexOf(cipher[i + 1]) / 5)
      let column2 = matrix[ordem[1]].indexOf(cipher[i]) % 5
      console.log(line2)
      console.log(column2)
      message.push(matrix[ordem[3]][line2 * 5 + column2])
    }

    if (command == "encrypt") {
      let line1 = Math.floor(matrix[ordem[0]].indexOf(cipher[i]) / 5)
      let column1 = matrix[ordem[3]].indexOf(cipher[i + 1]) % 5
      message.push(matrix[ordem[1]][line1 * 5 + column1])

      let line2 = Math.floor(matrix[ordem[3]].indexOf(cipher[i + 1]) / 5)
      let column2 = matrix[ordem[0]].indexOf(cipher[i]) % 5
      console.log(line2)
      console.log(column2)
      message.push(matrix[ordem[2]][line2 * 5 + column2])
    }
    i++
  }
  return message.join("")
}
function inputTreatment(cipher) {
  if (cipher.split("").length % 2 == 1) cipher = cipher.toUpperCase() + "X"
  return cipher
}
function generateKeySquare(key, letterToRemove) {
  key = key.toUpperCase().replace(/[^A-Z]/g, "")
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  var tempKey = ""

  // Remover letras duplicadas da chave
  for (var i = 0; i < key.length; i++) {
    if (tempKey.indexOf(key.charAt(i)) == -1) tempKey += key.charAt(i)
  }

  // Adicionar letras do alfabeto ao final da chave sem repetição
  tempKey += alphabet.replace(new RegExp("[" + tempKey + "]", "g"), "")

  // Remover a letra especificada, se presente na chave
  if (letterToRemove) tempKey = tempKey.replace(letterToRemove.toUpperCase(), "")

  // Garantir que a chave tenha apenas 25 letras
  tempKey = tempKey.slice(0, 25)

  return tempKey
}

document.getElementById("input").addEventListener("input", eventFourSquareCipher)
document.getElementById("input").addEventListener("keyup", eventFourSquareCipher)
document.querySelectorAll('input[name="btnradio"]').forEach((choice) => choice.addEventListener("change", eventChangeFourSquareCipher)
)
document.getElementById("allPossibilities").addEventListener("change", eventFourSquareCipher)
for (let i = 1; i <= 4; i++) {
  document.getElementById(`key${i}`).addEventListener("input", eventFourSquareCipher)
  document.getElementById(`key${i}`).addEventListener("keyup", eventFourSquareCipher)
  document.getElementById(`letter${i}`).addEventListener("change", eventFourSquareCipher)
}
eventFourSquareCipher()