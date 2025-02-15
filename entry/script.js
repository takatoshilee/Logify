const apiKeyModal = document.getElementById("apiKeyModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");

function checkApiKey() {
  const key = localStorage.getItem("openai_api_key");
  if (!key) {
    apiKeyModal.style.display = "flex";
  } else {
    apiKeyModal.style.display = "none";
  }
}

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

<<<<<<< Updated upstream
=======
// === Spotify Authentication ===
const spotifyLoginBtn = document.getElementById("spotifyLoginBtn");
const spotifyClientId = document.getElementById("spotifyClientId");
const spotifyClientSecret = document.getElementById("spotifyClientSecret");

// Handle Spotify Login
spotifyLoginBtn.addEventListener("click", async () => {
  const clientId = spotifyClientId.value.trim();
  const clientSecret = spotifyClientSecret.value.trim();

  if (!clientId || !clientSecret) {
    alert("Please enter both Spotify Client ID and Client Secret.");
    return;
  }

  // Save Spotify credentials to localStorage
  localStorage.setItem("spotifyClientId", clientId);
  localStorage.setItem("spotifyClientSecret", clientSecret);

  // Now we initiate the Spotify authorization process
  try {
    const authToken = await getSpotifyAuthToken(clientId, clientSecret);
    if (authToken) {
      alert("Successfully logged in to Spotify!");
      localStorage.setItem("spotifyAuthToken", authToken);
    } else {
      alert("Failed to authenticate with Spotify.");
    }
  } catch (error) {
    console.error("Spotify authentication error:", error);
    alert("Error during Spotify authentication.");
  }
});

// Function to get Spotify Auth Token
async function getSpotifyAuthToken(clientId, clientSecret) {
  const authUrl = "https://accounts.spotify.com/api/token";
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token || null;
}

// === Date & Attachment Handling (unchanged) ===
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

>>>>>>> Stashed changes
document.addEventListener("DOMContentLoaded", () => {
  checkApiKey();
  setCurrentDate();
  const storedAttachment = localStorage.getItem("attachment");
  if (storedAttachment) {
    attachmentPreview.innerHTML = `<img src="${storedAttachment}" alt="Attachment preview" />`;
  }
<<<<<<< Updated upstream
=======

  // --- Check for an entry id in the URL ---
  const entryId = getQueryParam("id");
  if (entryId) {
    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const entry = entries.find(e => String(e.id) === entryId);
    if (entry) {
      document.getElementById("entryTitle").innerText = entry.title || "Journal Entry";
      document.getElementById("dateField").innerText = `Date: ${entry.date}`;
      journalText.value = entry.content || "";
      console.log("Loaded content:", entry.content);
    } else {
      console.warn("No entry found with id:", entryId);
    }
  }
>>>>>>> Stashed changes
});

// --------------------------
// AI Buttons
// --------------------------

// Finish with feedback button
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