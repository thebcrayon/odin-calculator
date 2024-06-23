let firstNumber;
let secondNumber;
let operator;

const calcButtonGroup = document.querySelector('.calc-body');
const numberDisplay = document.querySelector('.num-display p');


calcButtonGroup.addEventListener('click', buttonHandler);

function buttonHandler(event) {
    let buttonInfo = {
        classList: Array.from(event.target.classList),
        element: event.target,
        text: event.target.textContent,
    }
    console.log(buttonInfo.classList);
    clearDisplay(buttonInfo.classList);
    addToDisplay(buttonInfo.classList, buttonInfo.text);
}

function clearDisplay(ary) {
    if (ary.includes('clear')){
        numberDisplay.textContent = '';
    }
}

function addToDisplay(ary, string) {
    if (ary.includes('display')){
        numberDisplay.append(string);
    }
}

function operate(a, b, operator) {
    return add(a, b);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}