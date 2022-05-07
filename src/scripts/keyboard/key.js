class Key {
  constructor(container, label, onClick) {
    this.container = container;
    this.label = label;
    this.onClick = onClick;
  }

  render() {
    const key = document.createElement('button');

    key.classList.add('key');
    key.textContent = this.label;
    key.addEventListener('click', this.onClick);

    this.container.appendChild(key);
  }
}

export default Key;
