import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { ExposurePlus1, ModeComment } from '@material-ui/icons';
import LinkNext from 'next/link';
import PostRatingIcons from '../PostRating/PostRatingIcons';
import { PostCardProps } from './PostCard';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';
import { useSession } from 'next-auth/react';
import Tooltip from '@material-ui/core/Tooltip';
import useAuthorized from '../../hooks/useAuthorized';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0.5),
      '& > div': {
        marginRight: theme.spacing(2),
      },
    },
    postRating: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'flex-end',
      '& > div': {
        display: 'flex',
        alignItems: 'center',
        '& svg': {
          marginRight: theme.spacing(1),
        },
      },
    },
  })
);

const postRatingIcons = PostRatingIcons();

const PostCardActions = (post: PostCardProps) => {
  const classes = useStyles();

  const [isAuthorized] = useAuthorized();
  const [likes, setLikes] = useState(0);
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState<
    boolean | undefined
  >(false);
  const { data: session } = useSession();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  useEffect(() => {
    setLikes(post.likes);
    setIsLikedByCurrentUser(post.isLikedByCurrentUser);
  }, [post.likes, post.isLikedByCurrentUser]);

  const updateLikes = async () => {
    const payload = {
      apiPath: isLikedByCurrentUser ? 'delete' : 'create',
      method: isLikedByCurrentUser ? 'DELETE' : 'POST',
      body: {
        contentType: 'Post',
        contentId: post._id,
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

  return (
    <CardActions className={classes.root} disableSpacing>
      <div>
        <Tooltip disableFocusListener title="Show appreciation">
          <IconButton
            aria-label="helpful"
            onClick={() => isAuthorized(updateLikes)}
          >
            <ExposurePlus1
              color={isLikedByCurrentUser ? 'primary' : 'inherit'}
            />
          </IconButton>
        </Tooltip>
        {likes > 0 && (
          <Typography variant="caption" color="textSecondary">
            {likes}
          </Typography>
        )}
      </div>
      <div>
        <LinkNext
          href={`/${post.category}/${post.subcategory}/${post.urlId}/${post.slug}`}
          prefetch={false}
        >
          <Tooltip disableFocusListener title="Comments">
            <IconButton aria-label="comments">
              <ModeComment />
            </IconButton>
          </Tooltip>
        </LinkNext>
        {post.commentsCount > 0 && (
          <Typography variant="caption" color="textSecondary">
            {post.commentsCount}
          </Typography>
        )}
      </div>
      <div className={classes.postRating}>
        <Tooltip disableFocusListener title="Rating">
          <div style={{ color: postRatingIcons[post.rating].color }}>
            {postRatingIcons[post.rating].icon}
            <Typography variant="caption">
              {postRatingIcons[post.rating].label}
            </Typography>
          </div>
        </Tooltip>
      </div>
    </CardActions>
  );
};

export default PostCardActions;
