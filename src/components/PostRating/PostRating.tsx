import React, { ChangeEvent } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Rating, { IconContainerProps } from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import RatingIcons from './PostRatingIcons';

const icons = RatingIcons();

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      margin: 0,
    },
    ratingIcons: {
      '& .ratingIcon-1': {
        '&.MuiRating': {
          '&-iconFilled': {
            color: icons[1].color,
          },
          '&-iconHover': {
            color: icons[1].color,
          },
        },
      },
      '& .ratingIcon-2': {
        '&.MuiRating': {
          '&-iconFilled': {
            color: icons[2].color,
          },
          '&-iconHover': {
            color: icons[2].color,
          },
        },
      },
      '& .ratingIcon-3': {
        '&.MuiRating': {
          '&-iconFilled': {
            color: icons[3].color,
          },
          '&-iconHover': {
            color: icons[3].color,
          },
        },
      },
      '& .ratingIcon-4': {
        '&.MuiRating': {
          '&-iconFilled': {
            color: icons[4].color,
          },
          '&-iconHover': {
            color: icons[4].color,
          },
        },
      },
      '& .ratingIcon-5': {
        '&.MuiRating': {
          '&-iconFilled': {
            color: icons[5].color,
          },
          '&-iconHover': {
            color: icons[5].color,
          },
        },
      },
    },
  })
);

const IconContainer = (props: IconContainerProps) => {
  const classes = useStyles();
  const { value, ...other } = props;

  return (
    <div className={classes.ratingIcons}>
      <span className={`ratingIcon-${value} ${other.className}`}>
        {icons[value].icon}
      </span>
    </div>
  );
};

const PostRating = (props: {
  rating: number;
  setRating: (event: ChangeEvent<{}>, value: number | null) => void;
}) => {
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();

  return (
    <div>
      <Box
        component="fieldset"
        borderColor="transparent"
        className={classes.root}
      >
        <Typography component="legend" variant="srOnly">
          Rate review
        </Typography>
        <Rating
          name="reviewRating"
          value={props.rating}
          onChange={props.setRating}
          onChangeActive={(_e, newHover) => {
            setHover(newHover);
          }}
          getLabelText={(value) => icons[value].label}
          IconContainerComponent={IconContainer}
        />
        <Box component="span" ml={1}>
          {icons[hover !== -1 ? hover : props.rating].label}
        </Box>
      </Box>
    </div>
  );
};

export default PostRating;
