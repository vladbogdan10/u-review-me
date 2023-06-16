import React, { MouseEvent } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import { MoreVert, Edit, Delete } from '@material-ui/icons';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  icon: {
    width: '20px',
    height: 'auto',
    marginRight: '4px',
  },
});

interface MoreOptionsMenuProps {
  anchorEl: HTMLElement | null;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
  isComment?: boolean;
}

const MoreOptionsMenu = (props: MoreOptionsMenuProps) => {
  const classes = useStyles();

  return (
    <>
      <IconButton
        aria-controls="options"
        aria-haspopup="true"
        onClick={props.handleClick}
        size={props.isComment ? 'small' : undefined}
      >
        <MoreVert />
      </IconButton>
      {props.anchorEl && (
        <Menu
          id="options"
          anchorEl={props.anchorEl}
          keepMounted
          open={Boolean(props.anchorEl)}
          onClose={props.handleClose}
        >
          <MenuItem onClick={props.handleEdit}>
            <Edit className={classes.icon} /> Edit
          </MenuItem>
          <MenuItem onClick={props.handleDelete}>
            <Delete className={classes.icon} />
            Delete
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default MoreOptionsMenu;
