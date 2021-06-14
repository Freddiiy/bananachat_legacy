const checkbox = document.getElementById('checkbox');

const nameInput = document.getElementById('nameInput');
const textinput = document.getElementById('textInput');
const fileSelector = document.getElementById('file-selector');
const imgPreview = document.getElementById('img-preview-window');

const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');

const url = window.location.href;
var HOST = url.replace(/(http)(s)?\:\/\//, "ws$2://");
var firstRun = true;
var ws = new WebSocket(HOST);
var imageNum = 0;
var connected = false;

console.log("Started");

fileSelector.addEventListener('change', imagePreview);
textinput.addEventListener('keydown', sendEnter);
sendButton.addEventListener('click', sendMessage);

function sendMessage() {
    let username = nameInput.value;
    let userInput = textinput.value;

    if (userInput !== "") {
        if(username == "") {
            username = "anon";
        }
        if(userInput !== "") {
            let tmp = `<div class="sent-msg"> <p class="current-msg">${userInput}</p> </div>`;
            chatarea.insertAdjacentHTML("beforeend", tmp);
        
            let dataArray = ["message", username, userInput];
            let jsonData= JSON.stringify(dataArray);
            ws.send(jsonData);
        }
    }

    if (fileSelector.value !== "") {
        console.log("send image");
        sendImage();
    }

    textinput.value = "";
    fileSelector.value = null;
}

function imagePreview() {
    while(imgPreview.firstChild) {
        imgPreview.removeChild(imgPreview.firstChild);
    }

    let imgFile = document.getElementById("file-selector").files[0];
    let fileReader = new FileReader();
    fileReader.onload = function (e){
        let img = document.createElement("img");
        img.id = "img-preview";
        img.src = e.target.result;
        imgPreview.appendChild(img)
    }
    fileReader.readAsDataURL(imgFile);

    textinput.focus();
}

function sendImage() {
    while(imgPreview.firstChild) {
        imgPreview.removeChild(imgPreview.firstChild);
    }

    let username = nameInput.value;
    if(username == "") {
        username = "anon";
    }

    let tmp = `<div class="sent-img"><div class="current-img" id="imageNum-${imageNum}"></div></div>`;
    chatarea.insertAdjacentHTML("beforeend", tmp);
    var imgElement = document.getElementById("imageNum-" + imageNum);

    let imgFile = document.getElementById("file-selector").files[0];
    let fileReader = new FileReader();
    var rawFile = new ArrayBuffer();
    fileReader.onload = function (e){
        let img = document.createElement("img");

        img.src = e.target.result;
        imgElement.appendChild(img);

        rawFile = e.target.result;

        let dataArray = ["file", username, rawFile];
        let jsonData = JSON.stringify(dataArray)
        ws.send(jsonData)
    }
    fileReader.readAsDataURL(imgFile);
    imageNum++;
}

function sendEnter() {
    if (event.keyCode === 13) {
        sendMessage();
    }
}

recieveMessage();
function recieveMessage() {
    ws.onmessage = ({ data }) => {
        let dataArray = JSON.parse(data);
        if (dataArray[0] == "message") {
            let username = dataArray[1];
            let userInput = dataArray[2];
            let tmp = `<span class="username">${username}</span><div class="recieved-msg"><p class="current-msg">${userInput}</p> </div>`;
            chatarea.insertAdjacentHTML("beforeend", tmp);

        } else if (dataArray[0] == "file") {
            let username = dataArray[1];
            let rawData = dataArray[2];

            let tmp = `<span class="username">${username}</span><div class="recieved-img"><div class="current-img" id="imageNum-${imageNum}"></div>`;
            chatarea.insertAdjacentHTML("beforeend", tmp);

            let img = document.createElement("img");
            img.src = rawData;
            var imgElement = document.getElementById("imageNum-" + imageNum);
            imgElement.appendChild(img);
        }
        imageNum++;
    };
}

ws.onopen = () => {
    console.log("Connection established...");
    let tmp = `<div class="connected"> <p class="current-msg">You are connected.</p> </div>`;
    chatarea.insertAdjacentHTML("beforeend", tmp);
}

ws.onclose = () => {
    console.log("Connection disconnected...");
    let tmp = `<div class="connected"> <p class="current-msg">You have been disconnected.</p> </div>`;
    chatarea.insertAdjacentHTML("beforeend", tmp);
}