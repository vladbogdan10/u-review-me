import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ReactQuill from 'react-quill';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editor: {
      '& .ql-container': {
        fontFamily: theme.typography.fontFamily,
        fontSize: '14px',
        height: '120px',
      },
      '& .ql-editor.ql-blank::before': {
        color: theme.palette.grey[600],
      },
    },
  })
);

const modules = {
  toolbar: [
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
  ],
};

const CommentEditor = (props: {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  isReply: boolean;
}) => {
  const classes = useStyles();
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (props.isReply && quillRef.current) {
      quillRef.current.focus();
    }
  }, [props.isReply, quillRef]);

  return (
    <ReactQuill
      ref={quillRef}
      className={classes.editor}
      theme="bubble"
      value={props.content}
      onChange={props.setContent}
      modules={modules}
      placeholder="Share your thoughts..."
    />
  );
};

export default CommentEditor;
