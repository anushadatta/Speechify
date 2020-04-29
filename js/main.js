// Initialise Web Speech API
const synth = window.speechSynthesis;

// Query DOM Elements 
const textForm = document.querySelector("form");
const textInput = document.getElementById("text-input");
const rate = document.getElementById("rate");
const rateValue = document.getElementById("rate-value");
const pitch = document.getElementById("pitch");
const pitchValue = document.getElementById("pitch-value");
const accentSelect = document.getElementById("voice-select");
const body = document.querySelector('body');

// API call to query accents
let accents = [];

const getAccents = () => {
    accents = synth.getVoices();

    // Create accents drop down
    accents.forEach(a => {
        const choice = document.createElement('option');

        // Specify voice and language for choice
        choice.textContent = a.name + ' (' + a.lang + ')';

        // Set attributes for choice
        choice.setAttribute('lang', a.lang);
        choice.setAttribute('name', a.name);

        accentSelect.appendChild(choice);
    });
}

// for async API call
getAccents();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getAccents;
}

// Speech synthesis 
const speech = () => {

    // Check if already speaking
    if (synth.speaking) {
        console.error('Already speaking..');
        return;
    }

    // Check for empty text input
    if (textInput.value !== '') {

        // Speech waves
        body.style.background = '#0099CC url(assets/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '50% 12%';

        // Pass text for speech
        const speak = new SpeechSynthesisUtterance(textInput.value);

        // End of speech
        speak.onend = e => {
            console.log('End of speech');
            body.style.background = '#0099CC';
        }

        // Speech error
        speak.onerror = e => {
            console.log('Something went wrong');
        }

        // Selected choice of accent
        const selectedVoice = accentSelect.selectedOptions[0].getAttribute('name');

        accents.forEach(a => {
            if (a.name === selectedVoice) {
                // Set selected voice for speech
                speak.voice = a;
            }
        });

        // Set pitch and rate
        speak.rate = rate.value;
        speak.pitch = pitch.value;

        // Speak
        synth.speak(speak);
    }
}

// Event Listeners

// Synthesis button
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speech();
});

// Rate and Pitch
rate.addEventListener('change', e => rateValue.textContent = rate.value);
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);