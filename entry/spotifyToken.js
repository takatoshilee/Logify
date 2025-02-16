// spotifyToken.js

async function getSpotifyAccessToken() {
    const clientId = 'e3e6521273a74ae1a4652177816b5548';       // Your Client ID
    const clientSecret = '16fd05f7b0e648c9b01238303b2b748f';    // Your Client Secret
    const tokenUrl = 'https://accounts.spotify.com/api/token';
  
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
  
    const data = await response.json();
    return data.access_token; // This is your Spotify access token
  }
  
  // For testing: call the function and log the token
  getSpotifyAccessToken().then(token => {
    console.log("Spotify Access Token:", token);
  });