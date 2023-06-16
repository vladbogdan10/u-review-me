import { Range } from 'react-quill';

export default {
  prosConsBackspace: {
    key: 'backspace',
    format: ['pros', 'cons'],
    handler: function (range: Range, context: any) {
      if (context.empty) {
        // @ts-ignore
        this.quill.removeFormat(range.index, 1, 'user');
      } else {
        // quill default
        return true;
      }
    },
  },
  prosConsEnter: {
    key: 'enter',
    format: ['pros', 'cons'],
    handler: function (range: Range, context: any) {
      if (context.empty) {
        // @ts-ignore
        this.quill.removeFormat(range.index, 1, 'user');
      } else {
        // quill default
        return true;
      }
    },
  },
};
