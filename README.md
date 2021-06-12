# Подготовка

## 1) Создаём файл `index.html` с шаблоном html-5.
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Калькулятор</title>
</head>

<body>
</body>

</html>
```

## 2) Создаём файл `styles.css`.

## 3) Создаём файл `script.js`.

## 4) Подключаем стили и скрипт к html файлу.
В конец тэка `head` добавляем:
```html
  <link rel="stylesheet" href="./styles.css">
  <script src="./script.js"></script>
```
## 5) Для того чтобы скрипт выполнялся после того как отрисуется дом, в скрипт добавляем следующий код:
```js
window.addEventListener('DOMContentLoaded', () => {
  // Тут будет наша логика
});
```
Таким образом мы вешаем обработчик на событие `DOMContentLoaded`.

Другими словами, функция которую мы прокидываем вторым аргументом в `window.addEventListener` выполнится после того как отрисуются все элементы дома.

## 6) Добавляем немного контента в body нашего html файла.
```html
  <main class="main-content">
    <div class="output">0</div>

    <div class="buttons-container">
      <div class="numbers-container">
        <button class="number-button">7</button>
        <button class="number-button">8</button>
        <button class="number-button">9</button>
        <button class="number-button">4</button>
        <button class="number-button">5</button>
        <button class="number-button">6</button>
        <button class="number-button">1</button>
        <button class="number-button">2</button>
        <button class="number-button">3</button>
        <button class="number-button number-button--zero">0</button>
        <button class="number-button">.</button>
      </div>

      <div class="actions-container">
        <button class="action-button">+</button>
        <button class="action-button">-</button>
        <button class="action-button">*</button>
        <button class="action-button">/</button>
        <button class="action-button action-button--equals">=</button>
        <button class="action-button action-button--clear">C</button>
      </div>
    </div>
  </main>
```
Тут у нас кнопки и с цифрами и с действиями.
Чтоб понять что за классы такие странные - почитай что такое методология БЭМ. Особенно разделяю подход яндекса.

## 7) Добавим немного стилей в `styles.css` файл.
Для начала просто скопируй содержимое файла `styles.css` из этой папки. Но нужно обязательно разобраться что тут происходит и изучить не известные свойства и селеторы.

# Добавляем логику
### PS. Самое интересное.

Далее всё пишем в файле `script.js`, внутри функции обработчика события `DOMContentLoaded`.

## 1) Создаём переменные где мы будем хранить всё необходимое.
```js
  const output = document.getElementsByClassName('output')[0]; // Сразу находим в доме поле для вывода. Сюда мы будем часто обращаться.

  let prevNumber = ''; // Значение первого числа
  let currentNumber = '0'; // Значение второго числа
  let action = ''; // Действие
  let isCounted = false; // Флаг для сброса
```
Поле вывода мы находим по классу. Т.к. поиск по классу возвращает не один элемент, а html коллекцию, мы должны достать первый элемент с помощью синтаксиса аналогичного массиву. Поскольку мы точно знаем что поле вывода всего лишь одно, мы смело можем доставать дом элемент с индексом 0.

## 2) Накидываем обработчики на кнопки с числами.
```js
  const onNumberButtonClick = (event) => {
    // Тут будем обрабатывать
  };

  const numberButtons = document.getElementsByClassName('number-button');
  Array.from(numberButtons).forEach((button) => {
    button.addEventListener('click', onNumberButtonClick);
  });
```
Что мы тут делаем:
- Объявляем функцию обработчик клика.
- Находим все кнопки с числами по классу.
- Преобразуем html коллекцию в массив чтобы удобно его проитерировать с помощью метода `forEach`.
- На каждую кнопку навешиваем обработчик клика.

## 3) Аналогично поступаем с кнопками экшенов.
```js
  const onActionButtonClick = (event) => {
    // Тут будем обрабатывать
  };

  const actionButtons = document.getElementsByClassName('action-button');
  Array.from(actionButtons).forEach((button) => {
    button.addEventListener('click', onActionButtonClick);
  });
```
## 4) Создаём функцию сброса.
```js
  const reset = () => {
    prevNumber = '';
    currentNumber = '0';
    action = '';
    isCounted = false;
  };
```

## 5) Создаём функцию для округления числа до указаного количества символов после точки.
Это нам понадобится для дальнейших расчётов.
```js
  const roundTo = (value, to = 2) => {
    const toValue = 10 ** to;
    return Math.round((value + Number.EPSILON) * toValue) / toValue;
  };
```
Обрати внимание на дефолтное значение второго аргумента `to`. Если его не прокинуть, то он будет равен `2`.

На логике в функции сильно не зацикливайся.

## 6) Объявляем функцию для отрисовки значения в поле вывода.
```js
  const renderOutput = () => {
    let string = currentNumber;

    if (prevNumber) {
      string = `${prevNumber} ${action} ${currentNumber}`.trim();
    }

    output.innerHTML = string;
  };
```
Тут мы используем темплейтную строку и метод строки `trim` (он возвращает строку с обрезаными по краям пробелами).

---
## !!! Далее будет больнее !!!
---
## 7) Наполняем логикой обработчик клика по числу.
```js
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
```
Внимательно посмотри что тут происходит. Изучи cложное условие для остановки функции.

## 8) Наполняем логикой обработчик клика по действию.
```js
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
```

## 9) Создаём функцию для подсчёта результата.
```js
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
```

## 10) Внимательно всё в сумме изучаем, гуглим, задаём вопросы, клацаем. Полный код находится прям тут, но думаю ты уже и так это понял.
---
# Вы великолепны!
## Наслаждаемся, играемся, экспериментируем, вдохновляемся и пробуем.
### После этого тутора должно стать гораздо легче.
