const buttonStart = document.getElementById('start');
const play = document.getElementById('play');
const form = document.getElementById('form');


function shuffle(arr){
  let j, temp;
  for(let i = arr.length - 1; i > 0; i--){
    j = Math.floor(Math.random()*(i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function createArrayNumbers(amount = 2) {

  let arrNumbersPair;

  let arr = [];
  let arr2 = [];

  for(let i = amount*amount / 2; i > 0; i--) {
    arr.push(i);
    arr2.push(i);
  }

  arrNumbersPair = [arr, arr2];

  for (let i = 1; i >= 0; i--) {
    shuffle(arrNumbersPair[i]);
    for(let j = (amount-2)/2; j > 0; j--) {
      arrNumbersPair.push(arrNumbersPair[i].splice(0, amount));
    }
  }
  
  shuffle(arrNumbersPair);
  return arrNumbersPair;
}

function useStorage(key, value, action, newValue) {
  let stateLocalStorage = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
  let idValue = stateLocalStorage.indexOf(value);

  switch (action) {
    case 'init':
      stateLocalStorage = [];
      break;
    case 'add':
      stateLocalStorage.push(value);
      break;
    case 'chenge':
      if (idValue >= 0) stateLocalStorage[idValue] = newValue;
      break;
    case 'toggleBool':
      if (idValue >= 0) stateLocalStorage[idValue] = !stateLocalStorage[idValue];
      break;
    case 'del':
      if (idValue >= 0) stateLocalStorage.splice(idValue, 1);
      break;
  }
  localStorage.setItem(key, JSON.stringify(stateLocalStorage));
  return stateLocalStorage;
}

function checkCadr(span) {
  let stateOpenCard = useStorage('openCards');
  if (span.style.visibility == 'hidden' && stateOpenCard.length !== 2) {
    if (stateOpenCard.length == 0) {
      useStorage('openCards', parseInt(span.textContent), 'add');
      span.style.visibility = 'visible';
    } else {
      stateOpenCard = useStorage('openCards', parseInt(span.textContent), 'add');
      span.style.visibility = 'visible';

      if (stateOpenCard[0] === stateOpenCard[1]) {
        let visibleItems = document.querySelectorAll("span[style='visibility: visible;']");
        visibleItems.forEach((item) => {
          item.removeAttribute('style');
        });
      }
    }

    if (stateOpenCard.length == 2) {
      setTimeout(() => {
        useStorage('openCards', '', 'init');
        let visibleItems = document.querySelectorAll("span[style='visibility: visible;']");
        visibleItems.forEach((item) => {
          item.style.visibility = 'hidden';
        });
      }, 1000);
    }
  }
  if (document.querySelectorAll("span[style]").length == 0) win();
}

function initGame(lvlNumber) {

  const arrNumbersPair = createArrayNumbers(lvlNumber);
  play.innerHTML = '';
  buttonStart.setAttribute("disabled", "disabled");
  useStorage('openCards', '', 'init');

  for (const arr of arrNumbersPair) {
    let container = document.createElement('div');
    container.classList.add('line');
    
    for (const number of arr) {
      let button = document.createElement('button');
      button.classList.add('column', 'btn');
      let span = document.createElement('span');
      span.innerText = number;
      span.style.visibility = 'hidden';
      button.append(span);

      button.addEventListener('click', () => {
        checkCadr(span);
      });

      container.append(button);
    }
    play.append(container);
  }
}

function menu() {
  play.innerHTML = '';
  let inputs = ['easy', 'normal', 'middle', 'hard'];
  let form = document.createElement('form');
  for (const item of inputs) {
    let input = document.createElement('input');
    let label = document.createElement('label');
    input.setAttribute("type", "radio");
    input.setAttribute("name", "lvl");
    input.setAttribute("id", item);
    label.setAttribute('for', item)
    label.innerText = item;
    form.append(input);
    form.append(label);
  }
  play.append(form);
}

function win() {
  let span = document.createElement('span');
  let button = document.createElement('button');
  button.innerText = 'ещё';
  button.classList.add('btn')

  button.addEventListener('click', () => {
    menu();
  });

  span.textContent = 'ты пидор!';
  span.classList.add('win');

  play.innerHTML = '';
  play.append(span);
  play.append(button);
  buttonStart.removeAttribute("disabled", "disabled");
} 

buttonStart.addEventListener('click', () => {
  document.querySelectorAll('input').forEach((item) => {
    let lvlNumber;

    if (item.checked) {
      switch (item.id) {
        case 'easy':
          console.log('easy');
          lvlNumber = 2;
          break;
        case 'normal':
          console.log('normal');
          lvlNumber = 4;
          break;
        case 'middle':
          console.log('middle');
          lvlNumber = 6;
          break;
        case 'hard':
          console.log('hard');
          lvlNumber = 8;
          break;
      }
      console.log(lvlNumber);
      initGame(lvlNumber);
    }
  });
});