function clickHostServer() {
    if (!UI_UserNameInput()) {
        return false;
    }
    document.querySelector("#ui_main_menu").classList.add("hidden");
    document.querySelector("#ui_wait_clients").classList.remove("hidden");
    document.querySelector("#ui_join_server").classList.add("hidden");
    document.querySelector("#ui_lobby").classList.add("hidden");
    if (navigator.clipboard) {
        document.querySelector("#copy_clipboard_btn").classList.remove("hidden");
    } else {
        document.querySelector("#copy_clipboard_btn").classList.add("hidden");
    }
    UI_updateServerID();
    netSetUserName(UI_UserNameInput());
    netStartServer();
    netServerOnClientConnect(clientConnectedToServer);

    return true;
}

function UI_UserNameInput() {
    return document.querySelector("#user_name").value.trim();
}

function UI_RoomToJoinID() {
    return document.querySelector("#client_room_id").value.trim();
}

function UI_updateServerID() {
    document.querySelector("#server_room_id").innerText = peer.id;
}

function copyServerID() {
    navigator.clipboard.writeText(peer.id);
}

function clickConnect() {
    if (!UI_RoomToJoinID()) {
        return false;
    }
    let clientConn = netConnectToPeer(UI_RoomToJoinID());

    clientConn.on('open', function() {
        goToLobby();
    });
}

function clientConnectedToServer() {
    goToLobby();
    let usersLists = netGetUsersList();
    let lobbyStr = "";
    usersLists.forEach(user => {
        if (user.server) {
            lobbyStr += "[HOST] ";
        }
        lobbyStr += user.name + "<br />";
    });
    document.querySelector("#room_lobby").innerHTML = lobbyStr;
}

function goToLobby() {
    document.querySelector("#ui_main_menu").classList.add("hidden");
    document.querySelector("#ui_wait_clients").classList.add("hidden");
    document.querySelector("#ui_join_server").classList.add("hidden");
    document.querySelector("#ui_lobby").classList.remove("hidden");
}

function clickJoinServer() {
    if (!UI_UserNameInput()) {
        return false;
    }

    document.querySelector("#ui_main_menu").classList.add("hidden");
    document.querySelector("#ui_wait_clients").classList.add("hidden");
    document.querySelector("#ui_join_server").classList.remove("hidden");
    document.querySelector("#ui_lobby").classList.add("hidden");
    netSetUserName(UI_UserNameInput());
    netSetUserClient();

    return true;
}

function clickQuitToMainMenu() {
    document.querySelector("#ui_main_menu").classList.remove("hidden");
    document.querySelector("#ui_wait_clients").classList.add("hidden");
    document.querySelector("#ui_join_server").classList.add("hidden");
    document.querySelector("#ui_lobby").classList.add("hidden");

    netKillServer();
}