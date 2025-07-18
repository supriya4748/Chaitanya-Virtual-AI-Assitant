let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

let voices = [];

function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}

// Ensure voices are loaded first
window.speechSynthesis.onvoiceschanged = loadVoices;

function getMaleVoice() {
    return voices.find(v => v.lang.includes('hi-IN') && v.name.toLowerCase().includes('male')) || voices[0];
}

// Toggle GIF Animation
function toggleVoiceAnimation(show) {
    voice.style.display = show ? "block" : "none";
}

// Speak Function with Male Voice Selection
function speak(text, rate = 1, pitch = 1) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = rate;
    text_speak.pitch = pitch;
    text_speak.volume = 1;
    text_speak.lang = "hi-IN";
    text_speak.voice = getMaleVoice();  // Selects male voice if available

    text_speak.onstart = () => toggleVoiceAnimation(true);
    text_speak.onend = () => toggleVoiceAnimation(false);

    window.speechSynthesis.speak(text_speak);
}

// Wish Function
function wishMe() {
    let hours = new Date().getHours();
    let greeting = hours < 12 ? "Good Morning Sir" : hours < 16 ? "Good Afternoon Sir" : "Good Evening Sir";
    speak(greeting);
}

window.addEventListener('load', wishMe);

// Speech Recognition Setup
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

// Speech Recognition Events
recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

// Error Handling
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("Sorry, I didn't catch that.");
    btn.style.display = "flex";
};

recognition.onspeechend = () => {
    recognition.stop();
    btn.style.display = "flex";
    toggleVoiceAnimation(false);
};

// Button Click Event
btn.addEventListener("click", () => {
    try {
        recognition.start();
        btn.style.display = "none";
        toggleVoiceAnimation(true);
    } catch (error) {
        console.error("Speech recognition start error:", error);
        speak("Speech recognition is not supported in your browser.");
    }
});

// Take Command Function
function takeCommand(message) {
    btn.style.display = "flex";
    toggleVoiceAnimation(false);

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello Sir, what can I do for you?");
    } else if (message.includes("who are you") || message.includes("hu r u")) {
        speak("I am Chaitanya, your virtual assistant created by Kushagra Sir.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube.");
        window.open("https://www.youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google.");
        window.open("https://www.google.co.in/", "_blank");
    } else if (message.includes("open linkedin")) {
        speak("Opening LinkedIn.");
        window.open("https://www.linkedin.com/", "_blank");
    } else if (message.includes("open chatgpt")) {
        speak("Opening ChatGPT.");
        window.open("https://chat.openai.com/", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator.");
        window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
        speak("Opening Whatsapp.");
        window.open("whatsapp://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Today's date is ${date}`);
    } else if (message.includes("what's the weather")) {
        speak("Fetching the latest weather update for you...");
        window.open("https://www.google.com/search?q=current+weather", "_blank");
    } else if (message.includes("tell me a joke")) {
        let jokes = [
            "Why don’t scientists trust atoms? Because they make up everything!",
            "What do you call fake spaghetti? An impasta!",
            "Why don’t skeletons fight each other? They don’t have the guts!"
        ];
        let joke = jokes[Math.floor(Math.random() * jokes.length)];
        speak(joke);
    } else if (message.includes("motivate me")) {
        let quotes = [
            "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "The way to get started is to quit talking and begin doing.",
            "Don't watch the clock; do what it does. Keep going."
        ];
        let quote = quotes[Math.floor(Math.random() * quotes.length)];
        speak(quote);
    } else {
        speak(`This is what I found on the internet regarding ${message.replace("chaitanya", "")}`);
        window.open(`https://www.google.com/search?q=${message.replace("chaitanya", "")}`);
    }
}
