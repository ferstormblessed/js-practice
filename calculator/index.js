let buffer = '0'
let screen = document.querySelector(".operation");

let runningTotal = 0;
let previousOperator = null;

function buttonCLicked(value){
    if ( isNaN( parseInt(value) )) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    rerender();
}

function handleSymbol (symbol) {
    if (symbol === "AC") {
        buffer = '0';
    } else if (symbol === "del") {
        if (buffer.length === 1){
            buffer = '0';
        } else {
            buffer = buffer.substring(0, buffer.length - 1);
        }
    } else if (symbol === '='){
        if (previousOperator === null) {
            return;
        }

        flushOperation(parseInt(buffer));
        previousOperator = null; 
        buffer = runningTotal.toString();
        runningTotal = 0;
    } else {
       handleMath(symbol); 
    }
}

function handleMath(value){
    if (buffer === '0') {
        return;
    }
    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }

    previousOperator = value;
    buffer = '0';
    console.log(runningTotal);
}

function flushOperation(currNumber) {
    if (previousOperator === '+') {
        runningTotal += currNumber;
    }
    if (previousOperator === '-') {
        runningTotal -= currNumber;
    }
    if (previousOperator === 'x') {
        runningTotal *= currNumber;
    }
    if (previousOperator === '/') {
        runningTotal /= currNumber;
    }
}

function handleNumber (number) {
    if (buffer === '0') {
        buffer = number
    } else {
        buffer += number;
    }
}

function rerender(){
    screen.innerText = buffer;
}

function init(){
    document
        .querySelector(".calculator")
        .addEventListener("click", function(event) {
            buttonCLicked(event.target.innerText);
        });
}

init();


