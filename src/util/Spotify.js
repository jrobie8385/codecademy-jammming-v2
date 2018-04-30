const clientId = "161dbbef1eca4b89aa4cdd862793ab8b";
//const corsCompliant = "https://cors-anywhere.herokuapp.com/";
const baseURL = "https://api.spotify.com/v1";
const redirectUri = "http://localhost:3000/"; //http://jammming-joe.surge.sh
let accessToken;
let ttl;
let trackArray=[];

const Spotify = {
  getAccessToken() {
    if(accessToken) { //check if user's access token is already set.
      return accessToken;
      }
    else {
      let temp=window.location.href.match(/access_token=([^&]*)/); //matches 0 or more of any character except "&"
      if(temp) {
        accessToken=temp[1];
        temp=window.location.href.match(/expires_in=([^&]*)/);
        ttl=temp[1];
        window.setTimeout(() => accessToken='', ttl * 1000);
        window.history.pushState("Access Token", null, "/");
      }
      else {
        const scope="user-read-private playlist-modify-public";
        const redirectUrl=`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${redirectUri}`
        window.location=redirectUrl;
      }
    }
  },

  search (entry) {
    if (!accessToken) {
      Spotify.getAccessToken();
    }
    return fetch (`${baseURL}/search?type=track&q=${entry}`, //https://beta.developer.spotify.com/console/search/
      {
      headers: {Authorization: `Bearer ${accessToken}`} //https://developer.spotify.com/web-api/authorization-guide/
    }).then(response =>
      response.json()
    ).then(jsonResponse => {
      if(!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => (
          {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        )
      );
      });
  },

  savePlaylist(playlistName, trackArrayUris) {
    if(!playlistName || !trackArrayUris.length) {
      return;
    }
    const accessToken=Spotify.getAccessToken();
    const headers = {Authorization:`Bearer ${accessToken}`};
    let userId;
    return fetch(`${baseURL}/me`, //making request to reutrn Spotify username
    {
      headers: headers
    }).then(response =>
      response.json()
    ).then(jsonResponse => {
      userId=jsonResponse.id;
      return fetch(`${baseURL}/users/${userId}/playlists`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({name: playlistName})
      }).then(response => response.json()
    ).then(jsonResponse => {
        const playlistId=jsonResponse.id;
        return fetch(`${baseURL}/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({uris: trackArrayUris})
        });
      });
    });
  }
}

export default Spotify;

//https://beta.developer.spotify.com/documentation/general/guides/local-files-spotify-playlists/
//const redirectUrl=`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${redirectUri}`;
