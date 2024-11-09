let videoElement = document.querySelector('video');
let switchButton = document.querySelector('button');
let currentStream;
let deviceIndex = 0;
let devices = [];

async function getStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    const constraints = {
      video: {
        deviceId: devices[deviceIndex].deviceId ? { exact: devices[deviceIndex].deviceId } : undefined
      }
    };

    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = currentStream;
  } catch (err) {
    console.error('Error accessing media devices.', err);
  }
}

async function initDevices() {
  try {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    devices = allDevices.filter(device => device.kind === 'videoinput');

    console.log(devices); // Check available devices

    if (devices.length > 0) {
      getStream();
    } else {
      console.log('No video input devices found.');
    }
  } catch (err) {
    console.error('Error listing devices:', err);
  }
}

switchButton.addEventListener('click', () => {
  if (devices.length > 1) {
    deviceIndex = (deviceIndex + 1) % devices.length;
    console.log(`Switching to device: ${devices[deviceIndex].label}`);
    getStream();
  } else {
    console.log('Only one camera detected.');
  }
});

initDevices();
