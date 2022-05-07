import Keyboard from './scripts/keyboard/keyboard';
import './styles.scss';

function renderHeader(container) {
  const headerElement = document.createElement('header');

  headerElement.classList.add('header');
  headerElement.innerHTML = '<h1 class="title">Virtual keyboard</h1>';

  container.appendChild(headerElement);
}

function renderKeyboard(container) {
  const keyboardElement = document.createElement('div');

  container.appendChild(keyboardElement);

  const keyboard = new Keyboard(keyboardElement);

  keyboard.render();
}

function renderFooter(container) {
  const footerElement = document.createElement('footer');

  footerElement.classList.add('footer');
  footerElement.innerHTML = '<p class="row">Windows usage only</p><p class="row">Ctrl + Shift to switch language</p>';

  container.appendChild(footerElement);
}

window.addEventListener('load', () => {
  const mainElement = document.createElement('main');

  mainElement.classList.add('container');

  renderHeader(mainElement);
  renderKeyboard(mainElement);
  renderFooter(mainElement);

  document.body.appendChild(mainElement);
});
