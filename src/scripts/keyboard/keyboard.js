import localStorageManager from './localStorageManager';
import keysLayout from './keysLayout';
import Key from './key';

class Keyboard {
  constructor(container) {
    this.container = container;

    this.switchLayout(true);
  }

  switchLayout(isInit) {
    let currentLanguage;

    if (isInit) {
      currentLanguage = localStorageManager.virtualKeyboard.currentLayoutLanguage ?? 'en';
    } else {
      currentLanguage = localStorageManager.virtualKeyboard.currentLayoutLanguage === 'en' ? 'ru' : 'en';
    }

    localStorageManager.virtualKeyboard.currentLayoutLanguage = currentLanguage;
    this.keysLayout = keysLayout[currentLanguage];
  }

  getKeyDataByCode(keyCode) {
    const label = keyCode;
    let onClick = () => {};

    if (keyCode === 'ChangeLanguage') {
      onClick = () => {
        this.switchLayout();
        this.renderKeyboard();
      };
    }

    return {
      label,
      onClick,
    };
  }

  initializeEventListeners() {
    document.addEventListener('keydown', (event) => {
      this.textElement.value += event.key;

      if (event.shiftKey && event.ctrlKey) {
        this.switchLayout();
        this.renderKeyboard();
      }
    });
  }

  renderTextarea() {
    const textarea = document.createElement('textarea');

    textarea.classList.add('text');

    this.container.appendChild(textarea);

    this.textElement = textarea;
  }

  renderKeyboard() {
    const previousKeyboard = document.querySelector('.keyboard');

    if (previousKeyboard) {
      previousKeyboard.remove();
    }

    const keyboard = document.createElement('div');

    keyboard.classList.add('keyboard');

    this.container.appendChild(keyboard);

    this.keysLayout.forEach((keysRowData) => {
      const keysRow = document.createElement('div');

      keysRow.classList.add('keys-row');

      keysRowData.forEach((keyCode) => {
        const keyData = this.getKeyDataByCode(keyCode);
        const key = new Key(keysRow, keyData.label, keyData.onClick);

        key.render();
      });

      keyboard.appendChild(keysRow);
    });
  }

  render() {
    this.container.classList.add('keyboard-container');

    this.renderTextarea();
    this.renderKeyboard();
    this.initializeEventListeners();
  }
}

export default Keyboard;
