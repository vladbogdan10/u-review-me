import React from 'react';
import {
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { ChevronLeft } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 3),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(2),
      color: theme.palette.grey[500],
    },
    backButton: {
      position: 'absolute',
      left: theme.spacing(1.4),
      top: theme.spacing(1.8),
      color: theme.palette.grey[500],
      fontSize: '12px',

      '& svg': {
        fontSize: '28px',
      },
    },
    title: {
      paddingRight: theme.spacing(4),
    },
    titleWithBackButton: {
      padding: theme.spacing(0, 4),
    },
  })
);

interface DialogTitleProps {
  children: React.ReactNode;
  onClose: () => void;
  onBack?: () => void;
}
const CreatePostDialogTitle = (props: DialogTitleProps) => {
  const classes = useStyles();
  const { children, onClose, onBack, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h6"
        className={onBack ? classes.titleWithBackButton : classes.title}
      >
        {children}
      </Typography>

      {onBack ? (
        <IconButton
          size="small"
          className={classes.backButton}
          onClick={onBack}
          title="back"
        >
          <ChevronLeft />
        </IconButton>
      ) : null}
      {onClose ? (
        <IconButton
          size="small"
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          title="close"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default CreatePostDialogTitle;
