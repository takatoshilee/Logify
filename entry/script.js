// === API Key Modal & OpenAI functions (unchanged) ===
const apiKeyModal = document.getElementById("apiKeyModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");


function checkApiKey() {
  const key = localStorage.getItem("openai_api_key");
  apiKeyModal.style.display = key ? "none" : "flex";
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
    const content = data.choices?.[0]?.message?.content || "";
    return content;
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}

// === Date & Attachment Handling ===
const dateField = document.getElementById("dateField");
const attachmentIcon = document.getElementById("attachmentIcon");
const fileInput = document.getElementById("fileInput");
const attachmentPreview = document.getElementById("attachmentPreview");
const journalText = document.getElementById("journalText");

function setCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const monthName = monthNames[now.getMonth()];
  dateField.textContent = `Date: ${monthName} ${day}, ${year}`;
}

function formatDate(dateInput) {
  // Append time component if needed to avoid timezone issues:
  const date = new Date(dateInput + "T00:00:00");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${dayName}, ${month} ${day},${year}`;
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


function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}


document.addEventListener("DOMContentLoaded", () => {
  checkApiKey();
  setCurrentDate();
  
  // Check if we're editing an existing entry:
  const entryId = getQueryParam("id");
  if (entryId) {
    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const entry = entries.find(e => String(e.id) === entryId);
    if (entry) {
      // Populate fields with the entry data
      document.getElementById("entryTitle").innerText = entry.title || "Journal Entry";
      document.getElementById("dateField").innerText = `Date: ${formatDate(entry.date)}`;
      journalText.value = entry.content || "";
      // Load the attachment from the entry if it exists
      if (entry.attachment) {
        attachmentPreview.innerHTML = `<img src="${entry.attachment}" alt="Attachment preview" />`;
      } else {
        attachmentPreview.innerHTML = "";
      }
    } else {
      console.warn("No entry found with id:", entryId);
    }
  } else {
    // For a new entry, check if a temporary attachment exists in localStorage
    const storedAttachment = localStorage.getItem("attachment");
    if (storedAttachment) {
      attachmentPreview.innerHTML = `<img src="${storedAttachment}" alt="Attachment preview" />`;
    }
  }
});

// === AI Feedback & Rephrase Buttons (unchanged) ===
const feedbackBtn = document.getElementById("feedbackBtn");
const rephraseBtn = document.getElementById("rephraseBtn");
const feedbackContainer = document.getElementById("feedbackContainer");

feedbackBtn.addEventListener("click", async () => {
  const text = journalText.value.trim();
  console.log("Saving text:", text);
  if (!text) {
    alert("Please write something first.");
    return;
  }
  const systemPrompt = `
    Act as a therapist and provide feedback and analysis on the diary's content.
    Return JSON with:
    {
      "score": number (1-100, describing the mood positivity),
      "emotion": string ("Acceptance", "Calm", "Excited", "Grateful", "Happy", "Hopeful", "Loved", "Relaxed", "Relieved", "Satisfied", "Angry", "Anxious", "Bored", "Detached", "Hopeless", "Restless", "Sad", "Stressed", "Tired", "Worried"),
      "feedback": string (a short paragraph)
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
  
  // Store the mood score in localStorage so it can be used when saving the entry
  localStorage.setItem("moodvalue", analysis.score);
  
  feedbackContainer.innerHTML = `
    <div class="feedback">
      <p><strong>Mood Score:</strong> <span class="mood-score">${analysis.score}</span></p>
      <p>${analysis.feedback}</p>
    </div>
  `;
});

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


  // In your feedbackBtn event handler, after parsing the response:
  localStorage.setItem("moodvalue", analysis.score);
  console.log("Stored moodvalue:", analysis.score);
});

// === NEW: Save Entry to Local Storage ===
const saveEntryBtn = document.getElementById("saveEntryBtn");

saveEntryBtn.addEventListener("click", () => {
  const text = journalText.value.trim();
  if (!text) {
    alert("Please write something before saving.");
    return;
  }

  // Use the date from your date input (or current date if not modified)
  const now = new Date();
  const entryDate = document.getElementById("entryDateInput")?.value || now.toISOString().split("T")[0];

  // Get attachment if available
  const attachment = localStorage.getItem("attachment") || null;

  // Get title from the contenteditable div
  const title = document.getElementById("entryTitle").innerText.trim() || "Journal Entry";

  // Retrieve mood value from localStorage
  // If it's null, you can assign a default value (for example, 50) or leave it as null.
  let moodVal = localStorage.getItem("moodvalue");
  if (moodVal !== null) {
    moodVal = Number(moodVal);
  } else {
    // Optionally assign a default, or leave as null
    moodVal = null; // or: moodVal = 50;
  }

  const entryId = getQueryParam("id");
  let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

  if (entryId) {
    const index = entries.findIndex(e => String(e.id) === entryId);
    if (index !== -1) {
      entries[index].date = entryDate;
      entries[index].title = title;
      entries[index].content = text;
      entries[index].attachment = attachment;
      entries[index].mood_val = moodVal;
      alert("Journal entry updated!");
    } else {
      console.warn("No entry found with id:", entryId);
    }
  } else {
    const newEntry = {
      id: Date.now(),
      date: entryDate,
      title: title,
      content: text,
      mood_val: moodVal,
      attachment: attachment
    };
    entries.push(newEntry);
    alert("Journal entry saved!");
  }
  
  localStorage.setItem("journalEntries", JSON.stringify(entries));
  // Clear temporary values
  localStorage.removeItem("attachment");
  localStorage.removeItem("moodvalue");
  
  window.location.href = "../index.html";
});



const spotifyAccessToken = "BQDSAr2jG-Wtakrf1uFQSAP6GbHxRud7uF-bbyfTLXnqgoD0DWmvufRcPLHrQQCIl56cyXJOhMHv1X13lPjq5wjAL5bP7JYtS10Ucb8Tv5UoXgK8gafx_EbLbkEpV8ckfZhgx21HfSU"

const songBtn = document.getElementById("songBtn");
const songRecommendationEl = document.getElementById("songRecommendation");


async function searchSpotifyTrack(query) {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${spotifyAccessToken}`
      }
    });
    const data = await response.json();
    if (data.tracks && data.tracks.items.length > 0) {
      return data.tracks.items[0].id; // Return the track ID
    }
  } catch (error) {
    console.error("Spotify search error:", error);
  }
  return null;
}

songBtn.addEventListener("click", async () => {
  const cdEmoji = songBtn.querySelector(".cd-emoji");
  cdEmoji.classList.add("rotating");

  const journalContent = journalText.value.trim();
  if (!journalContent) {
    alert("Please write something first.");
    cdEmoji.classList.remove("rotating");
    return;
  }
  
  // Create a prompt for song recommendation based on the journal entry
  const prompt = `
    Based on the following journal entry, suggest a song that best captures its mood and tone.
    Provide the song title and artist in the format "Song Title" by Artist:
    "${journalContent}"
  `;
  
  const messages = [
    { role: "system", content: "You are a helpful music recommendation assistant." },
    { role: "user", content: prompt }
  ];
  
  const aiResponse = await callOpenAI(messages);
  cdEmoji.classList.remove("rotating");
  
  if (!aiResponse) {
    alert("No response from OpenAI. Check your API key or console for errors.");
    return;
  }
  
  const recommendedSong = aiResponse.trim();
  
  // Now search Spotify for this song
  const trackId = await searchSpotifyTrack(recommendedSong);
  
  // Clear any previous recommendation
  songRecommendationEl.innerHTML = "";
  
  if (trackId) {
    // Embed Spotify player using the track ID
    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
    iframe.width = "300";
    iframe.height = "80";
    iframe.frameBorder = "0";
    iframe.allowTransparency = "true";
    iframe.allow = "encrypted-media";
    songRecommendationEl.appendChild(iframe);
  } else {
    songRecommendationEl.textContent = "No matching song found.";
  }
});