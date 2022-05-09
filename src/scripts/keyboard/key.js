class Key {
  constructor(container, keyCode, label, secondLabel, isLowerCase, onClick) {
    this.container = container;
    this.keyCode = keyCode;
    this.label = label;
    this.secondLabel = secondLabel;
    this.isLowerCase = isLowerCase;
    this.onClick = onClick;
  }

  render() {
    const key = document.createElement('button');

    key.classList.add('key');
    key.setAttribute('data-key-code', this.keyCode);
    key.innerHTML = `<span class="label">${this.isLowerCase ? this.label.toLowerCase() : this.label}</span>`;

    if (this.secondLabel) {
      key.innerHTML += `<span class="upper-label">${this.secondLabel}</span>`;
    }

    key.addEventListener('click', this.onClick);

    this.container.appendChild(key);
  }
}

export default Key;
