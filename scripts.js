function add(a, b) {
  return parseFloat(a) + parseFloat(b);
}

function subtract(a, b){
  return a - b;
}

function multiply(a, b){
  return a * b;
}

function divide(a, b){
  return a / b;
}

function roundDec(a, num){
  factor = 10 ** num;
  return Math.round(a * factor) / factor;
}

function operate(arr){ // arr = [num1, operator, num2]
  switch(arr[1]){
    case '+': return add(arr[0], arr[2]);
    case '-': return subtract(arr[0], arr[2]);
    case '*': return multiply(arr[0], arr[2]);
    case '/': return divide(arr[0], arr[2]);
  }
}

function updateClearBtn(){
  if (display.textContent.length > 0) {
    clearBtn.textContent = 'CE';
  } else {
    clearBtn.textContent = 'AC';
  }
}

const buttons = document.querySelector(".buttons");
const buttonArr = '1234567890.+-*/=';
const display = document.querySelector(".display");
const clearBtn = document.querySelector(".clearbutton")
display.textContent = ""
for(item of buttonArr){
  const button = document.createElement('button');
  button.textContent = item;
  buttons.appendChild(button);
}
let firstNum = '';
let operator = '';
let secondNum = '';


function calculateAndDisplay(eventType, e){
  const operators = '+-*/=';
  const numbers = '0123456789';
  const keyboard = operators + numbers + '.';
  if(eventType == 'click') target = e.target.innerText;
  else if (eventType == 'keypress') {
    if(e.key == 'Enter') target = '=';
    // else if(e.key == 'Delete)
    else if(keyboard.includes(e.key)) target = e.key;
    else return;
  }

  // Prevent duplicate decimals
  if(target == '.' && display.textContent.includes('.')) return;

  // Ignore clicks on empty button space
  if(e.target.className == "buttons") return;

  // Handle AC
  if(target == 'AC') {
    firstNum = secondNum = operator = '';
    display.textContent = '';
    return;
  }

  // Handle CE
  if(target == 'CE') {
    if(roundDec(display.textContent, 2) == firstNum) {
      display.textContent = '';
      updateClearBtn();
    }
    display.textContent = display.textContent.slice(0, -1);
    if(display.textContent.length == 0) clearBtn.textContent = 'AC';
    return;
  }

  // Handle numbers and non-operator inputs
  if(!operators.includes(target)){
    if(target !== '=' && operator !== '='){
      if(firstNum !== '' && roundDec(display.textContent, 2) == firstNum) display.textContent = '';
      display.textContent += target;
      updateClearBtn();
      return;
    }
    if(operator == '='){
      firstNum = '';
      display.textContent = target;
      operator = '';
      updateClearBtn();
      return;
    }
  }

  // Handle equals
  if (target == '='){
    secondNum = display.textContent;
    if(operator == '/' && secondNum == 0){
      display.textContent = "YOU CAN'T DIVIDE BY 0";
      operator = '='; // Assign operator to = makes all the saved number gone within the next event
      clearBtn.textContent = 'AC';
      return;
    }
    const result = operate([firstNum, operator, secondNum]);
    display.textContent = roundDec(result, 2);
    firstNum = result;
    secondNum = '';
    operator = '=';
    clearBtn.textContent = 'AC';
    return;
  }

  // Handle operators
  if (operators.includes(target)){
    if(secondNum == 0 && operator == '/'){
      display.textContent = "YOU CAN'T DIVIDE BY 0";
      operator = '='; // Assign operator to = makes all the saved number gone within the next event
      clearBtn.textContent = 'AC';
      return;
    }
    if(firstNum == '') {
      firstNum = display.textContent;
      operator = target;
      display.textContent = '';
      updateClearBtn();
    }
    else if(display.textContent !== ''){
      secondNum = display.textContent;
      const result = operate([firstNum, operator, secondNum]);
      display.textContent = result;
      firstNum = result;
      operator = target;
      secondNum = '';
      updateClearBtn();
    }
    else operator = target;
  }


}

buttons.addEventListener('click', (e) => {
  calculateAndDisplay('click', e);
  // const clicked = e.target.innerText;
  // const operators = '+-*/';

  // Prevent duplicate decimals
  // if(clicked == '.' && display.textContent.includes('.')) return;

  // Ignore clicks on empty button space
  // if(e.target.className == "buttons") return;


  // // Handle numbers and non-operator inputs
  // if(!operators.includes(clicked)){
  //   if(clicked !== '=' && operator !== '='){
  //     if(firstNum !== '') display.textContent = '';
  //     display.textContent += clicked;
  //     updateClearBtn();
  //     return;
  //   }
  //   if(operator == '='){
  //     firstNum = '';
  //     display.textContent = clicked;
  //     operator = '';
  //     updateClearBtn();
  //     return;
  //   }
  // }

  // // Handle operators
  // if (operators.includes(clicked)){
  //   if(secondNum == 0 && operator == '/'){
  //     display.textContent = "YOU CAN'T DIVIDE BY 0";
  //     operator = '='; // Assign operator to = makes all the saved number gone within the next event
  //     clearBtn.textContent = 'AC';
  //     return;
  //   }
  //   if(firstNum == '') {
  //     firstNum = display.textContent;
  //     operator = clicked;
  //     display.textContent = '';
  //     updateClearBtn();
  //   }
  //   else if(display.textContent !== ''){
  //     secondNum = display.textContent;
  //     const result = operate([firstNum, operator, secondNum]);
  //     display.textContent = result;
  //     firstNum = result;
  //     operator = clicked;
  //     secondNum = '';
  //     updateClearBtn();
  //   }
  //   else operator = clicked;
  // }

  // // Handle equals
  // if (clicked == '='){
  //   secondNum = display.textContent;
  //   if(operator == '/' && secondNum == 0){
  //     display.textContent = "YOU CAN'T DIVIDE BY 0";
  //     operator = '='; // Assign operator to = makes all the saved number gone within the next event
  //     clearBtn.textContent = 'AC';
  //     return;
  //   }
  //   const result = operate([firstNum, operator, secondNum]);
  //   display.textContent = roundDec(result, 2);
  //   firstNum = result;
  //   secondNum = '';
  //   operator = '=';
  //   clearBtn.textContent = 'AC';
  //   return;
  // }
})

document.addEventListener('keypress', (e) => {
  calculateAndDisplay('keypress', e);
})