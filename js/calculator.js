const calcButtonGroup = document.querySelector('.calc-body');
const calcDisplay = document.querySelector('.num-display p');
const decimalBtn = document.querySelector('.decimal');
const clearBtn = document.querySelector('.clear');

const calcExp = {
    operandA: undefined,
    operator: undefined,
    currentButton: undefined,
    previousButton: undefined,
    clear: function () {
        this.operandA = undefined;
        this.operator = undefined;
        this.currentButton = undefined;
        this.previousButton = undefined;
    },
}

calcButtonGroup.addEventListener('click', buttonHandler);

function buttonHandler(event) {
    calcExp['previousButton'] = calcExp['currentButton'];
    calcExp['currentButton'] = {
        classList: Array.from(event.target.classList),
        textValue: event.target.textContent,
    }

    const buttonClassList = calcExp.currentButton.classList;
    const BUTTON_AC = buttonClassList.includes('clear');
    const BUTTON_NUM = buttonClassList.includes('number');
    const BUTTON_DECIMAL = buttonClassList.includes('decimal');
    const BUTTON_OPERATOR = buttonClassList.includes('operator');
    const BUTTON_EQUALS = buttonClassList.includes('equals');
    const BUTTON_MODIFIER = (buttonClassList.includes('pos-neg') || buttonClassList.includes('percent'));
    const currentButtonValue = calcExp.currentButton.textValue;

    if (BUTTON_AC) {
        resetCalculator();
    }

    if (BUTTON_NUM) {
        if (calcExp.previousButton) {
            const previousButton = calcExp.previousButton.classList[0];
            switch (previousButton) {
                case 'number':
                case 'decimal':
                    updateDisplay(currentButtonValue, false);
                    break;
                case 'operator':
                    updateDisplay(currentButtonValue, true);
                    break;
            }
        } else {
            updateDisplay(currentButtonValue, true);
        }
    }

    if (BUTTON_OPERATOR) {
        if (calcExp.previousButton) {
            const previousButton = calcExp.previousButton.classList[0];
            switch (previousButton) {
                case 'clear':
                    setOperandA();
                    setOperator();
                    break;
                case 'number':
                    if (calcExp.operandA) {
                        //This order matters. Operator && lastbutton == number. 
                        //setOperandA stores screen content to continue computing.
                        sendToOperate();
                        setOperandA();
                        decimalBtn.disabled = false;
                    } else {
                        setOperandA();
                        setOperator();
                        decimalBtn.disabled = false;
                    }
                    break;
                case 'operator':
                    setOperator();
                    break;
                case 'modifier':
                    setOperandA();
                    setOperator();
                    break;
            }
        } else {
            setOperandA();
            setOperator();
        }
    }

    if (BUTTON_DECIMAL) {
        if (calcExp.previousButton) {
            const previousButton = calcExp.previousButton.classList[0];
            switch (previousButton) {
                case 'number':
                    if (countDecimals() == 0) {
                        updateDisplay(currentButtonValue, false);
                        decimalBtn.disabled = true;
                    }
                    break;
                case 'operator':
                    updateDisplay(`0${currentButtonValue}`, true);
                    break;
            }

        } else {
            updateDisplay(currentButtonValue, false);
            decimalBtn.disabled = true;
        }
    }

    if (BUTTON_MODIFIER) {
        const currentDisplayValue = parseFloat(getDisplayValue());
        if (currentDisplayValue !== 0) {
            modifyNumber(currentDisplayValue, currentButtonValue);
            setOperandA();
        } else {
            alert('trying to modify 0 value');
        }
    }
}

function sendToOperate() {
    const a = calcExp.operandA;
    const b = getDisplayValue();
    updateDisplay(operate(a, b, calcExp.operator), true);
}

function countDecimals() {
    return calcDisplay.textContent.split('')
        .reduce((totalDecimals, item) => {
            if (item == '.') {
                totalDecimals += 1;
            }
            return totalDecimals;
        }, 0);
}

function getDisplayValue() {
    return parseFloat(calcDisplay.textContent);
}

function setOperandA() {
    calcExp.operandA = parseFloat(calcDisplay.textContent);
}

function setOperator() {
    calcExp.operator = calcExp.currentButton.textValue;
}

function resetCalculator() {
    calcExp.clear();
    decimalBtn.disabled = false;
    updateDisplay();
}

function updateDisplay(string = '0', clearDisplay = true) {
    if (clearDisplay) { calcDisplay.textContent = ''; }
    calcDisplay.append(string);
}

function modifyNumber(number, modifier) {
    switch (modifier) {
        case '+/-':
            updateDisplay(multply(number, -1), true);
            break;
        case '%':
            updateDisplay(divide(number, 100), true);
            break;
    }
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