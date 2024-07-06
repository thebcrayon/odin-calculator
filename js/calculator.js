const calcButtonGroup = document.querySelector('.calc-body');
const calcDisplay = document.querySelector('.num-display p');
const decimalBtn = document.querySelector('.decimal');
const clearBtn = document.querySelector('.clear');
const btn_add = document.querySelector('.add');
const btn_subtract = document.querySelector('.subtract');
const btn_multiply = document.querySelector('.multiply');
const btn_divide = document.querySelector('.divide');

const calcExp = {
  operandA: undefined,
  operandB: undefined,
  operator: undefined,
  currentButton: undefined,
  prev_operandB: undefined,
  prev_operator: undefined,
  previousButton: undefined,
  clear: function () {
    this.operandA = undefined;
    this.operandB = undefined;
    this.operator = undefined;
    this.currentButton = undefined;
    this.prev_operator = undefined;
    this.prev_operandB = undefined;
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
          updateDisplay(currentButtonValue, true);
          setOperandB();
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
      const pos_neg = '+/-';
      switch (previousButton) {
        case 'number':
        case 'operator':
          if (currentDisplayValue !== 0) {
            if (modifierType == percentSign) {
              if (calcExp.operandA) {
                let percentage = calcExp.operandA * (getDisplayValue() / 100);
                updateDisplay(Number(percentage.toPrecision(9)), true);
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
          if (calcExp.operandA) {
            modifyNumber(currentDisplayValue, currentButtonValue);
            calcExp.operandB ? setOperandB() : setOperandA();
          } else {
            modifyNumber(currentDisplayValue, currentButtonValue);
          }
          break;
        case 'equals':
          if (currentDisplayValue !== 0) {
            if (modifierType == pos_neg) {
              modifyNumber(currentDisplayValue, currentButtonValue);
              setOperandA();
              resetOperandB();
              resetOperator();
              removeOperatorHighlights();
              decimalBtn.disabled = false;
            } else {
              resetOperandB();
              resetOperator();
              modifyNumber(currentDisplayValue, currentButtonValue);
              setOperandA();
            }
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
            setPrevOperandB();
            setPrevOperator();
            resetOperandB();
            resetOperator();
            removeOperatorHighlights();
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
            setPrevOperandB();
            setPrevOperator();
            resetOperandB();
            resetOperator();
            removeOperatorHighlights();
            decimalBtn.disabled = false;
          } else if (calcExp.operandA && !calcExp.operandB) {
            setOperandB();
            setPrevOperandB();
            setPrevOperator();
            sendToOperate();
            resetOperandB();
            resetOperator();
            removeOperatorHighlights();
            decimalBtn.disabled = false;
          }
          break;
        case 'equals':
          setOperandA();
          sendToOperate(calcExp.operandA, calcExp.prev_operandB);
          setOperandA();
          break;
      }
    } else {
      alert('nothing here before');
    }
  }
  console.log(`operandA: ${calcExp.operandA} , operator: ${calcExp.operator}, operandB: ${calcExp.operandB}`);
}

function removeOperatorHighlights() {
  btn_add.classList.remove('selected');
  btn_subtract.classList.remove('selected');
  btn_multiply.classList.remove('selected');
  btn_divide.classList.remove('selected');
}

function highlightOperator() {
  removeOperatorHighlights();
  switch (calcExp.operator) {
    case '+':
      btn_add.classList.add('selected');
      break;
    case '−':
      btn_subtract.classList.add('selected');
      break;
    case '×':
      btn_multiply.classList.add('selected');
      break;
    case '÷':
      btn_divide.classList.add('selected');
      break;
  }
}

function sendToOperate(a = calcExp.operandA, b = calcExp.operandB) {
  updateDisplay(Number(operate(a, b, calcExp.operator ? calcExp.operator : calcExp.prev_operator).toPrecision(9)), true);
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

function resetOperandB() {
  calcExp.operandB = undefined;
}

function setPrevOperandB() {
  calcExp.prev_operandB = calcExp.operandB;
}

function setPrevOperator() {
  calcExp.prev_operator = calcExp.operator;
}

function setOperator() {
  calcExp.operator = calcExp.currentButton.textValue;
}

function resetOperator() {
  calcExp.operator = undefined;
}

function resetCalculator() {
  calcExp.clear();
  decimalBtn.disabled = false;
  removeOperatorHighlights();
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