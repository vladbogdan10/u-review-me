import React, { useContext, useEffect, useRef } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ReactQuill from 'react-quill';
import formats from './formats';
import { consSvg, headingSvg, prosSvg } from './svgStrings';
import customKeyboardBindings from './customKeyboardBindings';
import Pros from './customFormats/pros';
import Cons from './customFormats/cons';
import Counter, { wordsCount } from './customFormats/counter';
import { GlobalContext } from '../../../context/global-context';
import { POST_WORDS_COUNT } from '../../../context/actions';
import { Typography } from '@material-ui/core';
import { MINIMUM_WORDS_COUNT } from './ReactQuill';

const icons = ReactQuill.Quill.import('ui/icons');
icons['header'] = headingSvg;
icons['pros'] = prosSvg;
icons['cons'] = consSvg;

ReactQuill.Quill.register('formats/pros', Pros, true);
ReactQuill.Quill.register('formats/cons', Cons, true);
ReactQuill.Quill.register('modules/counter', Counter, true);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      '& .ql-container': {
        height: 'calc(100vh - 316px)', // TODO: get height dinamically,
        border: `1px solid ${theme.palette.grey[600]}`,
        borderRadius: theme.shape.borderRadius,
        fontFamily: theme.typography.fontFamily,
        fontSize: '14px',
      },
      '& .ql-editor.ql-blank::before': {
        color: theme.palette.grey[600],
      },
    },
    info: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

const modules = {
  toolbar: [
    ['header'],
    ['bold', 'italic', 'underline'],
    [
      {
        list: 'ordered',
      },
      {
        list: 'bullet',
      },
    ],
    ['link'],
    ['pros', 'cons'],
  ],
  keyboard: {
    bindings: customKeyboardBindings,
  },
  counter: {
    container: '#counter',
    label: `/${MINIMUM_WORDS_COUNT}`,
  },
};

const ReactQuillBubble = (props: {
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
    <>
      <div className={classes.info}>
        <Typography variant="caption" color="textSecondary">
          Tipp: highlight text to modify
        </Typography>
        <Typography id="counter" variant="caption" color="textSecondary" />
      </div>
      <div data-text-editor="quill">
        <ReactQuill
          ref={quillRef}
          className={classes.editor}
          theme="bubble"
          modules={modules}
          formats={formats}
          defaultValue={props.value}
          onChange={props.onChange}
          bounds={`[data-text-editor="quill"]`}
          placeholder={`Review should have a minimum of ${MINIMUM_WORDS_COUNT} words.`}
        />
      </div>
    </>
  );
};

export default ReactQuillBubble;
