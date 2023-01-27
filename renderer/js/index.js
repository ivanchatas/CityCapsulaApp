function buttonTermsAndConditions(url) {
    localStorage.setItem('capture', url);
    location.href = "terms_and_conditions.html";
}

function redirectCapture() {
    var url = localStorage.getItem('capture');
    location.href = url;
}

function selectTemplate(template) {
    localStorage.setItem('template', template);
    location.href = "capture.html";
}