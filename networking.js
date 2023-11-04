let peer = new Peer();
let conn = null;
let reconnectIntervalID = null;
let netUserData = {
    server: false,
    name: "Sin Nombre"
};
let netUsersList = [];
let netUserOnConnectCallback=null;

peer.on('open', function(id) {
    document.querySelector("#peer_id").innerText = id;
    console.log("My peer ID is: " + id);
});

peer.on('connection', function(remoteConn) {

    if (reconnectIntervalID) {
        clearInterval(reconnectIntervalID);
        reconnectIntervalID = null;
    }
    if (netIsUserServer()) {
        netAddClient(remoteConn);
    }
    initConn(remoteConn);
});

peer.on('call', function(mediaConn) {
    updateConnStatusMsg("CALL", "Remote Peer: " + conn.peer);
});

peer.on('disconnected', function() {
    updateConnStatusMsg("DISCONNECTED", "");
    if (!reconnectIntervalID) {
        reconnectIntervalID = setInterval(() => {
            updateConnStatusMsg("RECONNECTING", "");
            peer.reconnect();
        }, 1000);
    }
});

peer.on('error', function(err) {
    updateConnStatusMsg("ERROR", err.type);
});

function initConn(connToSet) {
    conn = connToSet;
    conn.on('open', function() {
        conn.on('data', function(data) {
            updateDataReceived(data);
        });
        conn.on('close', function() {
            updateConnStatusMsg("CONN CLOSED", "Remote Peer: " + conn.peer);
        });
        if (netIsUserServer() && netUserOnConnectCallback) {
            netUserOnConnectCallback();
        }

        updateConnStatusMsg("CONNECTED", "Remote Peer: " + conn.peer);
    });
    conn.on('error', function(err) {
        updateConnStatusMsg("CONN ERROR", err);
    });
}

function netStartServer() {
    netSetUserServer();
    netUsersList = [];
    netUsersList.push(netUserData); //Add HOST always as first client.
}

function netAddClient(clientConn) {
    if (netClientExists(clientConn)) {
        return false;
    }
    netUsersList.push({
        server: false,
        name: clientConn.label
    });
    updateConnStatusMsg("ADD CLIENT", netUsersList[netUsersList.length-1].name);
    return true;
}

function netClientExists(clientConn) {
    for (let i=0; i < netUsersList.length; i++) {
        if (netUsersList[i].name == clientConn.label) {
            return true;
        }
    }
    return false;
}

function netSetUserServer() {
    netUserData.server = true;
}
function netSetUserClient() {
    netUserData.server = false;
}
function netIsUserServer() {
    return netUserData.server;
}
function netIsUserClient() {
    return !netIsUserServer();
}
function netSetUserName(newUserName) {
    netUserData.name = newUserName;
}
function netKillServer() {
    netSetUserClient();
}

function netGetUsersList() {
    return netUsersList;
}

function netServerOnClientConnect(callback) {
    netUserOnConnectCallback = callback;
}

//DEBUG ONLY
function netConnectToPeer(peer_id) {
    let tmpConn = peer.connect(peer_id, {label: netUserData.name});
    initConn(tmpConn);
    updateConnStatusMsg("CONNECTING", "Peer ID: " + peer_id);

    return tmpConn;
}

function onPressConnectToPeer() {
    netConnectToPeer(document.querySelector("#server_peer_id").value);
}

function updateDataReceived(data) {
    document.querySelector("#data_received").innerText = data;
}

function updateConnStatusMsg(status, message) {
    document.querySelector("#conn_status").innerText = "[" + status + "]: " + message;
}