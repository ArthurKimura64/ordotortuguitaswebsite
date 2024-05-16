function eventTextToBrainfuck() {
    document.getElementById("cipher").value = `${textToBrainfuck(document.getElementById("text").value)||''}`
    document.getElementById()
}

function eventBrainfuckToText() {
    document.getElementById("text").value = `${brainfuckToText(document.getElementById("cipher").value).output||''}`
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

        if (pointer > maxPointer) {maxPointer = pointer}
        if (char === '+' || char === '-') {maxPointer = Math.max(maxPointer, pointer)}

        iterationCount++;
        if (iterationCount > MAX_ITERATIONS) {
            throw new Error('Interações máximas alcançadas. É possivel haver um loop infinito.');
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
    let memory = [0,10,30,70,100]
    let pointer = 0
    let output = "++++++++++[>+>+++>+++++++>++++++++++<<<<-]"; // base
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let closest = memory.reduce((prev, curr, idx) => Math.abs(curr - charCode) < Math.abs(prev.value - charCode) ? {value: curr, index: idx} : prev, {value: memory[pointer], index: pointer});
        while (pointer < closest.index) {
            output += ">";
            pointer++;
        }
        while (pointer > closest.index) {
            output += "<";
            pointer--;
        }
        while (memory[pointer] < charCode) {
            output += "+";
            memory[pointer]++;
        }
        while (memory[pointer] > charCode) {
            output += "-";
            memory[pointer]--;
        }
        output += ".";
    }
    if (text == "") return ""
    return output;
}

// Adicionar event listeners para os eventos "input" e "keyup"
document.getElementById("cipher").addEventListener("input", eventBrainfuckToText);
document.getElementById("cipher").addEventListener("keyup", eventBrainfuckToText);
document.getElementById("text").addEventListener("input", eventTextToBrainfuck);
document.getElementById("text").addEventListener("keyup", eventTextToBrainfuck);
// Chamar a função inicialmente para exibir o valor inicial (se houver)
atualizarTexto();
