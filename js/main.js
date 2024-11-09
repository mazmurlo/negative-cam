const videoElement = document.getElementById("videoElement");
const switchButton = document.getElementById("switchButton");

let videoDevices = []; // Array to store video devices
let currentVideoIndex = 0; // Current video device index

// Function to get all video sources
async function getVideoDevices() {
    try {
        // Check if enumerateDevices is supported
        if (!navigator.mediaDevices?.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
            return;
        }

        // Get list of all devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Filter only video input devices (cameras)
        videoDevices = devices.filter(device => device.kind === "videoinput");

        // Start the first video device
        if (videoDevices.length > 0) {
            startStream(videoDevices[currentVideoIndex].deviceId);
        } else {
            console.log("No video devices found.");
        }
    } catch (err) {
        console.error(`${err.name}: ${err.message}`);
    }
}

// Function to start a video stream with a specific deviceId
async function startStream(deviceId) {
    const constraints = {
        video: { deviceId: { exact: deviceId } }
    };

    try {
        // Get media stream for the specified device
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
    } catch (err) {
        console.error(`Error accessing video stream: ${err.message}`);
    }
}

// Function to switch to the next video device
function switchCamera() {
    // Stop current video stream
    const stream = videoElement.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    // Update currentVideoIndex to the next device, loop back if at the end
    currentVideoIndex = (currentVideoIndex + 1) % videoDevices.length;

    // Start the new video device
    startStream(videoDevices[currentVideoIndex].deviceId);
}

// Event listener for the switch button
switchButton.addEventListener("click", switchCamera);

// Initialize video devices on page load
getVideoDevices();