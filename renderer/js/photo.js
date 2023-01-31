const fs = require('fs');

const video = document.getElementById('video');
const template = document.getElementById('template');
const isTime = document.getElementById('is-time');
const img = document.getElementById('img');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('group-btn-preview');
const text_preview = document.getElementById('footer-is-intime');

const urlTemplate = 'images/6CONTEO/MARCO' + localStorage.getItem('template') + '.png'; 

const constraints = {
    audio: false,
    video: {
        facingMode: "user",
        frameRate: { min: 15, ideal: 24, max: 30 },
        width: { min: 450, ideal: 450, max: 1080 },
        height: { min: 625, ideal: 625, max: 1920 }
    }
};

const init = async () => {
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
    video.srcObject = stream;
    readyOn();
}

const onScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.getContext('2d').drawImage(template,  0, 0, video.videoWidth, video.videoHeight);
    img.src = canvas.toDataURL('image/png', 1.0);
    done();
}

const count = () => {
    console.log("count");
    var l = document.getElementById("number");
    
    var n = 4;
    const interval = setInterval(() => {
        l.innerHTML = n;
        n--;
        if (n < 0) {
            clearInterval(interval);
            l.style.display = 'block';
            onScreenshot();
        }
    }, 1000);
}
    
const waitOn = () => {
    isTime.style.display = 'none';
    preview.style.display = 'none';
}

function readyOn() {
    img.style.display = 'none'
    isTime.style.display = 'block';
    preview.style.display = 'none';
    count();
}

function done() {
    img.style.display = 'block'
    isTime.style.display = 'none';
    preview.style.display = 'flex';
    text_preview.style.display = 'none';
}

function saveCallback() {
    // Get the DataUrl from the Canvas
    const url = canvas.toDataURL('image/jpg', 1.0);

    // remove Base64 stuff from the Image
    const base64Data = url.replace(/^data:image\/png;base64,/, "");

    var filePath = `/${getNewImgFileName()}`;

    fs.writeFile(filePath, base64Data, 'base64', () => {
        location.href = "form.html";  
    });
}

function getNewImgFileName() {
    const dt = new Date();
    return`img_${dt.getFullYear()}${dt.getMonth() + 1}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}${dt.getMilliseconds()}.png`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Load init
    init();
    template.src = urlTemplate;
})