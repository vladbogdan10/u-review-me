import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Add, AddPhotoAlternate, DeleteForever } from '@material-ui/icons';
import ImageUploading, {
  ImageListType,
  ImageType,
} from 'react-images-uploading';
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Resizer from 'react-image-file-resizer';
import { nanoid } from 'nanoid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      border: `1px solid ${theme.palette.grey[600]}`,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(0.5),
      marginBottom: theme.spacing(1),
    },
    uploadBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      width: '100%',
      color: theme.palette.text.secondary,

      '& > span': {
        padding: theme.spacing(1),
      },
    },
    imageContainer: {
      position: 'relative',
      margin: theme.spacing(0.8),
      fontSize: '0',

      '& > img': {
        borderRadius: theme.shape.borderRadius,
      },

      '&:hover .delete-overlay': {
        visibility: 'visible',
      },
    },
    imageOverlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'rgb(0 0 0 / 40%)',
      borderRadius: theme.shape.borderRadius,
      visibility: 'hidden',

      [theme.breakpoints.down('xs')]: {
        visibility: 'visible',
      },
    },
  })
);

const ImageUpload = (props: {
  images: ImageListType;
  setImage: (imageList: ImageListType) => void;
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const maxNumber = 5;

  const isMobileView = useMediaQuery(theme.breakpoints.down('xs'));

  const onChange = (imageList: ImageListType) => {
    imageList.forEach((image) => {
      resizeImage(image);
    });

    props.setImage(imageList);
  };

  const resizeImage = (image: ImageType) => {
    if (image.file) {
      try {
        Resizer.imageFileResizer(
          image.file,
          3000,
          3000,
          'JPEG',
          60,
          0,
          (base64Uri) => {
            image.dataURL = base64Uri as string;
            image.identifier = nanoid();
          },
          'base64',
          300,
          300
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <ImageUploading
      multiple
      value={props.images}
      onChange={onChange}
      maxNumber={maxNumber}
    >
      {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
        <div
          className={classes.root}
          aria-label="upload picture"
          {...dragProps}
          // style={isDragging ? { color: 'red' } : undefined}
        >
          {imageList.length < 1 && (
            <div className={classes.uploadBox} onClick={onImageUpload}>
              <AddPhotoAlternate />
              {isMobileView ? (
                <span>Tap here to upload images</span>
              ) : (
                <span>Click or drag and drop here to upload images</span>
              )}
            </div>
          )}
          {imageList.length > 0 && imageList.length < maxNumber && (
            <Box order={1} clone>
              <IconButton size="small" onClick={onImageUpload}>
                <Add />
              </IconButton>
            </Box>
          )}
          {imageList.map((image, index) => (
            <div className={classes.imageContainer} key={index}>
              <img
                src={image.dataURL}
                alt=""
                width="auto"
                height={isMobileView ? '30px' : '60px'}
              />
              <div className={`${classes.imageOverlay} delete-overlay`}>
                <IconButton onClick={() => onImageRemove(index)} size="small">
                  <DeleteForever />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
};

export default ImageUpload;
