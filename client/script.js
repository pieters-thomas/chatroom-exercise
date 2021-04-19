const socket = io.connect();
const messageBody = document.getElementById('messageBody');
const usersBody = document.getElementById('usersBody');
const input = document.getElementById('text-content');

let username;
while (username == null || username === '') {
    username = prompt('Enter name to chat:');
}

//prevent HTML injection.
function escapeHtml(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

//implement Emojis.
function impEmoji(text) {
    let map = {
        ':angry:': '&#128544;',
        ':barf:': '&#129326',
        ':cheeky:': '&#128541',
        ':cry:': '&#128557;',
        ':brow:': '&#129320;',
        ':mask:': '&#128567;',
        ':scared:': '&#128561;',
        ':sleepy:': '&#128564;',
        ':smile:': '&#128513;',
    };

    return text.replace(/(:angry:|:barf:|:cheeky:|:cry:|:brow:|:mask:|:scared:|:sleepy:|:smile:)/g, function(m) { return map[m];});
}

class Message {
    constructor()
    {
        this.sender = username;
        this.color = document.getElementById('text-color').value;
        this.text = escapeHtml(input.value) ;
        input.value = '';
    }
}

socket.emit('login', username);

document.getElementById('btnExit').addEventListener("click", function () {
    socket.emit('logout', `${username}`);
    window.location.reload(true);
});

document.getElementById('btnSendToSelf').addEventListener("click", function () {
    socket.emit('sendToSelf', new Message());
});

document.getElementById('btnSendToAll').addEventListener("click", function () {
    socket.emit('sendToAll', new Message());
});

socket.on('serverMessage', (message) => {
    messageBody.innerHTML += `<br> SERVER: ${message}`;
});

socket.on('displayMessage', (message) => {
    messageBody.innerHTML += `<br> <span class="text-${message.color}">${message.sender}: ${impEmoji(message.text)}</span> `;
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
});

socket.on('displayConnected', (users) => {
    usersBody.innerHTML = '';
    users.forEach(user => {usersBody.innerHTML += `<br>online: ${user}`;})
});
