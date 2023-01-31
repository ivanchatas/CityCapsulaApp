const fs = require('fs');

const video = document.getElementById('video');
const title = document.getElementById('title');
const loaderMsg = document.getElementById('loader-msg');

let mediaRecorder;
let chunk = [];

const constraints = {
    audio: true,
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
        startWebcam(stream);
    } catch (err) {
        console.log('Error retrieving a media device.');
        console.log(err);
    }
}

function startWebcam(stream) {
    window.stream = stream;
    video.srcObject = stream;
    readyOn();
    startRecording();
}

function startRecording() {
    if (video.srcObject === null) {
        video.srcObject = window.stream;
    }
    mediaRecorder = new MediaRecorder(window.stream, { mimeType: 'video/webm;codecs=vp9,opus' });
    mediaRecorder.start();
    mediaRecorder.ondataavailable = recordVideo;
}

async function recordVideo(event) {
    if (event.data && event.data.size > 0) {
        video.srcObject = null;
        chunk = event.data;
        let videoUrl = URL.createObjectURL(event.data);
        video.src = videoUrl;
        saveVideo();
    }
}

function stopRecording() {
    mediaRecorder.stop();
}

async function saveVideo() {
    console.log("grabando video");
    console.log(chunk);
    let buffer = Buffer.from(await chunk.arrayBuffer());
    let fileName = `/${getNewVideoFileName()}`;
    let fr = new FileReader();
    fr.onload = async _ => {
        fs.writeFile(fileName, buffer, () => {
            console.log("Se ha guardado");
            location.href = "form.html";  
        });
    }
    fr.readAsArrayBuffer(chunk);
}

function getNewVideoFileName() {
    const dt = new Date();
    return`rec_${dt.getFullYear()}${dt.getMonth() + 1}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}${dt.getMilliseconds()}.webm`;
}

function waitOn() {
    loaderMsg.style.display = "block";
    title.style.display = "none";
}

function readyOn() {
    loaderMsg.style.display = "none";
    title.style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
    waitOn();
    init();
    setTimeout(() => {
        stopRecording();
    }, 16000);
})
