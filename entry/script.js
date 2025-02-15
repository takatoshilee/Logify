// Spotify Authentication
const spotifyLoginBtn = document.getElementById("spotifyLoginBtn");
const spotifyLoginModal = document.getElementById("spotifyLoginModal");

// Check if the user is already logged in
function checkSpotifyLogin() {
  const spotifyAuthToken = localStorage.getItem("spotifyAuthToken");
  if (spotifyAuthToken) {
    // Hide the login modal if user is already logged in
    spotifyLoginModal.style.display = "none";
  } else {
    // Show the login modal if user is not logged in
    spotifyLoginModal.style.display = "flex";
  }
}

// Get the Spotify authorization URL for OAuth login
function getSpotifyAuthUrl() {
  const clientId = localStorage.getItem("spotifyClientId");
  const redirectUri = encodeURIComponent(window.location.href);  // Redirect back to the same page

  // Return the Spotify OAuth authorization URL
  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=playlist-read-private%20user-read-private`;
}

// Check for the authorization code in the URL (Spotify redirects here after login)
function checkSpotifyAuthCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");

  if (authCode) {
    exchangeAuthCodeForToken(authCode);
  }
}

// Exchange the authorization code for an access token
async function exchangeAuthCodeForToken(authCode) {
  const clientId = localStorage.getItem("spotifyClientId");
  const clientSecret = localStorage.getItem("spotifyClientSecret");
  const redirectUri = encodeURIComponent(window.location.href);

  const authHeader = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUri}`,
    });

    const data = await response.json();
    const accessToken = data.access_token;

    if (accessToken) {
      // Store the Spotify access token
      localStorage.setItem("spotifyAuthToken", accessToken);
      alert("Successfully logged in to Spotify!");
      spotifyLoginModal.style.display = "none";  // Hide login modal
    } else {
      alert("Failed to authenticate with Spotify.");
    }
  } catch (error) {
    console.error("Spotify authentication error:", error);
    alert("Error during Spotify authentication.");
  }
}

// Handle Spotify Login button click
spotifyLoginBtn.addEventListener("click", () => {
  const clientId = localStorage.getItem("spotifyClientId");

  if (!clientId) {
    alert("Please enter your Spotify credentials first.");
    return;
  }

  // Redirect to Spotify login page for OAuth authentication
  const authUrl = getSpotifyAuthUrl();
  window.location.href = authUrl;
});

// On page load, check if the user is logged in or has an auth code
document.addEventListener("DOMContentLoaded", () => {
  checkSpotifyLogin();  // Check if the user is already logged in to Spotify
  checkSpotifyAuthCode();  // Check if there's an auth code in the URL
});

// --- OpenAI API Key Modal Handling ---
const apiKeyModal = document.getElementById("apiKeyModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

// Check if API Key is stored
function checkApiKey() {
  const key = localStorage.getItem("openai_api_key");
  if (!key) {
    apiKeyModal.style.display = "flex";
  } else {
    apiKeyModal.style.display = "none";
  }
}

// Save API Key to LocalStorage
saveApiKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    alert("Please enter a valid API key.");
    return;
  }
  localStorage.setItem("openai_api_key", key);
  apiKeyModal.style.display = "none";
});

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function callOpenAI(messages) {
  const apiKey = localStorage.getItem("openai_api_key");
  if (!apiKey) {
    alert("No API key found. Please enter your API key.");
    return null;
  }
  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    const data = await response.json();
    // Extract the assistant's message from the response
    const content = data.choices?.[0]?.message?.content || "";
    return content;
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}

// --- Date & Attachment Handling ---
const dateField = document.getElementById("dateField");
const attachmentIcon = document.getElementById("attachmentIcon");
const fileInput = document.getElementById("fileInput");
const attachmentPreview = document.getElementById("attachmentPreview");
const journalText = document.getElementById("journalText");
const feedbackBtn = document.getElementById("feedbackBtn");
const rephraseBtn = document.getElementById("rephraseBtn");
const feedbackContainer = document.getElementById("feedbackContainer");

function setCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[now.getMonth()];
  dateField.textContent = `Date: ${monthName} ${day}, ${year}`;
}

attachmentIcon.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  attachmentPreview.innerHTML = "";
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64String = e.target.result;
    localStorage.setItem("attachment", base64String);
    if (file.type.startsWith("image/")) {
      attachmentPreview.innerHTML = `<img src="${base64String}" alt="Attachment preview" />`;
    } else {
      attachmentPreview.innerHTML = `<div class="file-name">${file.name}</div>`;
    }
  };
  reader.readAsDataURL(file);
});

// --- AI Feedback & Rephrasing ---
feedbackBtn.addEventListener("click", async () => {
  const text = journalText.value.trim();
  if (!text) {
    alert("Please write something first.");
    return;
  }
  const systemPrompt = `
    You are an AI that analyzes the user's journal entry. 
    Return JSON with:
    {
      "score": number (1-100, describing the mood positivity),
      "feedback": string (a short paragraph of feedback or advice)
    }
    Only valid JSON, no extra text.
  `;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: text },
  ];
  const aiResponse = await callOpenAI(messages);
  if (!aiResponse) {
    alert("No response from OpenAI. Check your API key or console for errors.");
    return;
  }
  let analysis;
  try {
    analysis = JSON.parse(aiResponse);
  } catch (err) {
    console.error("JSON parse error:", err);
    alert("Could not parse AI response. Check console for details.");
    return;
  }
  feedbackContainer.innerHTML = `
    <div class="feedback">
      <p><strong>Mood Score:</strong> <span class="mood-score">${analysis.score}</span></p>
      <p>${analysis.feedback}</p>
    </div>
  `;
});

// Rephrase button
rephraseBtn.addEventListener("click", async () => {
  const text = journalText.value.trim();
  if (!text) {
    alert("Please write something first.");
    return;
  }
  const systemPrompt = `
    You are an AI that rephrases the user's journal entry for clarity and style. 
    Return JSON with:
    {
      "rephrased": string
    }
    Only valid JSON, no extra text.
  `;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: text },
  ];
  const aiResponse = await callOpenAI(messages);
  if (!aiResponse) {
    alert("No response from OpenAI. Check your API key or console for errors.");
    return;
  }
  let rephraseObj;
  try {
    rephraseObj = JSON.parse(aiResponse);
  } catch (err) {
    console.error("JSON parse error:", err);
    alert("Could not parse AI response. Check console for details.");
    return;
  }
  feedbackContainer.innerHTML = `
    <div class="feedback">
      <p><strong>Rephrased Entry:</strong></p>
      <p>${rephraseObj.rephrased}</p>
    </div>
  `;
});