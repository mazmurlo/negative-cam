var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');

videoSelect.onchange = getStream;

getTheStream().then(getTheDevices).then(haveDevices);

function getTheDevices() {
    return navigator.mediaDevices.enumerateDevices();
  }

function getTheStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

