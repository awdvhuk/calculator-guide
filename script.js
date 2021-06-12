window.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementsByClassName('output')[0]; // Сразу находим в доме поле для вывода. Сюда мы будем часто обращаться.

  let prevNumber = ''; // Значение первого числа
  let currentNumber = '0'; // Значение второго числа
  let action = ''; // Действие
  let isCounted = false; // Флаг для сброса

  const onNumberButtonClick = (event) => {
    if (isCounted) {
      reset();
    }

    const buttonText = event.target.innerHTML;

    if (
      (buttonText === '.' && currentNumber.includes('.')) ||
      (buttonText === '0' && currentNumber === '0')
    ) {
      return;
    }
    if (currentNumber === '0') {
      currentNumber = '';
    }

    currentNumber += buttonText;
    renderOutput();
  };

  const numberButtons = document.getElementsByClassName('number-button');
  Array.from(numberButtons).forEach((button) => {
    button.addEventListener('click', onNumberButtonClick);
  });

  const onActionButtonClick = (event) => {
    const newActionValue = event.target.innerHTML;

    switch (newActionValue) {
      case '+':
      case '-':
      case '*':
      case '/':
        if (action) {
          countResult();
        }

        action = newActionValue;
        prevNumber = currentNumber;
        currentNumber = '';
        renderOutput();
        break;

      case '=':
        countResult();
        isCounted = true;
        return;

      case 'C':
        reset();
        renderOutput();
        break;
    }

    isCounted = false;
  };

  const actionButtons = document.getElementsByClassName('action-button');
  Array.from(actionButtons).forEach((button) => {
    button.addEventListener('click', onActionButtonClick);
  });

  const countResult = () => {
    if (!prevNumber || !currentNumber || !action) {
      return;
    }

    let newValue;
    switch (action) {
      case '+':
        newValue = +prevNumber + +currentNumber;
        break;

      case '-':
        newValue = +prevNumber - +currentNumber;
        break;

      case '*':
        newValue = +prevNumber * +currentNumber;
        break;

      case '/':
        newValue = +prevNumber / +currentNumber;
        break;

      default:
        return;
    }

    newValue = roundTo(newValue, 5);
    currentNumber = newValue.toString();
    prevNumber = '';
    action = '';
    output.innerHTML = currentNumber;
  };

  const renderOutput = () => {
    let string = currentNumber;

    if (prevNumber) {
      string = `${prevNumber} ${action} ${currentNumber}`.trim();
    }

    output.innerHTML = string;
  };

  const reset = () => {
    prevNumber = '';
    currentNumber = '0';
    action = '';
    isCounted = false;
  };

  const roundTo = (value, to = 2) => {
    const toValue = 10 ** to;
    return Math.round((value + Number.EPSILON) * toValue) / toValue;
  };
});
