const nameInput = document.getElementById('nameInput');
const textinput = document.getElementById('textInput');
const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');


const connect = 'localhost:6969';

const ws = new WebSocket('ws://' + connect);


console.log("Started");

textinput.addEventListener('keydown', sendEnter);
sendButton.addEventListener('click', sendMessage);
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
        ws.send(dataArray);
    }
    textinput.value = "";
}

function sendEnter() {
    if (event.keyCode === 13) {
        sendMessage();
    }
}

//recieve
ws.onmessage = ({ data }) => {
    let dataArray = data.split(",");
    let username = dataArray[0];
    let userInput = dataArray[1];
    console.log(data);
    let tmp = `<span class="username">${username}</span><div class="recieved-msg"><p class="current-msg">${userInput}</p> </div>`;
    chatarea.insertAdjacentHTML("beforeend", tmp);
};