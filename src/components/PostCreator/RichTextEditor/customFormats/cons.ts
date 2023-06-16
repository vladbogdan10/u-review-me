import ReactQuill from 'react-quill';

const Block = ReactQuill.Quill.import('blots/block');

class Cons extends Block {
  static create(value: any) {
    let node = super.create(value);
    return node;
  }

  static formats(_domNode: any) {
    return true;
  }

  formats() {
    let formats = super.formats();
    formats['cons'] = Cons.formats(this.domNode);
    return formats;
  }
}
Cons.blotName = 'cons';
Cons.className = 'ql-con';
Cons.tagName = 'P';

export default Cons;
