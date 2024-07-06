const calcButtonGroup = document.querySelector('.calc-body');
const calcDisplay = document.querySelector('.num-display p');
const decimalBtn = document.querySelector('.decimal');
const clearBtn = document.querySelector('.clear');

const calcExp = {
    operandA: undefined,
    operandB: undefined,
    operator: undefined,
    currentButton: undefined,
    previousButton: undefined,
    clear: function () {
        this.operandA = undefined;
        this.operandB = undefined;
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
        element: event.target,
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
                    if (getDisplayValue() == 0) {
                        updateDisplay(currentButtonValue, true);
                    } else {
                        if (calcExp.operandA) {
                            updateDisplay(currentButtonValue, false);
                            setOperandB();
                        } else {
                            updateDisplay(currentButtonValue, false);
                        }
                    }
                    break;
                case 'decimal':
                    updateDisplay(currentButtonValue, false);
                    if (calcExp.operandA) {
                        setOperandB();
                    }
                    break;
                case 'operator':
                    updateDisplay(currentButtonValue, true);
                    setOperandB();
                    break;
                case 'modifier':
                    resetCalculator();
                    updateDisplay(currentButtonValue, true);
                    break;
            }
        } else {
            updateDisplay(currentButtonValue, true);
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
                    decimalBtn.disabled = true;
                    break;
                case 'modifier':
                    if (calcExp.operandA) {
                        if (calcExp.operator) {
                            updateDisplay(`0${currentButtonValue}`, true);
                            decimalBtn.disabled = false;
                        } else {
                            calcExp.clear();
                            updateDisplay(`0${currentButtonValue}`, true);
                            decimalBtn.disabled = false;

                        }
                    } else {
                        setOperandA();
                        updateDisplay(`0${currentButtonValue}`, true);
                        decimalBtn.disabled = true;
                    }
                    break;
            }

        } else {
            updateDisplay(currentButtonValue, false);
            decimalBtn.disabled = true;
        }
    }

    if (BUTTON_OPERATOR) {
        if (calcExp.previousButton) {
            const previousButton = calcExp.previousButton.classList[0];
            switch (previousButton) {
                case 'clear':
                    setOperandA();
                    setOperator();
                    highlightOperator();
                    break;
                case 'number':
                    if (calcExp.operandA) {
                        if (calcExp.operator) {
                            setOperandB();
                            sendToOperate();
                            setOperandA();
                            setOperator();
                            highlightOperator();
                            decimalBtn.disabled = false;
                        } else {
                            setOperator();
                            highlightOperator();
                        }
                    } else {
                        setOperandA();
                        setOperator();
                        highlightOperator();
                        decimalBtn.disabled = false;
                    }
                    break;
                case 'operator':
                    setOperator();
                    highlightOperator();
                    break;
                case 'modifier':
                    if (calcExp.operandA) {
                        if (calcExp.operator) {
                            setOperandB();
                            sendToOperate();
                            setOperandA();
                            setOperator();
                            highlightOperator();
                            decimalBtn.disabled = false;
                        } else {
                            setOperator();
                            highlightOperator();
                        }
                    } else {
                        setOperandA();
                        setOperator();
                        highlightOperator();
                        decimalBtn.disabled = false;
                    }
                    break;
                case 'decimal':
                    updateDisplay(getDisplayValue(), true);
                    setOperandA();
                    setOperator();
                    highlightOperator();
                    decimalBtn.disabled = false;
                    break;
                case 'equals':
                    setOperator();
                    highlightOperator();
            }
        } else {
            setOperandA();
            setOperator();
            highlightOperator();
        }
    }

    if (BUTTON_MODIFIER) {
        const currentDisplayValue = parseFloat(getDisplayValue());
        if (calcExp.previousButton) {
            const previousButton = calcExp.previousButton.classList[0];
            const modifierType = calcExp.currentButton.textValue;
            const percentSign = '%';
            switch (previousButton) {
                case 'number':
                    if (currentDisplayValue !== 0) {
                        if (modifierType == percentSign) {
                            if (calcExp.operandA) {
                                let percentage = calcExp.operandA * (getDisplayValue() / 100);
                                updateDisplay(Number(percentage.toPrecision(2)), true);
                                setOperandB();
                            } else {
                                modifyNumber(currentDisplayValue, currentButtonValue);
                            }
                        } else {
                            modifyNumber(currentDisplayValue, currentButtonValue);
                            calcExp.operandB ? setOperandB() : setOperandA();
                        }
                    }
                    break;
                case 'modifier':
                case 'equals':
                case 'operator':
                    if (currentDisplayValue !== 0) {
                        modifyNumber(currentDisplayValue, currentButtonValue);
                        calcExp.operandB ? setOperandB() : setOperandA();
                    }
                    break;
                case 'decimal':
                    calcExp.clear();
                    updateDisplay();
                    decimalBtn.disabled = true;
                    break;
            }
        } else {
            if (currentDisplayValue !== 0) {
                modifyNumber(currentDisplayValue, currentButtonValue);
                setOperandA();
            }
        }
    }

    if (BUTTON_EQUALS) {
        if (calcExp.previousButton) {
            const previousButton = calcExp.previousButton.classList[0];
            switch (previousButton) {
                case 'number':
                    if (calcExp.operandA && calcExp.operandB) {
                        sendToOperate();
                        setOperandA();
                        decimalBtn.disabled = false;
                    }
                    break;
                case 'operator':
                    setOperandB();
                    sendToOperate();
                    break;
                case 'decimal':
                    updateDisplay(getDisplayValue(), true);
                    setOperandA();
                    decimalBtn.disabled = false;
                    break;
                case 'modifier':
                    if (calcExp.operandA && calcExp.operandB) {
                        sendToOperate();
                        setOperandA();
                        decimalBtn.disabled = false;
                    }
                    break;
                case 'equals':
                    setOperandA();
                    sendToOperate();
                    break;
            }
        } else {
            alert('nothing here before');
        }
    }
    console.log(`operandA: ${calcExp.operandA} , operator: ${calcExp.operator}, operandB: ${calcExp.operandB}`);
}

function highlightOperator() {
    document.querySelector('.add').classList.remove('selected');
    document.querySelector('.subtract').classList.remove('selected');
    document.querySelector('.multiply').classList.remove('selected');
    document.querySelector('.divide').classList.remove('selected');
    switch (calcExp.operator) {
        case '+':
            document.querySelector('.add').classList.add('selected');
            break;
        case '−':
            document.querySelector('.subtract').classList.add('selected');
            break;
        case '×':
            document.querySelector('.multiply').classList.add('selected');
            break;
        case '÷':
            document.querySelector('.divide').classList.add('selected');
            break;
    }
}

function sendToOperate() {
    const a = calcExp.operandA;
    const b = calcExp.operandB;
    updateDisplay(Number(operate(a, b, calcExp.operator).toPrecision(4)), true);
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

function setOperandB() {
    calcExp.operandB = parseFloat(calcDisplay.textContent);
}

function setOperator() {
    calcExp.operator = calcExp.currentButton.textValue;
}

function resetCalculator() {
    calcExp.clear();
    decimalBtn.disabled = false;
    document.querySelector('.add').classList.remove('selected');
    document.querySelector('.subtract').classList.remove('selected');
    document.querySelector('.multiply').classList.remove('selected');
    document.querySelector('.divide').classList.remove('selected');
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