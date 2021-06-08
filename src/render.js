const textinput = document.getElementById('textinput');
const sendButton = document.getElementById('sendButton');
const chatarea = document.getElementById('chatarea');
//const { chatApp } = require('electron');

console.log("Started");
sendButton.addEventListener('click', sendMessage)
function sendMessage() {
    let userInput = textinput.value;
    console.log(userInput);
    //document.getElementById("msgbubble").innerHTML = userInput;
    let tmp = `<div class="output-msg> <span class="current-msg>${userInput}</span></div>`;

    chatarea.insertAdjacentHTML("beforeend", tmp);
    textinput.value = "";
    console.log(userInput);
}
