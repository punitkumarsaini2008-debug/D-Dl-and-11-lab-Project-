# 🎙️ ElevenLabs AI Voice Studio

A modern, responsive, and feature-rich Web Application built with **HTML5, Vanilla CSS, and JavaScript** that integrates directly with the **ElevenLabs Text-to-Speech (TTS) API**.

Transform any text into hyper-realistic, lifelike speech using state-of-the-art neural voice models.

---

## ✨ Features

- 🧠 **Multiple ElevenLabs Models**:
  - **Eleven Multilingual v2** (29+ Languages, Top Quality)
  - **Eleven Flash v2.5** (32 Languages, Ultra-fast streaming)
  - **Eleven Turbo v2.5** (32 Languages, Low latency)
  - **Eleven Flash v2** (English, Sub-100ms response)
  - **Eleven Turbo v2** (English, High fidelity)
  - **Eleven English v1** & **Multilingual v1** (Legacy models)
- 🗣️ **Diverse Voice Library**: Curated pre-made voices (Rachel, Adam, Antoni, Bella, Josh, Arnold, Sam, Domi, Elli, Callum, Charlie, etc.) plus automatic fetching of custom cloned voices from your ElevenLabs account.
- 🎛️ **Voice Fine-Tuning**: Real-time sliders for **Stability**, **Clarity / Similarity Boost**, **Style Exaggeration**, and **Speaker Boost**.
- 🎵 **Dynamic Audio Visualizer**: Real-time canvas frequency spectrum / glowing neon visualizer powered by the Web Audio API.
- ⏯️ **Full Playback Controls**: Custom audio player with Timeline Seeking, Play/Pause, Stop, Replay, Playback Speed (0.75x to 2.0x), Volume & Mute toggle.
- 💾 **Direct MP3 Download**: Instant one-click audio download for any generated narration.
- 📝 **Sample Preset Prompts**: One-click quick load for Movie Intros, Tech Podcasts, Fantasy Tales, and Meditation scripts.
- 📜 **Session Generation History**: View, re-play, and re-download all audio clips generated during the active session.
- 🔐 **Secure Local Key Storage**: API Key stored safely in the browser's `localStorage` with live status checks and key validation against the ElevenLabs API.
- ⌨️ **Keyboard Shortcuts**: <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (or <kbd>Cmd</kbd> + <kbd>Enter</kbd>) to generate speech, <kbd>Spacebar</kbd> to Play/Pause audio.

---

## 🚀 How to Run Locally

### Option 1: Open Directly in Any Browser
Simply double-click [`index.html`](./index.html) or open it in Chrome, Edge, Brave, or Firefox.

### Option 2: Run with a Local Static Server (Recommended)
Using Python:
```bash
python -m http.server 3000
```
Or using Node.js `npx serve` / `npx live-server`:
```bash
npx serve .
```
Then visit `http://localhost:3000` in your web browser.

---

## 🔑 Getting an ElevenLabs API Key

1. Sign up for free at [ElevenLabs.io](https://elevenlabs.io).
2. Click on your profile icon in the bottom left -> **Profile + API key**.
3. Copy your **API Key** (`xi-api-key`).
4. In the app, click **"Set API Key"** in the top right, paste your key, and click **"Save & Connect"**.

---

## 📂 Project Structure

```
11 lab/
├── index.html        # Main HTML structure with semantic UI layout
├── style.css         # Modern glassmorphic cyberpunk & dark theme styling
├── app.js            # ElevenLabs API calls, Web Audio visualizer, and player logic
└── README.md         # Documentation & user guide
```
