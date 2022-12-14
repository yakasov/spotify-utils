import crypto from "crypto";
const query_params = {
    client_id: "c6a397d8515d4f3bb31b88c6a97646e8",
    redirect_uri: "http://localhost:8080/dist/index.html",
    scope: "user-read-email user-read-private user-library-read user-library-modify playlist-modify-public",
    response_type: "token",
};
const auth_url = "https://accounts.spotify.com/authorize?";
const api_url = "https://api.spotify.com/v1/";
let auth_token;
let me_profile;
let playlists;

export function debugFunction() {
    return [auth_token, me_profile, playlists];
}

export async function login() {
    function getLoginUrl() {
        return (
            "response_type=" +
            encodeURIComponent(query_params.response_type) +
            "&client_id=" +
            encodeURIComponent(query_params.client_id) +
            "&scope=" +
            encodeURIComponent(query_params.scope) +
            "&redirect_uri=" +
            encodeURIComponent(query_params.redirect_uri) +
            "&state=" +
            encodeURIComponent(createState(8) + "&show_dialog=true")
        );
    }

    window.location = auth_url + getLoginUrl();
}

function createState(len) {
    return crypto.randomBytes(len).toString("hex");
}

export async function getPlaylists() {
    auth_token = window.location.hash.substring(14).split("&")[0];
    me_profile = await getRequest(api_url + "me");
    playlists = await getRequest(api_url + `users/${me_profile.id}/playlists?limit=50`);
    return playlists;
}

async function getRequest(url) {
    let xhttp = new XMLHttpRequest();

    return new Promise((resolve) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                resolve(JSON.parse(xhttp.responseText));
            }
        };
        xhttp.open("GET", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer " + auth_token);
        xhttp.send();
    });
}

async function postRequest(url, body) {
    let xhttp = new XMLHttpRequest();

    return new Promise((resolve) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                resolve(true);
            }
        };
        xhttp.open("POST", url);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer " + auth_token);
        xhttp.send('{"uris":[' + body + ']}');
    });
}

export async function mergePlaylists(fromPlaylistId, toPlaylistId, warningText) {
    let fromPlaylistTracks = await getPlaylistTracks(fromPlaylistId, warningText, "first");
    let toPlaylistTracks = await getPlaylistTracks(toPlaylistId, warningText, "second");
    let newTracks = [];
    let postTracks = [];

    warningText.innerHTML = "Comparing playlists...";
    fromPlaylistTracks.forEach((track) => {
        if (!toPlaylistTracks.includes(track)) {
            newTracks.push(track);
        }
    })
    warningText.innerHTML = "Beginning merge process..."
    if (newTracks.length) {
        newTracks.forEach((uri) => {
            if (postTracks.length >= 100) {
                postRequest(api_url + `playlists/${toPlaylistId}/tracks`, postTracks)
                postTracks = [];
            }
            postTracks.push('"' + uri + '"');
        })
        if (postRequest(api_url + `playlists/${toPlaylistId}/tracks`, postTracks)) {
            warningText.innerHTML = `Sucessfully merged playlists!<br>Added ${postTracks.length} tracks!`
        }
    } else {
        warningText.innerHTML = "No difference in tracks!"
    }
}


async function getPlaylistTracks(playlist_id, warningText, i) {
    let offset = 0;
    let joinedTracks = [];
    const playlistLength = await getRequest(api_url + `playlists/${playlist_id}`);
    while (offset < playlistLength.tracks.total) {
        warningText.innerHTML = `Processing tracks: ${offset}/${playlistLength.tracks.total} for ${i} playlist...`
        let playlistObj = await getRequest(api_url + `playlists/${playlist_id}/tracks?offset=${offset}&limit=50`);
        joinedTracks = joinedTracks.concat(getTracksFromObject(playlistObj))
        offset += 50;
    }
    return joinedTracks;
}

function getTracksFromObject(obj) {
    let i = [];
    obj.items.forEach((o) => {
        i.push(o.track.uri)
    })
    return i
}
