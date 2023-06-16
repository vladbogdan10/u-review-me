import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Add, Refresh } from '@material-ui/icons';
import { toSvg } from 'jdenticon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { nanoid } from 'nanoid';
import { Backdrop, Button, Paper, Slider, Tooltip } from '@material-ui/core';
import AvatarEditor from 'react-avatar-editor';
import Resizer from 'react-image-file-resizer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      background: 'white',
      alignSelf: 'center',
      width: '70px',
      height: '70px',
    },
    buttons: {
      marginTop: theme.spacing(1),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
    uploader: {
      padding: theme.spacing(2),
      boxShadow: '0px 0px 20px 5px rgb(0 0 0 / 25%)',
      zIndex: 2001,
    },
    uploaderButtons: {
      display: 'flex',

      '& > button:first-child': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

interface UserAvatarProps {
  src: string;
  alt: string;
  setAvatar: (image: string) => void;
  className?: string;
  showOptions?: boolean;
}

const UserAvatar = (props: UserAvatarProps) => {
  const classes = useStyles();

  const [inputImage, setInputImage] = useState<string | File>('');
  const [openUploader, setOpenUploader] = useState(false);
  const [zoomValue, setZoomValue] = useState<number>(2);

  const avatarEditor = useRef<AvatarEditor | null>(null);
  const uploadImageInputRef = useRef(null);

  const handleAvatarGenerator = () => {
    const randomString = nanoid(6);
    const svgString = toSvg(randomString, 100);

    props.setAvatar(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
  };

  useEffect(() => {
    if (!props.src) {
      handleAvatarGenerator();
    }
  }, []);

  useEffect(() => {
    if (!props.showOptions) {
      handleCancel();
    }
  }, [props.showOptions]);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setInputImage(files[0]);
      setOpenUploader(true);
    }
  };

  const handleZoomChange = (event: any, newValue: number | number[]) => {
    setZoomValue(newValue as number);
  };

  const handleDone = async () => {
    if (avatarEditor.current) {
      const editor = avatarEditor.current;
      const canvas = editor.getImage().toDataURL();

      const result = await fetch(canvas);
      const blob = await result.blob();

      const base64Image = (await resizeImageFile(blob)) as string;

      props.setAvatar(base64Image);
      setOpenUploader(false);
      cleanFileInput();
    }
  };

  const resizeImageFile = (file: Blob) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        250,
        250,
        'JPEG',
        70,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

  const handleCancel = () => {
    props.setAvatar(props.src);
    setInputImage('');
    setOpenUploader(false);
    cleanFileInput();
  };

  const cleanFileInput = () => {
    if (uploadImageInputRef.current) {
      // @ts-ignore
      uploadImageInputRef.current.value = '';
    }
  };

  return (
    <>
      {openUploader && (
        <Backdrop open={openUploader} className={classes.backdrop}>
          <Paper variant="outlined" className={classes.uploader}>
            <AvatarEditor
              ref={avatarEditor}
              image={inputImage}
              width={250}
              height={250}
              border={20}
              borderRadius={150}
              color={[0, 0, 0, 0.6]}
              scale={zoomValue}
              rotate={0}
            />
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={zoomValue}
              onChange={handleZoomChange}
              aria-labelledby="avatar-zoom"
            />
            <div className={classes.uploaderButtons}>
              <Button
                variant="contained"
                size="small"
                color="primary"
                fullWidth
                onClick={handleDone}
              >
                done
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                fullWidth
                onClick={handleCancel}
              >
                cancel
              </Button>
            </div>
          </Paper>
        </Backdrop>
      )}
      <div className={classes.root}>
        <Avatar
          src={props.src}
          alt="User avatar"
          className={`${classes.avatar} ${props.className}`}
        />
        {props.showOptions && (
          <div className={classes.buttons}>
            <Tooltip disableFocusListener title="Add avatar">
              <IconButton component="label" size="small">
                <Add />
                <input
                  ref={uploadImageInputRef}
                  type="file"
                  accept="image/*"
                  name="uploadAvatar"
                  onChange={(event) => handleUpload(event)}
                  hidden
                />
              </IconButton>
            </Tooltip>
            <Tooltip disableFocusListener title="Refresh avatar">
              <IconButton size="small" onClick={() => handleAvatarGenerator()}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default UserAvatar;
