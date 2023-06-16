import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { ImageType } from '../../types/types';
import CollectionsIcon from '@material-ui/icons/Collections';
import Image from 'next/image';

const useStyles = makeStyles((theme: Theme) => ({
  imageContainer: {
    paddingBottom: '56.25%',
    position: 'relative',
    backgroundColor: 'black',
  },
  image: {
    cursor: 'zoom-in',
  },
  multipleImagesIndicator: {
    padding: '1.5px',
    position: 'absolute',
    zIndex: 1,
    top: '14px',
    right: '14px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    fontSize: 0,
    borderRadius: theme.shape.borderRadius,
  },
  zoomImage: {
    position: 'fixed',
    zIndex: 10000000,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backdropFilter: 'blur(10px)',
    background: 'rgb(0 0 0 / 70%)',

    '& > img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      cursor: 'zoom-out',
      padding: theme.spacing(1),
    },
  },
  carouselIndicator: {
    position: 'absolute',
    bottom: 8,
    marginTop: 0,
  },
}));

interface ImageCarouselProps {
  images: ImageType[];
  isFeed: boolean;
  altPrefix: string;
  isFullSizedPost?: boolean;
}

const ImageCarousel = (props: ImageCarouselProps) => {
  const classes = useStyles();
  const showNavIndicators = props.images.length > 1 && !props.isFeed;

  const zoomImageInitalState = {
    imagePath: '',
    isZoomed: false,
  };
  const [zoomImage, setZoomImage] = useState(zoomImageInitalState);

  useEffect(() => {
    if (zoomImage.isZoomed) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.removeProperty('overflow');
    }
  }, [zoomImage.isZoomed]);

  const zoomImageHandle = (imagePath: string) => {
    if (props.isFullSizedPost) {
      setZoomImage({
        imagePath: imagePath,
        isZoomed: true,
      });
    }
  };

  const closeZoomImageHandle = () => {
    setZoomImage(zoomImageInitalState);
  };

  return (
    <>
      {props.isFullSizedPost && zoomImage.isZoomed && zoomImage.imagePath && (
        <div className={classes.zoomImage}>
          <img
            src={zoomImage.imagePath}
            alt=""
            onClick={closeZoomImageHandle}
          />
        </div>
      )}
      <Carousel
        autoPlay={false}
        timeout={0}
        animation="slide"
        indicators={showNavIndicators}
        navButtonsAlwaysInvisible={!showNavIndicators}
        indicatorContainerProps={{
          className: classes.carouselIndicator,
        }}
      >
        {props.images.map((image) => (
          <div className={classes.imageContainer} key={image.identifier}>
            {props.isFeed && props.images.length > 1 && (
              <div className={classes.multipleImagesIndicator}>
                <CollectionsIcon />
              </div>
            )}
            <Image
              className={props.isFullSizedPost ? classes.image : ''}
              src={`${process.env.NEXT_PUBLIC_S3_ASSETS_PATH}/images/${image.identifier}-1200.jpeg`}
              alt={`${props.altPrefix} - ${image.alt}`}
              layout="fill"
              objectFit="cover"
              unoptimized={true}
              priority={props.isFullSizedPost}
              onClick={() =>
                zoomImageHandle(
                  `${process.env.NEXT_PUBLIC_S3_ASSETS_PATH}/images/${image.identifier}.jpeg`
                )
              }
            />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default ImageCarousel;
