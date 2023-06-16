import ReactQuill from 'react-quill';

const Block = ReactQuill.Quill.import('blots/block');

class Pros extends Block {
  static create(value: any) {
    let node = super.create(value);
    return node;
  }

  static formats(_domNode: any) {
    return true;
  }

  formats() {
    let formats = super.formats();
    formats['pros'] = Pros.formats(this.domNode);
    return formats;
  }
}
Pros.blotName = 'pros';
Pros.className = 'ql-pro';
Pros.tagName = 'P';

export default Pros;
