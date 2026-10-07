/**
 * ElevenLabs Voice Studio - Application Logic
 * Vanilla JavaScript implementation for Text-to-Speech narration
 */

// ==========================================
// 1. Preset Voices & Models Configuration
// ==========================================

const PRESET_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', category: 'Premade', gender: 'Female', accent: 'American', style: 'Calm & Expressive' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', category: 'Premade', gender: 'Male', accent: 'American', style: 'Deep & Authoritative' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', category: 'Premade', gender: 'Male', accent: 'American', style: 'Well-Rounded & Friendly' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', category: 'Premade', gender: 'Female', accent: 'American', style: 'Soft & Gentle' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', category: 'Premade', gender: 'Male', accent: 'American', style: 'Young & Confident' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', category: 'Premade', gender: 'Male', accent: 'American', style: 'Crisp & Articulate' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', category: 'Premade', gender: 'Male', accent: 'American', style: 'Dynamic & Engaging' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', category: 'Premade', gender: 'Female', accent: 'American', style: 'Strong & Emphatic' },
  { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', category: 'Premade', gender: 'Female', accent: 'American', style: 'Youthful & Clear' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', category: 'Premade', gender: 'Male', accent: 'Transatlantic', style: 'Intense Storyteller' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', category: 'Premade', gender: 'Male', accent: 'Australian', style: 'Casual & Conversational' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', category: 'Premade', gender: 'Female', accent: 'Swedish/English', style: 'Seductive & Elegant' },
  { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde', category: 'Premade', gender: 'Male', accent: 'American', style: 'Veteran & Gritty' },
  { id: 'ThT5KcBeYPX3keUQqHPh', name: 'Dorothy', category: 'Premade', gender: 'Female', accent: 'British', style: 'Pleasant & Storybook' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', category: 'Premade', gender: 'Male', accent: 'British', style: 'Warm & Raspy' },
  { id: 'ZQe5CZNOzWyzPSCn5a3c', name: 'James', category: 'Premade', gender: 'Male', accent: 'Australian', style: 'Calm & Professional' },
  { id: 'Zlb1dXrM653N07WRdFW3', name: 'Joseph', category: 'Premade', gender: 'Male', accent: 'British', style: 'Grounded & News Anchor' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', category: 'Premade', gender: 'Female', accent: 'American', style: 'Warm & Audiobook' },
  { id: 'GBv7mTt0atIp3Br8iCZE', name: 'Thomas', category: 'Premade', gender: 'Male', accent: 'American', style: 'Calm & Meditative' }
];

const MODEL_DESCRIPTIONS = {
  eleven_multilingual_v2: 'State-of-the-art multilingual model with rich emotional nuance (29+ languages).',
  eleven_flash_v2_5: 'Ultra-low latency model optimized for high-speed streaming across 32 languages.',
  eleven_turbo_v2_5: 'High-quality with ultra-fast generation times across 32 languages.',
  eleven_flash_v2: 'Cutting-edge English-only flash model with sub-100ms response times.',
  eleven_turbo_v2: 'English-only high quality narration with very low latency.',
  eleven_monolingual_v1: 'Standard English legacy model with consistent voice performance.',
  eleven_multilingual_v1: 'First-generation experimental multilingual model.'
};

const SAMPLE_PROMPTS = {
  cinematic: "In a world covered in perpetual twilight, a lone archivist uncovers a secret that could reignite the stars... or plunge humanity into eternal darkness.",
  podcast: "Welcome back to Deep Future! Today, we're diving into the breakthroughs of generative speech, neural architectures, and where human-AI creative collaboration is heading next.",
  story: "The ancient wizard raised his glowing oak staff. Deep within the subterranean cavern of whispers, forgotten blue runes flickered to life, illuminating the dormant dragon.",
  meditation: "Take a slow, deep breath in through your nose... feel the cool air fill your lungs... hold it for three peaceful moments... and gently release all tension with your exhale."
};

// Default Integrated ElevenLabs API Key
const DEFAULT_API_KEY = 'sk_fba4e8d766c5095bd4ca55e2f96c687ec3527b43f2fcc9e2';

// ==========================================
// 2. Application State
// ==========================================

const state = {
  apiKey: localStorage.getItem('elevenlabs_api_key') || DEFAULT_API_KEY,
  voices: [...PRESET_VOICES],
  currentVoiceId: '21m00Tcm4TlvDq8ikWAM',
  currentModelId: 'eleven_multilingual_v2',
  isGenerating: false,
  isPlaying: false,
  currentAudioUrl: null,
  currentAudioBlob: null,
  currentAudioDuration: 0,
  playbackSpeed: 1.0,
  playbackSpeedOptions: [0.75, 1.0, 1.25, 1.5, 2.0],
  history: []
};

// ==========================================
// 3. DOM Element References
// ==========================================

const DOM = {
  // Header / API Modal
  apiKeyBtn: document.getElementById('apiKeyBtn'),
  apiKeyStatusText: document.getElementById('apiKeyStatusText'),
  apiKeyBadge: document.getElementById('apiKeyBadge'),
  apiKeyModal: document.getElementById('apiKeyModal'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  toggleKeyVisibility: document.getElementById('toggleKeyVisibility'),
  eyeIcon: document.getElementById('eyeIcon'),
  testApiKeyBtn: document.getElementById('testApiKeyBtn'),
  removeApiKeyBtn: document.getElementById('removeApiKeyBtn'),
  saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
  apiTestStatus: document.getElementById('apiTestStatus'),

  // Controls Panel
  modelSelect: document.getElementById('modelSelect'),
  modelBadge: document.getElementById('modelBadge'),
  modelDescription: document.getElementById('modelDescription'),
  voiceSelect: document.getElementById('voiceSelect'),
  voiceCountBadge: document.getElementById('voiceCountBadge'),
  voiceCategory: document.getElementById('voiceCategory'),
  voiceGender: document.getElementById('voiceGender'),
  voiceAccent: document.getElementById('voiceAccent'),
  refreshVoicesBtn: document.getElementById('refreshVoicesBtn'),
  toggleVoiceSettings: document.getElementById('toggleVoiceSettings'),
  voiceSettingsAccordion: document.getElementById('voiceSettingsAccordion'),

  // Voice Settings Sliders
  stabilitySlider: document.getElementById('stabilitySlider'),
  stabilityVal: document.getElementById('stabilityVal'),
  similaritySlider: document.getElementById('similaritySlider'),
  similarityVal: document.getElementById('similarityVal'),
  styleSlider: document.getElementById('styleSlider'),
  styleVal: document.getElementById('styleVal'),
  speakerBoostToggle: document.getElementById('speakerBoostToggle'),

  // Workspace
  textInput: document.getElementById('textInput'),
  charCount: document.getElementById('charCount'),
  wordCount: document.getElementById('wordCount'),
  clearTextBtn: document.getElementById('clearTextBtn'),
  pasteTextBtn: document.getElementById('pasteTextBtn'),
  generateBtn: document.getElementById('generateBtn'),
  generateBtnText: document.getElementById('generateBtnText'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  playIcon: document.getElementById('playIcon'),

  // Player
  playerCard: document.getElementById('playerCard'),
  currentVoiceTitle: document.getElementById('currentVoiceTitle'),
  currentMetaSubtitle: document.getElementById('currentMetaSubtitle'),
  playerStatusBadge: document.getElementById('playerStatusBadge'),
  playerStatusText: document.getElementById('playerStatusText'),
  visualizerCanvas: document.getElementById('visualizerCanvas'),
  visualizerOverlay: document.getElementById('visualizerOverlay'),
  nativeAudio: document.getElementById('nativeAudioElement'),
  currentTimeLabel: document.getElementById('currentTimeLabel'),
  durationLabel: document.getElementById('durationLabel'),
  progressBar: document.getElementById('progressBar'),
  progressFill: document.getElementById('progressFill'),
  progressHandle: document.getElementById('progressHandle'),
  audioPlayPauseBtn: document.getElementById('audioPlayPauseBtn'),
  audioPlayPauseIcon: document.getElementById('audioPlayPauseIcon'),
  audioStopBtn: document.getElementById('audioStopBtn'),
  replayBtn: document.getElementById('replayBtn'),
  volumeSlider: document.getElementById('volumeSlider'),
  muteBtn: document.getElementById('muteBtn'),
  volumeIcon: document.getElementById('volumeIcon'),
  speedBtn: document.getElementById('speedBtn'),
  downloadAudioBtn: document.getElementById('downloadAudioBtn'),

  // History & Toast
  historyList: document.getElementById('historyList'),
  historyCountBadge: document.getElementById('historyCountBadge'),
  emptyHistoryMsg: document.getElementById('emptyHistoryMsg'),
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================
// 4. Audio Visualization Setup (Web Audio API)
// ==========================================

let audioContext = null;
let audioSource = null;
let analyser = null;
let animationFrameId = null;

function initAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    audioSource = audioContext.createMediaElementSource(DOM.nativeAudio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function drawVisualizer() {
  const canvas = DOM.visualizerCanvas;
  const ctx = canvas.getContext('2d');
  
  // Set real canvas pixel dimensions
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  const width = canvas.width;
  const height = canvas.height;

  if (!analyser || !state.isPlaying) {
    // Draw idle gentle wave line
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    return;
  }

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, width, height);

  const barWidth = (width / bufferLength) * 2.2;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * (height * 0.85);

    // Glowing Neon Gradient
    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.8)');
    gradient.addColorStop(1, '#06b6d4');

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';

    // Draw rounded bar
    const radius = 3;
    const y = height - barHeight;
    
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, height);
    ctx.closePath();
    ctx.fill();

    x += barWidth + 2;
  }

  animationFrameId = requestAnimationFrame(drawVisualizer);
}

// ==========================================
// 5. UI Helpers & Notifications
// ==========================================

function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'error') iconClass = 'fa-circle-exclamation';

  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function updateApiKeyStatus() {
  if (state.apiKey && state.apiKey.trim().length > 10) {
    DOM.apiKeyStatusText.textContent = 'API Connected';
    DOM.apiKeyBadge.className = 'status-dot connected';
    DOM.apiKeyBtn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
  } else {
    DOM.apiKeyStatusText.textContent = 'Set API Key';
    DOM.apiKeyBadge.className = 'status-dot disconnected';
    DOM.apiKeyBtn.style.borderColor = 'var(--card-border)';
  }
}

function updateCharAndWordCount() {
  const text = DOM.textInput.value;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  DOM.charCount.textContent = chars.toLocaleString();
  DOM.wordCount.textContent = words.toLocaleString();
}

function populateVoiceSelect() {
  DOM.voiceSelect.innerHTML = '';
  
  state.voices.forEach(voice => {
    const opt = document.createElement('option');
    opt.value = voice.id;
    opt.textContent = `${voice.name} (${voice.gender}, ${voice.accent})`;
    if (voice.id === state.currentVoiceId) {
      opt.selected = true;
    }
    DOM.voiceSelect.appendChild(opt);
  });

  DOM.voiceCountBadge.textContent = `${state.voices.length} Voices`;
  updateVoiceMeta();
}

function updateVoiceMeta() {
  const currentVoice = state.voices.find(v => v.id === state.currentVoiceId) || state.voices[0];
  if (currentVoice) {
    DOM.voiceCategory.textContent = currentVoice.category || 'Premade';
    DOM.voiceGender.textContent = currentVoice.gender || 'Unknown';
    DOM.voiceAccent.textContent = currentVoice.accent || 'Neutral';
  }
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==========================================
// 6. ElevenLabs API Handlers
// ==========================================

async function fetchVoicesFromApi() {
  if (!state.apiKey) {
    showToast('API Key Required', 'Please configure your ElevenLabs API Key to load online voices.', 'error');
    openModal();
    return;
  }

  DOM.refreshVoicesBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': state.apiKey
      }
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (data && data.voices && data.voices.length > 0) {
      state.voices = data.voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category || 'Custom',
        gender: v.labels?.gender || 'Custom',
        accent: v.labels?.accent || 'Neutral',
        style: v.labels?.description || ''
      }));

      populateVoiceSelect();
      showToast('Voices Synced', `Successfully loaded ${state.voices.length} voices from ElevenLabs!`, 'success');
    }
  } catch (err) {
    console.error('Failed to fetch voices:', err);
    showToast('Sync Failed', err.message || 'Could not fetch voices from ElevenLabs API.', 'error');
  } finally {
    DOM.refreshVoicesBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
  }
}

async function testApiKeyConnection(keyToTest) {
  const key = keyToTest || DOM.apiKeyInput.value.trim();
  if (!key) {
    DOM.apiTestStatus.className = 'api-test-status error';
    DOM.apiTestStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please enter an API key to test.';
    DOM.apiTestStatus.classList.remove('hidden');
    return false;
  }

  DOM.apiTestStatus.className = 'api-test-status testing';
  DOM.apiTestStatus.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying API Key with ElevenLabs gateway...';
  DOM.apiTestStatus.classList.remove('hidden');

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': key
      }
    });

    if (res.ok) {
      const userData = await res.json();
      const tier = userData.subscription?.tier || 'Free';
      const count = userData.subscription?.character_count || 0;
      const limit = userData.subscription?.character_limit || 10000;

      DOM.apiTestStatus.className = 'api-test-status success';
      DOM.apiTestStatus.innerHTML = `
        <i class="fa-solid fa-check-circle"></i>
        <span>Connected! <strong>${tier} Tier</strong> (${count.toLocaleString()}/${limit.toLocaleString()} chars used)</span>
      `;
      return true;
    } else {
      const errData = await res.json().catch(() => ({}));
      DOM.apiTestStatus.className = 'api-test-status error';
      DOM.apiTestStatus.innerHTML = `
        <i class="fa-solid fa-circle-xmark"></i>
        <span>Invalid Key: ${errData.detail?.message || res.statusText || 'Unauthorized'}</span>
      `;
      return false;
    }
  } catch (err) {
    DOM.apiTestStatus.className = 'api-test-status error';
    DOM.apiTestStatus.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Connection Failed: ${err.message}`;
    return false;
  }
}

async function generateSpeech() {
  const text = DOM.textInput.value.trim();
  if (!text) {
    showToast('Missing Text', 'Please enter or paste some text for ElevenLabs to narrate.', 'error');
    DOM.textInput.focus();
    return;
  }

  if (!state.apiKey) {
    showToast('API Key Required', 'Please set your ElevenLabs API Key to generate real AI speech.', 'error');
    openModal();
    return;
  }

  const voiceId = state.currentVoiceId;
  const modelId = state.currentModelId;
  const voiceObj = state.voices.find(v => v.id === voiceId) || { name: 'Voice' };

  // Set Loading UI State
  setGeneratingState(true);
  DOM.playerStatusBadge.className = 'player-status-badge generating';
  DOM.playerStatusText.textContent = 'Generating...';

  try {
    const voiceSettings = {
      stability: parseFloat(DOM.stabilitySlider.value),
      similarity_boost: parseFloat(DOM.similaritySlider.value),
      style: parseFloat(DOM.styleSlider.value),
      use_speaker_boost: DOM.speakerBoostToggle.checked
    };

    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': state.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: modelId,
        voice_settings: voiceSettings
      })
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMsg = errorJson.detail?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Save current generation
    state.currentAudioBlob = audioBlob;
    state.currentAudioUrl = audioUrl;

    // Load into audio player
    DOM.nativeAudio.src = audioUrl;
    DOM.nativeAudio.load();

    // Enable player controls
    DOM.audioPlayPauseBtn.disabled = false;
    DOM.audioStopBtn.disabled = false;
    DOM.replayBtn.disabled = false;
    DOM.downloadAudioBtn.disabled = false;

    // Update Player UI Info
    DOM.currentVoiceTitle.textContent = `${voiceObj.name} Narration`;
    DOM.currentMetaSubtitle.textContent = `Model: ${DOM.modelSelect.options[DOM.modelSelect.selectedIndex].text.split('(')[0].trim()}`;

    // Add to history
    addToHistory({
      id: Date.now(),
      voiceName: voiceObj.name,
      model: modelId,
      textSnippet: text.length > 80 ? text.substring(0, 80) + '...' : text,
      blob: audioBlob,
      url: audioUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    showToast('Speech Generated!', `Narration with ${voiceObj.name} is ready.`, 'success');

    // Automatically trigger playback
    playAudio();

  } catch (error) {
    console.error('Speech generation error:', error);
    showToast('Generation Error', error.message || 'Failed to synthesize speech.', 'error');
    DOM.playerStatusBadge.className = 'player-status-badge';
    DOM.playerStatusText.textContent = 'Error';
  } finally {
    setGeneratingState(false);
  }
}

function setGeneratingState(isGen) {
  state.isGenerating = isGen;
  DOM.generateBtn.disabled = isGen;
  if (isGen) {
    DOM.loadingSpinner.classList.remove('hidden');
    DOM.playIcon.classList.add('hidden');
    DOM.generateBtnText.textContent = 'Synthesizing Speech...';
  } else {
    DOM.loadingSpinner.classList.add('hidden');
    DOM.playIcon.classList.remove('hidden');
    DOM.generateBtnText.textContent = 'Generate & Narrate';
  }
}

// ==========================================
// 7. Audio Playback Control
// ==========================================

function playAudio() {
  if (!DOM.nativeAudio.src) return;

  initAudioContext();

  DOM.nativeAudio.play().then(() => {
    state.isPlaying = true;
    DOM.audioPlayPauseIcon.className = 'fa-solid fa-pause';
    DOM.playerStatusBadge.className = 'player-status-badge playing';
    DOM.playerStatusText.textContent = 'Playing';
    DOM.visualizerOverlay.classList.add('hidden');
    
    cancelAnimationFrame(animationFrameId);
    drawVisualizer();
  }).catch(err => {
    console.warn('Playback error:', err);
  });
}

function pauseAudio() {
  DOM.nativeAudio.pause();
  state.isPlaying = false;
  DOM.audioPlayPauseIcon.className = 'fa-solid fa-play';
  DOM.playerStatusBadge.className = 'player-status-badge';
  DOM.playerStatusText.textContent = 'Paused';
}

function toggleAudioPlayPause() {
  if (state.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function stopAudio() {
  DOM.nativeAudio.pause();
  DOM.nativeAudio.currentTime = 0;
  state.isPlaying = false;
  DOM.audioPlayPauseIcon.className = 'fa-solid fa-play';
  DOM.playerStatusBadge.className = 'player-status-badge';
  DOM.playerStatusText.textContent = 'Ready';
  DOM.progressFill.style.width = '0%';
  DOM.currentTimeLabel.textContent = '0:00';
  DOM.visualizerOverlay.classList.remove('hidden');
}

function replayAudio() {
  DOM.nativeAudio.currentTime = 0;
  playAudio();
}

function cyclePlaybackSpeed() {
  const currentIndex = state.playbackSpeedOptions.indexOf(state.playbackSpeed);
  const nextIndex = (currentIndex + 1) % state.playbackSpeedOptions.length;
  state.playbackSpeed = state.playbackSpeedOptions[nextIndex];
  
  DOM.nativeAudio.playbackRate = state.playbackSpeed;
  DOM.speedBtn.textContent = `${state.playbackSpeed}x`;
}

function downloadCurrentAudio(blobToDownload, filename) {
  const blob = blobToDownload || state.currentAudioBlob;
  if (!blob) return;

  const name = filename || `elevenlabs-narration-${Date.now()}.mp3`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Download Started', `Saving ${name}`, 'success');
}

// ==========================================
// 8. History Management
// ==========================================

function addToHistory(item) {
  state.history.unshift(item);
  DOM.emptyHistoryMsg?.remove();
  renderHistory();
}

function renderHistory() {
  DOM.historyList.innerHTML = '';
  DOM.historyCountBadge.textContent = `${state.history.length} clips`;

  if (state.history.length === 0) {
    DOM.historyList.innerHTML = `
      <div class="empty-history" id="emptyHistoryMsg">
        <i class="fa-solid fa-lines-leaning"></i>
        <p>Generated narrations in this session will appear here for quick replay and download.</p>
      </div>
    `;
    return;
  }

  state.history.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-left">
        <button class="history-play-btn" data-index="${index}" title="Play Clip">
          <i class="fa-solid fa-play"></i>
        </button>
        <div class="history-details">
          <div class="history-snippet">${item.textSnippet}</div>
          <div class="history-meta-sub">
            <span><i class="fa-solid fa-user"></i> ${item.voiceName}</span>
            <span>&bull;</span>
            <span>${item.timestamp}</span>
          </div>
        </div>
      </div>
      <div class="history-actions">
        <button class="btn-ghost-sm history-dl-btn" data-index="${index}" title="Download">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    `;
    DOM.historyList.appendChild(div);
  });

  // Attach event listeners for history actions
  DOM.historyList.querySelectorAll('.history-play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      const item = state.history[idx];
      if (item) {
        DOM.nativeAudio.src = item.url;
        DOM.currentVoiceTitle.textContent = `${item.voiceName} Narration`;
        DOM.currentMetaSubtitle.textContent = `Timestamp: ${item.timestamp}`;
        DOM.audioPlayPauseBtn.disabled = false;
        DOM.audioStopBtn.disabled = false;
        DOM.replayBtn.disabled = false;
        DOM.downloadAudioBtn.disabled = false;
        state.currentAudioBlob = item.blob;
        playAudio();
      }
    });
  });

  DOM.historyList.querySelectorAll('.history-dl-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index);
      const item = state.history[idx];
      if (item) {
        downloadCurrentAudio(item.blob, `elevenlabs-${item.voiceName.toLowerCase()}-${Date.now()}.mp3`);
      }
    });
  });
}

// ==========================================
// 9. Modal & Key Management
// ==========================================

function openModal() {
  DOM.apiKeyInput.value = state.apiKey;
  DOM.apiTestStatus.classList.add('hidden');
  DOM.apiKeyModal.classList.remove('hidden');
  DOM.apiKeyInput.focus();
}

function closeModal() {
  DOM.apiKeyModal.classList.add('hidden');
}

// ==========================================
// 10. Event Listeners Initialization
// ==========================================

function setupEventListeners() {
  // Modal toggles
  DOM.apiKeyBtn.addEventListener('click', openModal);
  DOM.closeModalBtn.addEventListener('click', closeModal);
  DOM.apiKeyModal.addEventListener('click', (e) => {
    if (e.target === DOM.apiKeyModal) closeModal();
  });

  // Toggle API key password visibility
  DOM.toggleKeyVisibility.addEventListener('click', () => {
    const isPassword = DOM.apiKeyInput.type === 'password';
    DOM.apiKeyInput.type = isPassword ? 'text' : 'password';
    DOM.eyeIcon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  });

  // Save API Key
  DOM.saveApiKeyBtn.addEventListener('click', () => {
    const key = DOM.apiKeyInput.value.trim();
    state.apiKey = key;
    if (key) {
      localStorage.setItem('elevenlabs_api_key', key);
      showToast('API Key Saved', 'Key is securely stored in local storage.', 'success');
      fetchVoicesFromApi();
    } else {
      localStorage.removeItem('elevenlabs_api_key');
      showToast('API Key Cleared', 'Key removed from local storage.', 'info');
    }
    updateApiKeyStatus();
    closeModal();
  });

  // Test API Key
  DOM.testApiKeyBtn.addEventListener('click', () => {
    testApiKeyConnection();
  });

  // Remove API Key
  DOM.removeApiKeyBtn.addEventListener('click', () => {
    DOM.apiKeyInput.value = '';
    state.apiKey = '';
    localStorage.removeItem('elevenlabs_api_key');
    updateApiKeyStatus();
    DOM.apiTestStatus.className = 'api-test-status info';
    DOM.apiTestStatus.innerHTML = '<i class="fa-solid fa-info-circle"></i> Key removed.';
    DOM.apiTestStatus.classList.remove('hidden');
    showToast('API Key Removed', 'Removed stored credentials.', 'info');
  });

  // Model Selection Change
  DOM.modelSelect.addEventListener('change', (e) => {
    state.currentModelId = e.target.value;
    const badgeText = e.target.options[e.target.selectedIndex].text.split('(')[0].trim();
    DOM.modelBadge.textContent = badgeText.replace('Eleven', '').trim();
    DOM.modelDescription.textContent = MODEL_DESCRIPTIONS[state.currentModelId] || 'ElevenLabs Neural Speech Model';
  });

  // Voice Selection Change
  DOM.voiceSelect.addEventListener('change', (e) => {
    state.currentVoiceId = e.target.value;
    updateVoiceMeta();
  });

  // Refresh Voices Button
  DOM.refreshVoicesBtn.addEventListener('click', fetchVoicesFromApi);

  // Accordion Toggle
  DOM.toggleVoiceSettings.addEventListener('click', () => {
    DOM.voiceSettingsAccordion.classList.toggle('active');
  });

  // Voice Sliders Display Value Sync
  DOM.stabilitySlider.addEventListener('input', (e) => {
    DOM.stabilityVal.textContent = parseFloat(e.target.value).toFixed(2);
  });
  DOM.similaritySlider.addEventListener('input', (e) => {
    DOM.similarityVal.textContent = parseFloat(e.target.value).toFixed(2);
  });
  DOM.styleSlider.addEventListener('input', (e) => {
    DOM.styleVal.textContent = parseFloat(e.target.value).toFixed(2);
  });

  // Preset Prompts Click
  document.querySelectorAll('.preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const presetKey = pill.dataset.preset;
      if (SAMPLE_PROMPTS[presetKey]) {
        DOM.textInput.value = SAMPLE_PROMPTS[presetKey];
        updateCharAndWordCount();
      }
    });
  });

  // Textarea input monitoring
  DOM.textInput.addEventListener('input', updateCharAndWordCount);

  // Clear text button
  DOM.clearTextBtn.addEventListener('click', () => {
    DOM.textInput.value = '';
    updateCharAndWordCount();
  });

  // Paste text button
  DOM.pasteTextBtn.addEventListener('click', async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      DOM.textInput.value = clipboardText;
      updateCharAndWordCount();
      showToast('Pasted Text', 'Clipboard content pasted.', 'info');
    } catch (err) {
      showToast('Clipboard Notice', 'Please use Ctrl+V / Cmd+V to paste.', 'info');
    }
  });

  // Keyboard shortcut (Ctrl+Enter or Cmd+Enter to generate)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generateSpeech();
    }
    // Spacebar play/pause when not typing in an input
    if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      if (!DOM.audioPlayPauseBtn.disabled) {
        toggleAudioPlayPause();
      }
    }
  });

  // Generate Button Click
  DOM.generateBtn.addEventListener('click', generateSpeech);

  // Player Buttons
  DOM.audioPlayPauseBtn.addEventListener('click', toggleAudioPlayPause);
  DOM.audioStopBtn.addEventListener('click', stopAudio);
  DOM.replayBtn.addEventListener('click', replayAudio);
  DOM.speedBtn.addEventListener('click', cyclePlaybackSpeed);
  DOM.downloadAudioBtn.addEventListener('click', () => downloadCurrentAudio());

  // Volume & Mute
  DOM.volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    DOM.nativeAudio.volume = val;
    if (val === 0) {
      DOM.volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (val < 0.5) {
      DOM.volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
      DOM.volumeIcon.className = 'fa-solid fa-volume-high';
    }
  });

  let previousVolume = 1;
  DOM.muteBtn.addEventListener('click', () => {
    if (DOM.nativeAudio.volume > 0) {
      previousVolume = DOM.nativeAudio.volume;
      DOM.nativeAudio.volume = 0;
      DOM.volumeSlider.value = 0;
      DOM.volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else {
      DOM.nativeAudio.volume = previousVolume || 1;
      DOM.volumeSlider.value = DOM.nativeAudio.volume;
      DOM.volumeIcon.className = 'fa-solid fa-volume-high';
    }
  });

  // Native Audio Events for progress & visualizer
  DOM.nativeAudio.addEventListener('timeupdate', () => {
    const current = DOM.nativeAudio.currentTime;
    const duration = DOM.nativeAudio.duration || 0;
    DOM.currentTimeLabel.textContent = formatTime(current);

    if (duration > 0) {
      const pct = (current / duration) * 100;
      DOM.progressFill.style.width = `${pct}%`;
      DOM.progressHandle.style.left = `${pct}%`;
    }
  });

  DOM.nativeAudio.addEventListener('loadedmetadata', () => {
    state.currentAudioDuration = DOM.nativeAudio.duration;
    DOM.durationLabel.textContent = formatTime(DOM.nativeAudio.duration);
  });

  DOM.nativeAudio.addEventListener('ended', () => {
    state.isPlaying = false;
    DOM.audioPlayPauseIcon.className = 'fa-solid fa-play';
    DOM.playerStatusBadge.className = 'player-status-badge';
    DOM.playerStatusText.textContent = 'Ended';
    DOM.visualizerOverlay.classList.remove('hidden');
  });

  // Progress Bar Seek
  DOM.progressBar.addEventListener('click', (e) => {
    if (!DOM.nativeAudio.duration) return;
    const rect = DOM.progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * DOM.nativeAudio.duration;
    DOM.nativeAudio.currentTime = seekTime;
  });
}

// ==========================================
// 11. App Bootstrap
// ==========================================

function initApp() {
  updateApiKeyStatus();
  populateVoiceSelect();
  updateCharAndWordCount();
  setupEventListeners();

  // Load a welcoming sample prompt by default
  DOM.textInput.value = SAMPLE_PROMPTS.podcast;
  updateCharAndWordCount();

  // Initial visualizer frame
  drawVisualizer();

  // If user already has an API key stored, try auto-syncing online voices silently
  if (state.apiKey) {
    fetchVoicesFromApi().catch(() => {});
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', initApp);
