import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

const RatingIcons = () => {
  const customIcons: {
    [index: string]: { icon: React.ReactElement; label: string; color: string };
  } = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon />,
      label: 'Very Bad',
      color: '#fd4a4a',
    },
    2: {
      icon: <SentimentDissatisfiedIcon />,
      label: 'Bad',
      color: '#fa900d',
    },
    3: {
      icon: <SentimentSatisfiedIcon />,
      label: 'Acceptable',
      color: '#f2c841',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon />,
      label: 'Good',
      color: '#48d67d',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon />,
      label: 'Very Good',
      color: '#5ec7d4',
    },
  };

  return customIcons;
};

export default RatingIcons;
