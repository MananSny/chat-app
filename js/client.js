const socket = io('http://localhost:8000');

const form = document.getElementById('send_container');
const messageInput = document.getElementById('message_inp');
const messageContainer = document.querySelector(".container");
const audio = new Audio('tig.mp3')

// Function to append messages to the chat
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='message_left'){
       audio.play();
    }
 
};

// Form submit event to send a message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'message_right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt user for their name when joining the chat
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Receive user join message
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'message_left');
});

// Receive message from others
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'message_left');
});

// Notify when a user leaves the chat
socket.on('user-left', name => {
    append(`${name} left the chat`, 'message_left');
});
