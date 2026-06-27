// spotifyToken.js

async function getSpotifyAccessToken() {
    const clientId = 'YOUR_CLIENT_ID';       // Your Client ID
    const clientSecret = 'YOUR_CLIENT_SECRET';    // Your Client Secret
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