// @ts-nocheck
let locationSearch = window.location.search;
locationSearch = locationSearch.replace('?', '');

const queryParams = {};
locationSearch.split('&').forEach(e => {
    const param = e.split('=');
    queryParams[param[0]] = param[1];
});

const { room, username } = queryParams;

if (!room || !username) {
    alert("Invalid QueryParams.\n Expected : ?room=<room name>&username=<user name>");
} else {
    const socket = io();
    socket.emit('joinRoom', { username, room });
    socket.on('connected', message => {
        console.log(message);
    });
    socket.on('message', message => {
        console.log(message);
    });
}