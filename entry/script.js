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

document.addEventListener("DOMContentLoaded", () => {
  checkApiKey();
  setCurrentDate();
  const storedAttachment = localStorage.getItem("attachment");
  if (storedAttachment) {
    attachmentPreview.innerHTML = `<img src="${storedAttachment}" alt="Attachment preview" />`;
  }
});

// === AI Feedback & Rephrase Buttons (unchanged) ===
const feedbackBtn = document.getElementById("feedbackBtn");
const rephraseBtn = document.getElementById("rephraseBtn");
const feedbackContainer = document.getElementById("feedbackContainer");

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

// === NEW: Save Entry to Local Storage ===
const saveEntryBtn = document.getElementById("saveEntryBtn");

saveEntryBtn.addEventListener("click", () => {
  const text = journalText.value.trim();
  if (!text) {
    alert("Please write something before saving.");
    return;
  }

  // Create an entry object with standardized fields
  const now = new Date();
  const entryDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const newEntry = {
    id: Date.now(),  // unique id
    date: entryDate,
    title: document.getElementById("entryTitle").textContent || "Journal Entry",
    content: text,
    mood_val: null  // You can later update this from your AI feedback if desired
  };

  // Retrieve current entries from localStorage
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  entries.push(newEntry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));

  alert("Journal entry saved!");
  // Optionally, navigate back to the main page:
  window.location.href = "../index.html";
});