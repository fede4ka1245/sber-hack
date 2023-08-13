export const getStamps = async (url) => {
  const mediaBlob = await fetch(url)
    .then(response => response.blob());

  const myFile = new File(
    [mediaBlob],
    "demo.mp4",
    { type: 'video/mp4' }
  );

  const formdata = new FormData();
  formdata.append("video", myFile, "file.mp4");

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  return fetch("http://0.0.0.0:6767/api/surdo_video", requestOptions)
    .then(response => response.json())
}