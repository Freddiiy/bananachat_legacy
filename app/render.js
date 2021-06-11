const connect = document.getElementById('ipinput');
const checkbox = document.getElementById('checkbox');

const nameInput = document.getElementById('nameInput');
const textinput = document.getElementById('textInput');
const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');

var HOST = 'wss://localhost.com:6969';
var firstRun = true;
var ws = new WebSocket(HOST);

console.log("Started");

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


//send message
function sendMessage() {
    let username = nameInput.value;
    let userInput = textinput.value;

    if (userInput !== "") {
        if(username == "") {
            username = "anon";
        }
        let tmp = `<div class="sent-msg"> <p class="current-msg">${userInput}</p> </div>`;
        chatarea.insertAdjacentHTML("beforeend", tmp);
        
        let dataArray = [username, userInput];
        let jsonData= JSON.stringify(dataArray);
        ws.send(jsonData);
    }
    textinput.value = "";
}

function sendEnter() {
    if (event.keyCode === 13) {
        sendMessage();
    }
}

//recieve
function recieveMessage() {
    ws.onmessage = ({ data }) => {
        let dataArray = JSON.parse(data);
        let username = dataArray[0];
        let userInput = dataArray[1];
        let tmp = `<span class="username">${username}</span><div class="recieved-msg"><p class="current-msg">${userInput}</p> </div>`;
        chatarea.insertAdjacentHTML("beforeend", tmp);
    };
}