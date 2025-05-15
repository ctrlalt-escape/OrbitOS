
import React, { useState } from 'react';

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand: number, secondOperand: number, operator: string) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const buttonStyle = "w-full h-14 bg-gray-200 hover:bg-gray-300 transition-colors rounded-md font-medium";
  const operatorButtonStyle = "w-full h-14 bg-orange-500 hover:bg-orange-600 transition-colors rounded-md text-white font-medium";

  return (
    <div className="flex flex-col p-4 h-full bg-gray-100">
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
        <div className="text-right text-3xl font-light tracking-tight h-10 overflow-hidden">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clearDisplay} className={buttonStyle}>AC</button>
        <button onClick={() => setDisplay(String(parseFloat(display) * -1))} className={buttonStyle}>+/-</button>
        <button onClick={() => setDisplay(String(parseFloat(display) / 100))} className={buttonStyle}>%</button>
        <button onClick={() => performOperation('/')} className={operatorButtonStyle}>÷</button>

        <button onClick={() => inputDigit('7')} className={buttonStyle}>7</button>
        <button onClick={() => inputDigit('8')} className={buttonStyle}>8</button>
        <button onClick={() => inputDigit('9')} className={buttonStyle}>9</button>
        <button onClick={() => performOperation('*')} className={operatorButtonStyle}>×</button>

        <button onClick={() => inputDigit('4')} className={buttonStyle}>4</button>
        <button onClick={() => inputDigit('5')} className={buttonStyle}>5</button>
        <button onClick={() => inputDigit('6')} className={buttonStyle}>6</button>
        <button onClick={() => performOperation('-')} className={operatorButtonStyle}>-</button>

        <button onClick={() => inputDigit('1')} className={buttonStyle}>1</button>
        <button onClick={() => inputDigit('2')} className={buttonStyle}>2</button>
        <button onClick={() => inputDigit('3')} className={buttonStyle}>3</button>
        <button onClick={() => performOperation('+')} className={operatorButtonStyle}>+</button>

        <button onClick={() => inputDigit('0')} className="col-span-2 h-14 bg-gray-200 hover:bg-gray-300 transition-colors rounded-md font-medium">0</button>
        <button onClick={inputDecimal} className={buttonStyle}>.</button>
        <button onClick={handleEquals} className={operatorButtonStyle}>=</button>
      </div>
    </div>
  );
};

export default CalculatorApp;
