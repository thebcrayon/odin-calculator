const calcButtonGroup = document.querySelector('.calc-body');
const calcDisplay = document.querySelector('.num-display p');
calcButtonGroup.addEventListener('click', buttonHandler);

const calcExp = {
    init: true,
    operandA: undefined,
    operandB: undefined,
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
    const BUTTON_MOD = (buttonClassList.includes('pos-neg') || buttonClassList.includes('percent'));

    if (BUTTON_AC) {
        resetCalculator();
    }

    if (BUTTON_MOD) {
        let OPERAND_NO_A_NO_B = (!calcExp.operandA) && (!calcExp.operandB);
        let OPERAND_A_NO_B = (calcExp.operandA) && (!calcExp.operandB);
        let OPERAND_A_B = (calcExp.operandA) && (calcExp.operandB);

        if (calcDisplay.textContent !== '0') {
            if (OPERAND_NO_A_NO_B) {
                // 1. Modify and 2. Set operandA
            } else if (OPERAND_A_NO_B || OPERAND_A_B) {
                // 1. Modify and 2 set operand B
            }
        } else {
            calcExp.init = true;
        }
    }

    if (BUTTON_NUM) {
        if (calcExp.init) {
            updateDisplay(calcExp.currentButton.textValue, true);
            calcExp.init = false;
        } else if (calcExp.operandA) {
            if (calcExp.operator) {
                updateDisplay(calcExp.currentButton.textValue, true);
            } else {
                updateDisplay(calcExp.currentButton.textValue, true);
                calcExp.operandA = undefined;
            }
        } else {
            updateDisplay(calcExp.currentButton.textValue, false);
        }
    }

}

function updateSign(string) {

}

function convertToPercent(string) {

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