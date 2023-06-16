import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box, Tooltip } from '@material-ui/core';
import PostCardImageCarousel from './PostCardImageCarousel';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { PostCardProps } from './PostCard';
import truncate from 'truncate-html';

dayjs.extend(RelativeTime);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textContainer: {
      '& .ql-editor': {
        padding: theme.spacing(1, 2),
      },
    },
    postEdited: {
      color: theme.palette.grey[500],
      marginTop: '20px',
      padding: `0 ${theme.spacing(2)}px`,
    },
    link: {
      '& .ql-editor > *': {
        cursor: 'pointer',
      },
    },
  })
);

const PostCardContent = (post: PostCardProps) => {
  const classes = useStyles();
  const formattedDate = new Date(post.updatedAt).toDateString();

  return (
    <>
      {post.isFullSizedPost ? (
        post.isDeleted ? (
          <Box p={2}>
            <Alert severity="error" variant="outlined">
              <AlertTitle>
                This review was deleted by the person who posted it.
              </AlertTitle>
              It won't show up in any feed, and anyone with a direct link to it
              will see this message.
            </Alert>
          </Box>
        ) : (
          <>
            {post.images.length > 0 && (
              <Box pb={1.5}>
                <PostCardImageCarousel
                  images={post.images}
                  isFeed={false}
                  altPrefix={post.subcategory}
                  isFullSizedPost={post.isFullSizedPost}
                />
              </Box>
            )}
            <div className={`${classes.textContainer} ql-snow`}>
              <Typography
                className={'ql-editor'}
                variant="body2"
                color="textPrimary"
                component="div"
                dangerouslySetInnerHTML={{
                  __html: post.content,
                }}
              ></Typography>
              {post.postUpdatedAt && (
                <p className={classes.postEdited}>
                  <Tooltip disableFocusListener title={formattedDate}>
                    <em>Edited {dayjs(post.postUpdatedAt).fromNow()}</em>
                  </Tooltip>
                </p>
              )}
            </div>
          </>
        )
      ) : (
        <>
          {post.images.length > 0 && (
            <Box pb={1.5}>
              <PostCardImageCarousel
                images={post.images}
                isFeed={true}
                altPrefix={post.subcategory}
              />
            </Box>
          )}
          <div className={`${classes.textContainer} ql-snow`}>
            <Typography
              className={'ql-editor'}
              variant="body2"
              color="textPrimary"
              component="div"
              dangerouslySetInnerHTML={{
                __html: truncate(post.content, 65, { byWords: true }),
              }}
            ></Typography>
          </div>
        </>
      )}
    </>
  );
};

export default PostCardContent;
