// Initialize Spotify client details
const SPOTIFY_CLIENT_ID = 'your-client-id';  // Your Spotify Client ID
const SPOTIFY_CLIENT_SECRET = 'your-client-secret';  // Your Spotify Client Secret
const SPOTIFY_REDIRECT_URI = 'your-redirect-uri';  // Redirect URI you set in the Spotify Developer Dashboard
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=playlist-read-private user-library-read`;

// Function to handle authentication
function authenticateSpotify() {
  const authUrl = SPOTIFY_AUTH_URL;
  window.location.href = authUrl;
}

// Get the authorization code from the URL
function getSpotifyAuthCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

// Exchange the authorization code for an access token
async function exchangeSpotifyAuthCodeForToken(code) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}`
  });

  const data = await response.json();
  return data.access_token;
}

// Fetch Spotify playlists
async function fetchSpotifyPlaylists() {
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken) {
    alert('Spotify access token not found.');
    return;
  }

  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  console.log(data);  // Log playlists or display them in your app
}
function checkApiKey() {
    const key = localStorage.getItem("openai_api_key");
    apiKeyModal.style.display = key ? "none" : "flex";  // Shows the modal if no API key is stored
  }

// Check if the user is authenticated
function checkSpotifyAuth() {
  const code = getSpotifyAuthCode();
  if (code) {
    exchangeSpotifyAuthCodeForToken(code).then(accessToken => {
      localStorage.setItem('spotify_access_token', accessToken);
      fetchSpotifyPlaylists();
    });
  }
}

// Handle the authentication process when the page loads
document.addEventListener('DOMContentLoaded', () => {
  checkSpotifyAuth();
  
});