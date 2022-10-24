import crypto from "crypto";
const query_params = {
    client_id: "c6a397d8515d4f3bb31b88c6a97646e8",
    redirect_uri: window.location.origin,
    scope: "user-read-email user-read-private user-library-read user-library-modify playlist-modify-public",
    response_type: "token",
};
const auth_url = "https://accounts.spotify.com/authorize";
let auth_token = null;

export function login() {
    function getLoginUrl() {
        return "client_id=" + encodeURIComponent(query_params.client_id) +
            "&redirect_uri=" + encodeURIComponent(query_params.redirect_uri) +
            "&scope=" + encodeURIComponent(query_params.scope) +
            "&response_type=" + encodeURIComponent(query_params.response_type) +
            "&state=" + encodeURIComponent(createState(8));
    };
    if (!auth_token) {
        let xhttp = new XMLHttpRequest();
        let response = "";
        xhttp.open("POST", auth_url, true);
        xhttp.onload = () => {
            console.log(response);
        };
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        response = xhttp.send(getLoginUrl());
    };
};

function createState(len) {
    return crypto.randomBytes(len).toString("hex");
};