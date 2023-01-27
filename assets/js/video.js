const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const errorMsgElement = document.querySelector('span#errorMsg');
const preview = 0;

const constraints = {
    audio: true,
    video: {
        facingMode: "user",
        width: { min: 450, ideal: 450, max: 1080 },
        height: { min: 625, ideal: 625, max: 1920 } 
    }
};

const parts = [];
let mediaRecorder;

// Access webcam
async function init() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}
        
// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}


// Draw image
//var context = canvas.getContext('2d');
startButton.addEventListener("click", function() {
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    mediaRecorder = new MediaRecorder(video.srcObject);
    mediaRecorder.start(1000);
    mediaRecorder.ondataavailable = function (e) {
        parts.push(e.data);
    }
    //context.drawImage(video, 0, 0, 640, 480);
});

stopButton.addEventListener("click", function() {
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    
    mediaRecorder.stop();
    let blob = new Blob(parts, {
        type: "video/mp4"
    });
    //let url = URL.createObjectURL(blob);
    /*let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = "test.mp4";
    a.click();*/
    //localStorage.setItem('video', url);
    saveAs(blob, "download.mp4");
    location.href = "preview.html";
});
     
stopButton.style.display = 'none';
init();