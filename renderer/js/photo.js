const video = document.getElementById('video');
const template = document.getElementById('template');
const isTime = document.getElementById('is-time');
const photo = document.getElementById('photo');
const canvas = document.getElementById('canvas');

photo.style.display = 'none';

const constraints = {
    audio: false,
    video: {
        facingMode: "user",
        width: { min: 450, ideal: 450, max: 1080 },
        height: { min: 625, ideal: 625, max: 1920 } 
    }
};

// Access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
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

//imagen que subimos a continuación
function getImage (url) {
    var img = new Image();
    img.onload = draw;
    img.onerror = failed;
    img.src = url;  
};

function draw() {
    var ctx = canvas.getContext('2d');
    ctx.globalAlpha = 0.5;
    ctx.drawImage(this, 0, 0, 550, 550, 0, 0, 600, 500);
    ctx.globalAlpha = 1; // dejamos la opacidad al 100% de nuevo
    //he dejado de adaptar el tamaño del canvas a la nueva imagen
}

function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
}

function getCount() {
    let isPhoto = false;
    var n = 4;
    var l = document.getElementById("number");
    window.setInterval(function() {
        l.innerHTML = n;
        n--;
        if(n < 0 && !isPhoto) {
            // Draw image
            photo.style = 'display:block;';
            isTime.style.display = 'none';
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            let image_data_url = canvas.toDataURL('image/jpeg');
            photo.src = image_data_url;
            // data url of the image
            console.log(image_data_url);
            isPhoto = true;
        }
    }, 1000);
}

// Load init
const urlTemplate = 'images/6CONTEO/MARCO' + localStorage.getItem('template') + '.png'; 
init();
template.src = urlTemplate;
getCount();