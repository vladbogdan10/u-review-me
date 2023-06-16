import React, { useContext, useEffect, useRef } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ReactQuillToolbar from './ReactQuillToolbar';
import ReactQuill from 'react-quill';
import formats from './formats';
import customKeyboardBindings from './customKeyboardBindings';
import Cons from './customFormats/cons';
import Pros from './customFormats/pros';
import Counter, { wordsCount } from './customFormats/counter';
import { headingSvg } from './svgStrings';
import { GlobalContext } from '../../../context/global-context';
import { POST_WORDS_COUNT } from '../../../context/actions';

export const MINIMUM_WORDS_COUNT = '150';

const icons = ReactQuill.Quill.import('ui/icons');
icons['header'] = headingSvg;

ReactQuill.Quill.register('formats/pros', Pros, true);
ReactQuill.Quill.register('formats/cons', Cons, true);
ReactQuill.Quill.register('modules/counter', Counter, true);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${theme.palette.grey[600]}`,
      borderRadius: theme.shape.borderRadius,
    },
    editor: {
      '& .ql-container': {
        height: '400px',
        border: 'none',
        fontFamily: theme.typography.fontFamily,
        fontSize: '14px',
      },
      '& .ql-editor.ql-blank::before': {
        color: theme.palette.grey[600],
      },
      '& .ql-tooltip': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 0px 5px 0px rgb(0 0 0 / 25%)',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.grey[600]}`,
        borderRadius: theme.shape.borderRadius,
        '& input[type=text]': {
          border: `1px solid ${theme.palette.grey[600]}`,
          borderRadius: theme.shape.borderRadius,
        },
      },
    },
  })
);

const modules = {
  toolbar: '#toolbar',
  keyboard: {
    bindings: customKeyboardBindings,
  },
  counter: {
    container: '#counter',
    label: `/${MINIMUM_WORDS_COUNT}`,
  },
};

const ReactQuillEditor = (props: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const classes = useStyles();
  const quillRef = useRef<ReactQuill>(null);

  const { globalState, dispatchAction } = useContext(GlobalContext);

  useEffect(() => (quillRef.current ? quillRef.current.blur() : undefined), []);

  useEffect(() => {
    dispatchAction({ type: POST_WORDS_COUNT, payload: wordsCount });
  }, [props.value]);

  return (
    <div className={classes.root}>
      <ReactQuillToolbar />
      <div data-text-editor="quill">
        <ReactQuill
          ref={quillRef}
          className={classes.editor}
          theme="snow"
          modules={modules}
          formats={formats}
          defaultValue={props.value}
          onChange={props.onChange}
          bounds={`[data-text-editor="quill"]`}
          placeholder={`Review should have a minimum of ${MINIMUM_WORDS_COUNT} words.`}
        />
      </div>
    </div>
  );
};

export default ReactQuillEditor;
