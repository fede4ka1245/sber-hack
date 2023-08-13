export const capturePhotoFromVideo = (video, time) => {
  let canvas = document.createElement('canvas');

  return new Promise((resolve) => {
    const seeked = () => {
      canvas.width = video.width;
      canvas.height = video.height;

      let ctx = canvas.getContext('2d');
      ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

      video.removeEventListener('seeked', seeked);
      resolve(canvas.toDataURL('image/jpeg'));
    }

    video.addEventListener('seeked', seeked);
    video.currentTime = time;
  })
}