const connect = document.getElementById('ipinput');
const checkbox = document.getElementById('checkbox');

const nameInput = document.getElementById('nameInput');
const textinput = document.getElementById('textInput');
const fileSelector = document.getElementById('file-selector');
const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');

var HOST = 'wss://localhost.com:6969';
var firstRun = true;
var ws = new WebSocket(HOST);
var imageNum = 0;

console.log("Started");

fileSelector.addEventListener('change', sendImage);
textinput.addEventListener('keydown', sendEnter);
sendButton.addEventListener('click', sendMessage);

connect.addEventListener('keydown', connectToWS);
function connectToWS() {
    if (event.keyCode === 13) {
        console.log(firstRun);
        if (!firstRun) {
            ws.close();
        }
        firstRun = false;

        ws.onclose = () => {
            console.log("Connection disconnected...");
            let tmp = `<div class="connected"> <p class="current-msg">You have been disconnected.</p> </div>`;
            chatarea.insertAdjacentHTML("beforeend", tmp);
        }
        if (connect.value !== "") {
            if (checkbox.checked) {
                ws = new WebSocket('wss://' + connect.value);
            } else if (!checkbox.checked) {
                ws = new WebSocket('ws://' + connect.value);
            }
        }
        console.log("Connecting to " + connect.value + "...");
        ws.onopen = () => {
            console.log("Connection established...");
            let tmp = `<div class="connected"> <p class="current-msg">You are connected.</p> </div>`;
            chatarea.insertAdjacentHTML("beforeend", tmp);
        }
        recieveMessage();
    }
}

function sendMessage() {
    let username = nameInput.value;
    let userInput = textinput.value;

    if (userInput !== "") {
        if(username == "") {
            username = "anon";
        }
        let tmp = `<div class="sent-msg"> <p class="current-msg">${userInput}</p> </div>`;
        chatarea.insertAdjacentHTML("beforeend", tmp);
        
        let dataArray = ["message", username, userInput];
        let jsonData= JSON.stringify(dataArray);
        ws.send(jsonData);

        if (fileSelector.value !== "") {
            sendImage();
            console.log("send image");
        }
    }

    textinput.value = "";
    fileSelector.value = "";
}

function sendImage() {
    let username = nameInput.value;
    if(username == "") {
        username = "anon";
    }

    let tmp = `<div class="sent-img"><div id="imageNum-${imageNum}"></div></div>`;
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
;
    imageNum++;
}

function sendEnter() {
    if (event.keyCode === 13) {
        sendMessage();
    }
}

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

            let tmp = `<span class="username">${username}</span><div class="recieved-img"><div id="imageNum-${imageNum}"></div>`;
            chatarea.insertAdjacentHTML("beforeend", tmp);

            let img = document.createElement("img");
            img.src = rawData;
            var imgElement = document.getElementById("imageNum-" + imageNum);
            imgElement.appendChild(img);
        }
        imageNum++;
    };
}
