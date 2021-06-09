const textinput = document.getElementById('textinput');
const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');

const ws = new WebSocket('ws://localhost:6969');


console.log("Started");

sendButton.addEventListener('click', sendMessage);
function sendMessage() {
    let userInput = textinput.value;
    console.log(userInput);

    //let tmp = `<div class="output-msg> <span class="current-msg>${userInput}</span></div>`;
    //chatarea.insertAdjacentHTML("beforeend", tmp);

    ws.send(userInput);

    textinput.value = "";
}

ws.onmessage = ({ data }) => {
    let serverInput = data;
    console.log("ws in: ", serverInput);
    let tmp = `<div class="input-msg> <span class="current-msg>${serverInput}</span></div>`;
    chatarea.insertAdjacentHTML("beforeend", tmp);
};


