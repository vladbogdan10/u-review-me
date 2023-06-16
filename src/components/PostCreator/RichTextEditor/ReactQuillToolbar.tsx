import React from 'react';
import { AddCircle, RemoveCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { createStyles, Theme } from '@material-ui/core/styles';
import { Tooltip, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.grey[600]}`,
      '& .ql-toolbar.ql-snow': {
        border: 'none',
      },
      '& .ql-stroke': {
        stroke: theme.palette.grey[400],
      },
      '& .ql-fill': {
        fill: theme.palette.grey[400],
      },
      '& .ql-snow.ql-toolbar': {
        '& button:hover, button:focus': {
          color: theme.palette.brand,
          '& .ql-fill': {
            fill: theme.palette.brand,
          },
          '& .ql-stroke': {
            stroke: theme.palette.brand,
          },
        },
        '& button.ql-active': {
          color: theme.palette.brand,
          '& .ql-fill': {
            fill: theme.palette.brand,
          },
          '& .ql-stroke': {
            stroke: theme.palette.brand,
          },
        },
      },
      '& .ql-pros, .ql-cons': {
        display: 'flex !important',
        alignItems: 'center',
        width: 'auto !important',
        color: theme.palette.grey[400],
        '& svg': {
          marginRight: theme.spacing(0.4),
        },
      },
    },
    counter: {
      marginRight: theme.spacing(1.5),
    },
  })
);

const ReactQuillToolbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.toolbar}>
      <div id="toolbar">
        <span className="ql-formats">
          <Tooltip title="Heading">
            <button className="ql-header" value="2"></button>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Bold">
            <button className="ql-bold"></button>
          </Tooltip>
          <Tooltip title="Italics">
            <button className="ql-italic"></button>
          </Tooltip>
          <Tooltip title="Underline">
            <button className="ql-underline"></button>
          </Tooltip>
          <Tooltip title="Strikethrough">
            <button className="ql-strike"></button>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Numbered List">
            <button className="ql-list" value="ordered"></button>
          </Tooltip>
          <Tooltip title="Bulleted List">
            <button className="ql-list" value="bullet"></button>
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip title="Quote Block">
            <button className="ql-blockquote"></button>
          </Tooltip>
          <Tooltip title="Link (selected text)">
            <button className="ql-link"></button>
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip title="Add pros">
            <button className="ql-pros">
              <AddCircle />
              Pros
            </button>
          </Tooltip>
          <Tooltip title="Add cons">
            <button className="ql-cons">
              <RemoveCircle />
              Cons
            </button>
          </Tooltip>
        </span>
      </div>
      <Typography
        variant="caption"
        id="counter"
        className={classes.counter}
        color="textSecondary"
      />
    </div>
  );
};

export default ReactQuillToolbar;
