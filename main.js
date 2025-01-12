let textCounter = 1;
let text = [""];
let language = "en-US";

let firstTime = true;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const textElement = document.getElementById('text');

function loadText() {
    let textInput = window.prompt("Enter the text to load");
    if (textInput === "" || textInput === null || textInput === undefined) {
        text = `Create your own magnificent brainrot videos here ...`.split(" ");
    } else {
        text = textInput.split(" ");
    }
}

function drawPlayButton() { /* Nicked off other code */
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'green';
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2 - 15, canvas.height / 2 - 20);
    context.lineTo(canvas.width / 2 + 15, canvas.height / 2);
    context.lineTo(canvas.width / 2 - 15, canvas.height / 2 + 20);
    context.closePath();
    context.fill();
}

function calculateEstimate(textInput) {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    const lengthChars = [",", ".", " "]
    let vowelCount = 0;
    let charCount = 0;
    
    for (let char of textInput.toLowerCase()) {
        console.log(char);
        if (vowels.includes(char)) {
            vowelCount++;
        } 
        if (lengthChars.includes(char)) {
            charCount++;
        } 
    }

    const roughEstimate = (textInput.length * 80) + (vowelCount * 120);
    const estimatedTime = roughEstimate > 550 ? roughEstimate : 500;
    return estimatedTime + (charCount * 200);
}

function parseAndRender(textInput) {
    // Needs implementation but will be used for parsing text
    renderText(textInput.replace(".", "dot"));
}

function renderText(textInput) {
    textElement.style.transition = 'none';
    textElement.style.transform = 'scale(0)';
    textElement.style.opacity = '0';
    
    textElement.innerHTML = textInput;

    textElement.style.display = 'block';
    textElement.style.top = `${(window.innerHeight - textElement.offsetHeight) / 2}px`;
    textElement.style.left = `${(window.innerWidth - textElement.offsetWidth) / 2}px`;

    if ('speechSynthesis' in window) speakText(textInput);
    setTimeout(function() {
        textElement.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        textElement.style.transform = 'scale(1)';
        textElement.style.opacity = '1';
    }, 10);
}

video.addEventListener('play', function() {
    setTimeout(function() {
        parseAndRender(text[0]);
    }, 1000);

    function renderFrame() {
        if (!video.paused && !video.ended) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(renderFrame);
        }
    }

    renderFrame();
});

video.addEventListener('ended', function() {
    video.currentTime = 0;
    video.play();
});

let currentUtterance = null;
function speakText(text) {
    if (currentUtterance !== null) {
        window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    utterance.lang = language;
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.onend = function(utterance) {
        if (currentUtterance === event.utterance) {
            currentUtterance = null;
        }
    };

    const estimatedTime = calculateEstimate(text);
    console.log(estimatedTime);

    setTimeout(() => {
        const eventFinish = new Event('speechFinished');
        window.dispatchEvent(eventFinish);
    }, estimatedTime);

    window.speechSynthesis.speak(utterance);
}

canvas.addEventListener('click', function() {
    if (video.paused && firstTime) {
        video.play();
    }
});

window.onload = function() {
    loadText();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    drawPlayButton();
};

window.addEventListener('speechFinished', function() {
    if (text.length > textCounter) {
        console.log(text[textCounter]);
        renderText(text[textCounter]);
        textCounter++;
    } else {
        renderText("");
    };
});