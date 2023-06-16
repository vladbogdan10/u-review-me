export default function buildAvatarUrl(image: string) {
  if (image.startsWith('avt-')) {
    return `${process.env.NEXT_PUBLIC_S3_ASSETS_PATH}/avatars/${image}.jpeg`;
  }

  return image;
}
