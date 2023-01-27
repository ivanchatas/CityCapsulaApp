let localStream;
let recorder;
let recordChunk
const fs = require('fs');

const video = document.getElementById('video');
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const btnRecording = document.getElementById('btn-recording');

const titlePreview = document.getElementById('title-preview-rec');
const preview = document.getElementById('preview-rec');
const btnPreview = document.getElementById("btn-preview-rec");

const again = document.getElementById("again");
const btnSave = document.getElementById("guardar");

const constraints = {
    audio: false,
    video: {
        facingMode: "user",
        frameRate: { min: 15, ideal: 24, max: 30 },
        width: { min: 450, ideal: 450, max: 1080 },
        height: { min: 625, ideal: 625, max: 1920 } 
    }
};

async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.log(`navigator.getUserMedia error:${e.toString()}`);
    }
}
  
// Success
function handleSuccess(stream) {
    window.stream = stream;
    localStream = stream;
    video.srcObject = stream;
}

recordOn();

startButton.onclick = function() {
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    recorder = new MediaRecorder(localStream);
    recorder.ondataavailable = e => {
        recordChunk.push(e.data);
    };
    recordChunk = [];
    recorder.start();
};

let path;
stopButton.addEventListener("click", async () => {
    startButton.style.display = 'block';
    stopButton.style.display = 'none';

    recorder.stop();

    const blob = new Blob(recordChunk, {
        type: 'video/webm'
    });
    let url = URL.createObjectURL(blob); 
    preview.src = url;

    ///dlLink.download = `rec_${[dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()].map(val => ('0' + val).slice(-2))}.webm`;
    //previewOn();
});

again.addEventListener("click", async () => {
    //remove(path);
    location.href = "form.html";
});


btnSave.onclick = _ => {
    const blob = new Blob(recordChunk);
    let fr = new FileReader();
    fr.onload = _ => {
        Save(fr.result);
    }
    fr.readAsArrayBuffer(blob);
}

function Save(arrayBuffer) {
    let buffer = new Buffer(arrayBuffer);
    let dt = new Date();
    let fileName = `C:/rec_${dt.getFullYear()}${dt.getMonth() + 1}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}${dt.getMilliseconds()}.webm`;
    fs.writeFile(fileName, buffer, function(err) {
        if (err) {
            alert("An error ocurred creating the file " + err.message);
        }
        else {
            location.href = "form.html";
        }
    });
}

function remove(path) { 
    if (fs.existsSycn(path)) {
        fs.unlink(path, (err) => {
            if (err) return;
        });
    }
}

function recordOn () {
    console.log(titlePreview);
    titlePreview.style.display = "none";
    preview.style.display = "none";
    btnPreview.style.display = "none";

    video.style.display = "block";
    btnRecording.style.display = "block";
}

function previewOn () {
    titlePreview.style.display = "block";
    preview.style.display = "block";
    btnPreview.style.display = "block";

    video.style.display = "none";
    btnRecording.style.display = "none";
}

stopButton.style.display = 'none';
init();