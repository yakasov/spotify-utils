import crypto from "crypto";
import request from "request";
const query_params = {
    client_id: "c6a397d8515d4f3bb31b88c6a97646e8",
    redirect_uri: "http://127.0.0.1:5500/index.html",
    scope: "user-read-email user-read-private user-library-read user-library-modify playlist-modify-public",
    response_type: "code",
 }
 const auth_url = "https://accounts.spotify.com/authorize?"
 let auth_token = null;

 function login() {
    console.log("qwewqeqe");
    function getLoginURL() {
        return auth_url + "client_id=" + query_params.client_id +
        "&redirect_uri=" + query_params.redirect_uri +
        "&scope=" + query_params.scope + 
        "&response_type=" + query_params.response_type +
        "&state=" + createState(8);
    }

    if (!auth_token) {
        auth_token = request.post(getLoginURL());
    }
 }

 function createState(len) {
    return crypto.randomBytes(len).toString("hex");
 }

 window.login = login;