import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { ExposurePlus1 } from '@material-ui/icons';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';
import { CommentProps } from './Comment';
import Tooltip from '@material-ui/core/Tooltip';
import useAuthorized from '../../hooks/useAuthorized';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginLeft: '-7px',
      marginTop: '4px',
    },
  })
);

interface CommentActionsProps extends CommentProps {
  setIsReply: Dispatch<SetStateAction<boolean>>;
}

const CommentActions = (props: CommentActionsProps) => {
  const classes = useStyles();
  const { comment, postUrl } = props;

  const [isAuthorized] = useAuthorized();
  const [likes, setLikes] = useState(comment.likes);
  const { data: session } = useSession();
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(
    comment.isLikedByCurrentUser
  );

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const updateLikes = async () => {
    const payload = {
      apiPath: isLikedByCurrentUser ? 'delete' : 'create',
      method: isLikedByCurrentUser ? 'DELETE' : 'POST',
      body: {
        contentType: 'Comment',
        contentId: comment._id,
        userId: session?.user.id,
      },
    };

    const response = await fetch(`/api/${payload.apiPath}/like`, {
      method: payload.method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload.body),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    setLikes(isLikedByCurrentUser ? likes - 1 : likes + 1);
    setIsLikedByCurrentUser((prevState) => !prevState);
  };

  const replyHandle = () => {
    if (postUrl) {
      router.push(postUrl);
    } else {
      props.setIsReply(true);
    }
  };

  useEffect(() => {
    const urlHash = router.asPath.split('#');

    if (comment._id === urlHash[1]) {
      props.setIsReply(true);
    }
  }, []);

  return (
    <div className={classes.root}>
      <Tooltip disableFocusListener title="Show appreciation">
        <IconButton
          aria-label="helpful"
          size="small"
          onClick={() => isAuthorized(updateLikes)}
        >
          <ExposurePlus1 color={isLikedByCurrentUser ? 'primary' : 'inherit'} />
        </IconButton>
      </Tooltip>
      <Typography variant="caption" color="textSecondary">
        {likes > 0 ? likes : ''}
      </Typography>
      <Button size="small" onClick={() => isAuthorized(replyHandle)}>
        Reply
      </Button>
    </div>
  );
};

export default CommentActions;
