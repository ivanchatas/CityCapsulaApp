let localStream;
let recorder;
const fs = require('fs');

const video = document.getElementById('video');
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

const loaderMsg = document.getElementById('loader-msg');
const btnRecording = document.getElementById('btn-recording');

const titlePreview = document.getElementById('title-preview-rec');
const preview = document.getElementById('preview-rec');
const btnPreview = document.getElementById("btn-preview-rec");

const again = document.getElementById("again");
const btnSave = document.getElementById("guardar");

let fileName;
let storageStream;

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
        waitOn();
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (e) {
        console.log(`navigator.getUserMedia error:${e.toString()}`);
    }
}

function handleSuccess(stream) {
    window.stream = stream;
    localStream = stream;
    video.srcObject = stream;

    fileName = getNewVideoFileName();
    recorder = new MediaRecorder(localStream);
    storageStream = fs.createWriteStream(`${__dirname}/videos/${fileName}`);
    recorder.ondataavailable = async e => {
        storageStream.write(Buffer.from(await e.data.arrayBuffer()), (err) => {
            if (err) {
                console.log(err.message);
            }
        });
        previewSavedVideo();
    };
    readyOn();
}

startButton.onclick = function () {
    recordingOn();
    recorder.start();
};

stopButton.addEventListener("click", async () => {
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    recorder.requestData();
    recorder.stop();
});

again.addEventListener("click", async () => {
    location.href = "form.html";
});

function getNewVideoFileName() {
    const dt = new Date();
    return`rec_${dt.getFullYear()}${dt.getMonth() + 1}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}${dt.getMilliseconds()}.webm`;
}

function previewSavedVideo() {
    preview.src = `videos/${fileName}`;
    previewOn();
}

function remove(path) {
    if (existsSycn(path)) {
        unlink(path, (err) => {
            if (err) return;
        });
    }
}

function recordingOn() {
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
}

function waitOn() {
    loaderMsg.style.display = "block";

    titlePreview.style.display = "none";
    preview.style.display = "none";
    btnPreview.style.display = "none";

    video.style.display = "none";
    btnRecording.style.display = "none";
}

function readyOn() {
    loaderMsg.style.display = "none";

    titlePreview.style.display = "none";
    preview.style.display = "none";
    btnPreview.style.display = "none";

    video.style.display = "block";
    btnRecording.style.display = "block";
}

function previewOn() {
    loaderMsg.style.display = "none";

    titlePreview.style.display = "block";
    preview.style.display = "block";
    btnPreview.style.display = "block";

    video.style.display = "none";
    btnRecording.style.display = "none";
}

stopButton.style.display = 'none';
init();