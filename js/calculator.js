const calcButtonGroup = document.querySelector('.calc-body');
const calcDisplay = document.querySelector('.num-display p');
calcButtonGroup.addEventListener('click', buttonHandler);

const calcExp = {
    init: true,
    operandA: 0,
    operandB: 0,
    operator: undefined,
    currentButton: undefined,
    clear: function () {
        this.init = true;
        this.operandA = undefined;
        this.operandB = undefined;
        this.operator = undefined;
        this.currentButton = undefined;
    },
}

function buttonHandler(event) {
    calcExp['currentButton'] = {
        classList: Array.from(event.target.classList),
        element: event.target,
        textValue: event.target.textContent,
    }

    let buttonClassList = calcExp.currentButton.classList;
    const BUTTON_AC = buttonClassList.includes('clear');
    const BUTTON_NUM = buttonClassList.includes('number');
    const BUTTON_OPERATOR = buttonClassList.includes('operator');
    const BUTTON_EQUALS = buttonClassList.includes('equals');
    const BUTTON_MOD = (buttonClassList.includes('pos-neg') || buttonClassList.includes('percent'));

    if (BUTTON_AC) {
        resetCalculator();
    }

    if (BUTTON_NUM) {
        if (calcExp.init) {
            updateDisplay(calcExp.currentButton.textValue, true);
            calcExp.init = false;
        } else if (calcExp.operandA) {
            if (calcExp.operator) {
                updateDisplay(calcExp.currentButton.textValue, false);
            }
        } else {
            updateDisplay(calcExp.currentButton.textValue, false);
        }
    }

    if (BUTTON_OPERATOR) {
        calcExp.init = true;
        if (BUTTON_EQUALS) {
            if (calcExp.operandA) {
                const a = parseFloat(calcExp.operandA);
                const b = parseFloat(getDisplayValue());
                updateDisplay(operate(a, b, calcExp.operator), true);
            }
        } else if (calcExp.operator) {
            setOperator();
        } else {
            setOperator();
            setOperandA();
        }
    }

}

function getDisplayValue() {
    return calcDisplay.textContent;
}

function setOperandA() {
    calcExp.operandA = calcDisplay.textContent;
}

function setOperandB() {
    calcExp.operandB = calcDisplay.textContent;
}

function setOperator() {
    calcExp.operator = calcExp.currentButton.textValue;
}

function resetCalculator() {
    calcExp.clear();
    updateDisplay();
}

function updateDisplay(string = '0', clearDisplay = true) {
    if (clearDisplay) { calcDisplay.textContent = ''; }
    calcDisplay.append(string);
}

function operate(a, b, operator) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '−':
            return subtract(a, b);
        case '×':
            return multply(a, b);
        case '÷':
            return divide(a, b);
    }
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