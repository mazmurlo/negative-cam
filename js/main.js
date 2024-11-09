let videoElement = document.querySelector('video');
let switchButton = document.querySelector('button');
let currentStream;
let deviceIndex = 0;
let devices = [];

// Function to get and display the video stream
async function getStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    // Set up constraints with the selected device ID
    const constraints = {
      video: {
        deviceId: devices[deviceIndex].deviceId ? { exact: devices[deviceIndex].deviceId } : undefined
      }
    };

    // Request the stream with the constraints
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = currentStream;
  } catch (err) {
    console.error('Error accessing media devices.', err);
  }
}

// Function to initialize video devices and get the first stream
async function initDevices() {
  try {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    devices = allDevices.filter(device => device.kind === 'videoinput');

    if (devices.length > 0) {
      getStream();
    } else {
      console.log('No video input devices found.');
    }
  } catch (err) {
    console.error('Error listing devices:', err);
  }
}

// Event listener to switch video devices
switchButton.addEventListener('click', () => {
  if (devices.length > 1) {
    deviceIndex = (deviceIndex + 1) % devices.length;
    getStream();
  }
});

// Initialize the devices on page load
initDevices();