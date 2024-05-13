// Função para atualizar o texto
function atualizarTexto() {
    var texto = document.getElementById("brainfuck-decrypt").value;

    var result = brainfuckToText(texto);
    document.getElementById("outputTextDecrypt").innerText = "Texto digitado:\n\n" + result.output;

    // Exibe o último snapshot da memória
    document.getElementById("memorySnapshot").innerText = "Memória:\n" + result.lastSnapshot.join(', ');
}

function brainfuckToText(code) {
    const memory = new Uint8Array(30000).fill(0);
    let pointer = 0;
    let output = '';
    let iterationCount = 0;
    const MAX_ITERATIONS = 1000000; // Defina o limite de iterações aqui
    let maxPointer = 0; // Rastreia o maior ponteiro usado

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        switch (char) {
            case '>': pointer++; break;
            case '<': pointer--; break;
            case '+': memory[pointer] = (memory[pointer] + 1) % 256; break;
            case '-': memory[pointer] = (memory[pointer] - 1) % 256; break;
            case '.': output += String.fromCharCode(memory[pointer]); break;
            case '[': if (memory[pointer] === 0) i = findClosingBracket(code, i); break;
            case ']': if (memory[pointer] !== 0) i = findOpeningBracket(code, i); break;
            default: break; // Ignora caracteres inválidos
        }

        // Atualiza o maior ponteiro usado, se necessário
        if (pointer > maxPointer) {maxPointer = pointer}

        // Atualiza o maior valor escrito, se necessário
        if (char === '+' || char === '-') {maxPointer = Math.max(maxPointer, pointer)}

        iterationCount++;
        if (iterationCount > MAX_ITERATIONS) {
            throw new Error('Exceeded maximum iterations. Possible infinite loop in code.');
        }
    }

    // Cria o último snapshot da memória
    let lastSnapshot = [];
    for (let i = 0; i <= maxPointer; i++) {
        if (memory[i] !== 0) {lastSnapshot.push(`${String.fromCharCode(memory[i])}(${memory[i]})`);}
    }

    return { output, lastSnapshot };


    function findClosingBracket(code, startIndex) {
        let depth = 1;
        for (let i = startIndex + 1; i < code.length; i++) {
            if (code[i] === '[') depth++;
            else if (code[i] === ']') {
                depth--;
                if (depth === 0) return i;
            }
        }
        throw new Error('No closing bracket found for opening bracket at index ' + startIndex);
    }

    function findOpeningBracket(code, startIndex) {
        let depth = 1;
        for (let i = startIndex - 1; i >= 0; i--) {
            if (code[i] === ']') depth++;
            else if (code[i] === '[') {
                depth--;
                if (depth === 0) return i;
            }
        }
        throw new Error('No opening bracket found for closing bracket at index ' + startIndex);
    }
}

function textToBrainfuck(text) {
    let output = "++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>+"; // base
    for (let i = 0; i < text.length; i++) {
        let ascii = text.charCodeAt(i);
        let increment = ascii - 32;
        for (let j = 0; j < increment; j++) {
            output += "+";
        }
        output += ".>";
    }
    return output;
}

// Adicionar event listeners para os eventos "input" e "keyup"
document.getElementById("brainfuck-decrypt").addEventListener("input", atualizarTexto);
document.getElementById("brainfuck-decrypt").addEventListener("keyup", atualizarTexto);

// Chamar a função inicialmente para exibir o valor inicial (se houver)
atualizarTexto();
