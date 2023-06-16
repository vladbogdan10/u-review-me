import React, { useContext } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import Link from 'next/link';
import { GlobalContext } from '../../context/global-context';
import { OPEN_LOGOUT_MODAL } from '../../context/actions';
import { useSession } from 'next-auth/react';
import buildAvatarUrl from '../../utils/buildAvatarUrl';
import useAuthorized from '../../hooks/useAuthorized';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    avatar: {
      background: 'white',
    },
  })
);

const UserActions = () => {
  const classes = useStyles();

  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [isAuthorized] = useAuthorized();

  const { globalState, dispatchAction } = useContext(GlobalContext);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogout = (event: React.MouseEvent<EventTarget>) => {
    dispatchAction({ type: OPEN_LOGOUT_MODAL, payload: true });
    handleClose(event);
  };

  return (
    <div className={classes.root}>
      <div>
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          size="small"
        >
          <Avatar
            src={buildAvatarUrl(session?.user.image ?? '')}
            alt="User avatar"
            className={classes.avatar}
          />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <Link
                      href={`/user/${session?.user.username}`}
                      prefetch={false}
                    >
                      <MenuItem
                        onClick={(e) => isAuthorized(() => handleClose(e))}
                      >
                        <PersonIcon fontSize="small" className={classes.icon} />
                        Profile
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={handleLogout}>
                      <ExitToAppIcon
                        fontSize="small"
                        className={classes.icon}
                      />
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default UserActions;
