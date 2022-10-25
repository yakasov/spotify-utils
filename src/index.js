import crypto from "crypto";
const query_params = {
    client_id: "c6a397d8515d4f3bb31b88c6a97646e8",
    redirect_uri: "http://localhost:8080/dist/index.html",
    scope: "user-read-email user-read-private user-library-read user-library-modify playlist-modify-public",
    response_type: "token",
};
const auth_url = "https://accounts.spotify.com/authorize?";
let auth_token;
const me_url = "https://api.spotify.com/v1/me"
let me_profile;

export function debugFunction() {
    console.log(auth_token);
    console.log(me_profile);
}

export async function login() {
    function getLoginUrl() {
        return "response_type=" + encodeURIComponent(query_params.response_type) +
            "&client_id=" + encodeURIComponent(query_params.client_id) +
            "&scope=" + encodeURIComponent(query_params.scope) +
            "&redirect_uri=" + encodeURIComponent(query_params.redirect_uri) +
            "&state=" + encodeURIComponent(createState(8) +
            "&show_dialog=true");
    };

    window.location = auth_url + getLoginUrl();
};

function createState(len) {
    return crypto.randomBytes(len).toString("hex");
};

export async function getPlaylists() {
    auth_token = window.location.hash.substring(14).split("&")[0];
    me_profile = await getRequest(me_url);
};

async function getRequest(url) {
    let xhttp = new XMLHttpRequest();

    return new Promise(resolve => {
        let response;
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                resolve(xhttp.responseText);
            }
        }
        xhttp.open("GET", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer " + auth_token);
        xhttp.send();
    })
};