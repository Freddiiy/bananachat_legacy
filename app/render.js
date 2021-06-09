const nameInput = document.getElementById('nameInput');
const textinput = document.getElementById('textInput');
const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');


const connect = 'localhost:6969';

const ws = new WebSocket('ws://' + connect);


console.log("Started");

sendButton.addEventListener('click', sendMessage);
//send message
function sendMessage() {
    let username = nameInput.value;
    let userInput = textinput.value;

    if (userInput !== "") {
        let tmp = `<div class="output-msg"> <span class="current-msg">${"me: "+ userInput}</span></div>`;
        chatarea.insertAdjacentHTML("beforeend", tmp);
        ws.send(username + ": " + userInput);
    }

    textinput.value = "";
}

//recieve
ws.onmessage = ({ data }) => {
    let serverInput = data;
    let tmp = `<div class="input-msg"> <span class="current-msg">${serverInput}</span></div>`;
    chatarea.insertAdjacentHTML("beforeend", tmp);
};


