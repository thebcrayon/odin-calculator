let firstNumber;
let secondNumber;
let operator;

const calcButtonGroup = document.querySelector('.calc-body');
const numberDisplay = document.querySelector('.num-display p');


calcButtonGroup.addEventListener('click', buttonHandler);

function buttonHandler(event) {
    let targetTargetClassList = event.target.classList;
    let element = event.target;
    let string = element.textContent;
    console.table(string);
}

function displayKey(element, string) {

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