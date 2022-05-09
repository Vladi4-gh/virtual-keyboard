import localStorageManager from './localStorageManager';
import keysLayout from './keysLayout';
import Key from './key';

class Keyboard {
  constructor(container) {
    this.container = container;
    this.isLowerCase = true;
    this.isShift = false;
    this.isCapsLock = false;

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
    this.keysInfo = this.keysLayout.flat().reduce((acc, x) => {
      acc[x.keyCode] = { ...x };

      return acc;
    }, {});
  }

  getKeyHandler(keyData) {
    if (keyData.keyCode === 'ChangeLanguage') {
      return () => {
        this.switchLayout();
        this.renderKeyboard();
        this.textElement.focus();
      };
    }

    if (keyData.keyCode === 'Tab') {
      return () => {
        this.textElement.value += '\t';

        this.textElement.focus();
      };
    }

    if (keyData.keyCode === 'Backspace') {
      return () => {
        this.handleBackspace();
        this.textElement.focus();
      };
    }

    if (keyData.keyCode === 'Delete') {
      return () => {
        this.handleDelete();
        this.textElement.focus();
      };
    }

    if (keyData.keyCode === 'Enter') {
      return () => {
        this.textElement.value += '\n';

        this.textElement.focus();
      };
    }

    if (keyData.keyCode === 'Space') {
      return () => {
        this.textElement.value += ' ';

        this.textElement.focus();
      };
    }

    if (keyData.keyCode === 'CapsLock') {
      return () => {
        this.isCapsLock = !this.isCapsLock;
        this.isLowerCase = !this.isCapsLock;

        this.renderKeyboard();
        this.textElement.focus();
      };
    }

    if (keyData.isWritable) {
      return () => {
        this.textElement.value += this.isLowerCase ? keyData.label.toLowerCase() : keyData.label;
        this.textElement.focus();
      };
    }

    return () => {
      this.textElement.focus();
    };
  }

  initializeEventListeners() {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();

      document.querySelector(`.key[data-key-code="${event.code}"]`).classList.add('active');

      if (this.keysInfo[event.code].keyCode === 'Tab') {
        this.textElement.value += '\t';
      } else if (this.keysInfo[event.code].keyCode === 'Backspace') {
        this.handleBackspace();
      } else if (this.keysInfo[event.code].keyCode === 'Delete') {
        this.handleDelete();
      } else if (this.keysInfo[event.code].keyCode === 'Enter') {
        this.textElement.value += '\n';
      } else if (this.keysInfo[event.code].keyCode === 'Space') {
        this.textElement.value += ' ';
      } else if (this.keysInfo[event.code].keyCode === 'CapsLock') {
        this.isCapsLock = !this.isCapsLock;
        this.isLowerCase = !this.isCapsLock;

        this.renderKeyboard();
      } else if (this.keysInfo[event.code].keyCode === 'ArrowUp') {
        this.textElement.value += '↑';
      } else if (this.keysInfo[event.code].keyCode === 'ArrowLeft') {
        this.textElement.value += '←';
      } else if (this.keysInfo[event.code].keyCode === 'ArrowDown') {
        this.textElement.value += '↓';
      } else if (this.keysInfo[event.code].keyCode === 'ArrowRight') {
        this.textElement.value += '→';
      } else if (this.keysInfo[event.code].isWritable) {
        this.textElement.value += event.key;
      } else if (event.shiftKey && !event.repeat) {
        this.isShift = true;
        this.isLowerCase = this.isCapsLock ? !this.isLowerCase : false;

        this.renderKeyboard();
      } else if (event.shiftKey && event.ctrlKey) {
        this.switchLayout();
        this.renderKeyboard();
      }

      this.textElement.focus();
    });

    document.addEventListener('keyup', (event) => {
      document.querySelector(`.key[data-key-code="${event.code}"]`).classList.remove('active');

      this.isLowerCase = this.isCapsLock ? !this.isLowerCase : true;

      if (this.isShift) {
        this.isShift = false;

        this.renderKeyboard();
      }

      this.textElement.focus();
    });
  }

  handleDelete() {
    const start = this.textElement.selectionStart;
    const end = this.textElement.selectionEnd;

    if (start === end) {
      this.textElement.value = this.textElement.value.substring(0, start) + this.textElement.value.substring(start + 1);
    } else {
      this.textElement.value = this.textElement.value.substring(0, start) + this.textElement.value.substring(end);
    }

    this.textElement.focus();
    this.textElement.setSelectionRange(start, start);
  }

  handleBackspace() {
    const start = this.textElement.selectionStart;
    const end = this.textElement.selectionEnd;

    if (start === end) {
      this.textElement.value = this.textElement.value.substring(0, start - 1) + this.textElement.value.substring(end);
      this.textElement.setSelectionRange(start - 1, start - 1);
    } else {
      this.textElement.value = this.textElement.value.substring(0, start) + this.textElement.value.substring(end);
      this.textElement.setSelectionRange(start, start);
    }

    this.textElement.focus();
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

      keysRowData.forEach((keyData) => {
        const keyHandler = this.getKeyHandler(keyData);
        const isActive = keyData.keyCode === 'CapsLock' && this.isCapsLock;
        const key = new Key(keysRow, keyData.keyCode, keyData.label, keyData.secondLabel, keyData.isCaseSensitive ? this.isLowerCase : false, isActive, keyHandler);

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
