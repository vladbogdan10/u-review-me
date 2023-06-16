// @ts-nocheck

let wordsCount = 0;

class Counter {
  constructor(quill: any, options: any) {
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector(options.container);
    quill.on('text-change', this.update.bind(this));
    this.update(); // Account for initial contents
  }

  calculate() {
    let text = this.quill.getText();
    text = text.trim();
    // Splitting empty text returns a non-empty array
    return text.length > 0 ? text.split(/\s+/).length : 0;
  }

  update() {
    const length = this.calculate();
    const label = this.options.label;
    this.container.innerText = length + label;
    wordsCount = length;
  }
}

export { wordsCount, Counter as default };
