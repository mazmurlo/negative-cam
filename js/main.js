let videoElement = document.querySelector('video');
let switchButton = document.querySelector('button');
let currentStream;
let deviceIndex = 0;
let devices = [];

async function getStream() {
    try {
      const constraints = {
        video: {
          deviceId: devices[deviceIndex] ? { exact: devices[deviceIndex].deviceId } : undefined
        }
      };
  
      if (currentStream && currentStream.getVideoTracks().length > 0) {
        // Try to switch camera by applying new constraints to the existing video track
        const [videoTrack] = currentStream.getVideoTracks();
        await videoTrack.applyConstraints(constraints.video);
        console.log("Switched to device:", devices[deviceIndex].label);
      } else {
        // If no stream is available, request a new one
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = currentStream;
        console.log("Streaming from device:", devices[deviceIndex].label);
      }
    } catch (err) {
      console.error("Error switching media devices:", err);
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
      console.log("Switching to device index:", deviceIndex);
      getStream();
    } else {
      console.log("Only one device detected.");
    }
  });

initDevices();
