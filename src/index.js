import crypto from "crypto";
const query_params = {
    client_id: "c6a397d8515d4f3bb31b88c6a97646e8",
    redirect_uri: "http://localhost:8080/dist/index.html",
    scope: "user-read-email user-read-private user-library-read user-library-modify playlist-modify-public",
    response_type: "token",
};
const auth_url = "https://accounts.spotify.com/authorize?";
const token_url = "https://accounts.spotify.com/api/token";
let auth_token = null;

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

export function getTokenFromUrl() {
    if (window.location.hash.substring(1, 13) == "access_token") {
        auth_token = window.location.hash.substring(14).split("&")[0] // lol
    }
    console.log(auth_token);
}