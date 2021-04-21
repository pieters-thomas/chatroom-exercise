const socket = io.connect();
const messageBody = document.getElementById('messageBody');
const usersBody = document.getElementById('usersBody');
const input = document.getElementById('text-content');


//prevent HTML defacement.
function escapeHtml(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
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

    return text.replace(/(:angry:|:barf:|:cheeky:|:cry:|:brow:|:mask:|:scared:|:sleepy:|:smile:)/g, function (m) {
        return map[m];
    });
}

class User {
    constructor() {
        this.username = prompt('Enter name to chat:');
        this.slogan = prompt('Describe yourself in one sentence:');
        this.avatar = prompt('Provide a url for an avatar (optional):');
    }
}

class Message {
    constructor() {
        this.sender = user.username;
        this.color = document.getElementById('text-color').value;
        this.fontWeight = document.getElementById('text-font').value
        this.size = document.getElementById('text-size').value
        this.text = escapeHtml(input.value);
        input.value = '';
    }
}

let user = new User();
socket.emit('login', user);
document.getElementById('user-display').innerHTML = user.username;

document.getElementById('btnExit').addEventListener("click", function () {
    window.location.reload(true);
});
//typing
document.getElementById('text-content').addEventListener('keydown', function(){
    socket.emit('typing', user.username);
});

document.getElementById('btnSend').addEventListener("click", function () {
    // socket.emit('sendToSelf', new Message());
    let send = document.getElementById('send-to').value;
    socket.emit('sendMessage', send, new Message());
});

document.getElementById('btnSendAll').addEventListener("click", function () {
    socket.emit('sendToAll', new Message());
});

socket.on('serverMessage', (message) => {
    messageBody.innerHTML += `<br> SERVER: ${message}`;
});

socket.on('displayMessage', (message) => {

    document.getElementById('typing').innerHTML = '';
    messageBody.innerHTML += `<br> <p>${message.sender}:  </p>`;
    let a = messageBody.lastChild;
    a.style.color = message.color;
    a.style.display = 'inline-block';

    messageBody.innerHTML += `<p>${impEmoji(message.text)}</p>`;
    a = messageBody.lastChild;
    a.style.fontSize = message.size;
    a.style.color = message.color;
    a.style.fontWeight = message.fontWeight;
    a.style.display = 'inline-block';

    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
});

socket.on('displayConnected', (users) => {
    usersBody.innerHTML = '';
    document.getElementById('send-to').innerHTML = '';

    showConnected(users);
    setSendOptions(users);
});

socket.on('typing', (user) => {
    document.getElementById('typing').innerHTML = `${user} is typing a message`;
})

function showConnected(users) {

    let template, a;
    template = document.getElementsByTagName("template")[0].content.querySelector('div');
    users.forEach(user => {
        a = document.importNode(template, true);
        if (user.avatar != null) {
            a.childNodes[1].src = user.avatar;
        } else {
            a.childNodes[1].src = '/images/img.png';
        }
        a.childNodes[3].innerHTML = user.username;
        a.childNodes[5].innerHTML = user.slogan;

        document.getElementById('usersBody').appendChild(a);
    })
}

function setSendOptions(users) {
    users.forEach(user => {
        document.getElementById('send-to').innerHTML += `<option value="${user.username}">${user.username}</option>`;
    })
}

