// ==================== INITIALIZATION ====================
const CORRECT_PIN = "Ma Henry Ka Kaka Hu Gate Khul";
const WHATSAPP_NUMBER = "923443066788";
const CORRECT_SCORE = 500;
const WRONG_SCORE = -0;
const TOTAL_ROUNDS = 5;
const QUESTIONS_PER_ROUND = 2;

// State
let currentRound = 1;
let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let audioContext = null;
let isMuted = true;
let gameCompleted = false;

// Quiz Data
const quizData = [
    // Round 1
    [{
        question: "Konsiii Datee Ko Humara Relation Hua Tha?",
        options: ["Dec, 18, 2020", "Sep, 06, 2023", "Feb, 14, 2025"],
        correct: 1,
        romantic: "Every day with you is a love confession!"
    }, {
        question: "Konsii Cheez Mujee Subse Zaida Pasnad Hai Tujmay?",
        options: ["Your Beautiful Smile", "Your Kind Heart", "Everything About Uh"],
        correct: 2,
        romantic: "How could I choose just one thing?"
    }],
    // Round 2
    [{
        question: "Hum Bestieee Konsiii Dateee Ko Bananeee Thay?",
        options: ["Apr, 20, 2020", "May, 30, 2024", "Nov, 10, 2021"],
        correct: 0,
        romantic: "You're my favorite destination!"
    }, {
        question: "Mujeee Subse Zaidaaa Fast Food May Kia Pasand Hai?",
        options: ["Pizza", "Zinger Burger", "Pasta"],
        correct: 1,
        romantic: "You're my first thought every day!"
    }],
    // Round 3
    [{
        question: "First Meetupp Pay Meinee Konse Color Ka Dress Peena Tha?",
        options: ["Red & Yellow", "Blue & Gray", "Black & White"],
        correct: 2,
        romantic: "Your heart is my greatest treasure!"
    }, {
        question: "Meriii Fav Car Konsiii Hai?",
        options: ["Roll Royce", "BMW", "Ferrari"],
        correct: 0,
        romantic: "It's the little things that mean everything!"
    }],
    // Round 4
    [{
        question: "Third Meetup Ki Asiii Konsiii Chezz Thi Jo Meri Fav Hai?",
        options: ["Tujeee Kamar Se Pakarna", "Tera Bike Pay Mujeee Back Se Hug Karna", "Teraa Dubata Set Karna"],
        correct: 1,
        romantic: "A million promises, all for you!"
    }, {
        question: "Konsaaa Din Thaaa Jo Meraaa Subsee Fav Hai 2025 Ka Ma Busss Dates Batau Ga Us Din Kia Hua Khud Yaad Kar?",
        options: ["1st Jan", "14th Feb", "11th Nov"],
        correct: 2,
        romantic: "You are my universe!"
    }],
    // Round 5
    [{
        question: "Humariii Firstt Timee Kisss Kab Hoi Thii?",
        options: ["Jab Hum Koone May Thay", "Jab Hum Chaat Pay Thay", "Kabiii Nhhh"],
        correct: 2,
        romantic: "You're my best decision, every single day!"
    }, {
        question: "Ma Tujseee Kitnaaaa Pyrrrr Kartaaa Hu?",
        options: ["Jitnaa Ek Husband Wife Se Karta", "Meree Papa Jitnaaa", "Is Duniyaaaa May Subseee Zaidaaaa"],
        correct: 2,
        romantic: "Every celebration is better with you!"
    }]
];

// ==================== AUDIO SYSTEM ====================
function initAudio() {
    if (!audioContext) {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(frequency, duration, type = 'sine', volume = 0.1) {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playCorrectSound() {
    playTone(523.25, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.1), 100);
    setTimeout(() => playTone(783.99, 0.15, 'sine', 0.1), 200);
}

function playWrongSound() {
    playTone(200, 0.2, 'square', 0.08);
    setTimeout(() => playTone(150, 0.3, 'square', 0.08), 150);
}

function playClickSound() {
    playTone(800, 0.05, 'sine', 0.05);
}

function playSuccessSound() {
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50];
    notes.forEach((note, i) => {
        setTimeout(() => playTone(note, 0.15, 'sine', 0.08), i * 80);
    });
}

// ==================== BACKGROUND PARTICLES ====================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor(window.innerWidth / 15));

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            radius: Math.max(0.5, Math.random() * 2),
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '#d4a574' : '#c45c5c'
        });
    }
}

function animateParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = bgCanvas.width;
        if (p.x > bgCanvas.width) p.x = 0;
        if (p.y < 0) p.y = bgCanvas.height;
        if (p.y > bgCanvas.height) p.y = 0;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        bgCtx.fillStyle = p.color;
        bgCtx.globalAlpha = p.opacity;
        bgCtx.fill();
    });

    bgCtx.globalAlpha = 1;

    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                bgCtx.beginPath();
                bgCtx.moveTo(p1.x, p1.y);
                bgCtx.lineTo(p2.x, p2.y);
                bgCtx.strokeStyle = '#d4a574';
                bgCtx.globalAlpha = (1 - dist / 100) * 0.1;
                bgCtx.stroke();
            }
        });
    });

    bgCtx.globalAlpha = 1;
    animationId = requestAnimationFrame(animateParticles);
}

// ==================== CONFETTI SYSTEM ====================
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confetti = [];
let confettiActive = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function createConfetti(intensity = 100) {
    confetti = [];
    const colors = ['#d4a574', '#f0c987', '#c45c5c', '#e07070', '#ffffff', '#ffd700'];

    for (let i = 0; i < intensity; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: -20,
            w: Math.max(5, Math.random() * 12),
            h: Math.max(5, Math.random() * 12),
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 3 + 2,
            vx: (Math.random() - 0.5) * 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    confettiActive = true;
}

function animateConfetti() {
    if (!confettiActive) return;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confetti.forEach((c, index) => {
        c.y += c.vy;
        c.x += c.vx;
        c.rotation += c.rotationSpeed;

        confettiCtx.save();
        confettiCtx.translate(c.x, c.y);
        confettiCtx.rotate(c.rotation * Math.PI / 180);
        confettiCtx.fillStyle = c.color;
        confettiCtx.fillRect(-c.w / 2, -c.h / 2, Math.max(1, c.w), Math.max(1, c.h));
        confettiCtx.restore();

        if (c.y > confettiCanvas.height + 20) {
            confetti.splice(index, 1);
        }
    });

    if (confetti.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiActive = false;
    }
}

function triggerCelebration() {
    createConfetti(150);
    animateConfetti();
    playSuccessSound();
}

// ==================== PAGE NAVIGATION ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// ==================== LOGIN HANDLER ====================
function handleLogin() {
    const pinInput = document.getElementById('pinInput');
    const errorMsg = document.getElementById('errorMsg');
    const card = document.querySelector('#loginPage .glass-card');

    if (pinInput.value === CORRECT_PIN) {
        playCorrectSound();
        card.classList.add('focused');
        setTimeout(() => {
            showPage('loadingPage');
            startLoading();
        }, 500);
    } else {
        playWrongSound();
        errorMsg.classList.add('show');
        pinInput.style.borderColor = 'var(--rose)';

        setTimeout(() => {
            errorMsg.classList.remove('show');
            pinInput.style.borderColor = '';
        }, 3000);
    }
}

// ==================== LOADING SEQUENCE ====================
function startLoading() {
    const loadingText = document.getElementById('loadingText');
    const progressFill = document.getElementById('progressFill');

    const messages = [{
        text: "Initializing secure connection...",
        progress: 20
    }, {
        text: "Verifying identity...",
        progress: 40
    }, {
        text: "Checking if you're truly Henry's Wife...",
        progress: 60
    }, {
        text: "Access Granted!",
        progress: 100
    }];

    let index = 0;

    function updateLoading() {
        if (index < messages.length) {
            loadingText.style.opacity = 0;

            setTimeout(() => {
                loadingText.textContent = messages[index].text;
                loadingText.style.opacity = 1;
                progressFill.style.width = messages[index].progress + '%';
                index++;

                if (index < messages.length) {
                    setTimeout(updateLoading, 1200);
                } else {
                    setTimeout(() => {
                        showPage('rulesPage');
                        playSuccessSound();
                    }, 1000);
                }
            }, 200);
        }
    }

    updateLoading();
}

// ==================== QUIZ SYSTEM ====================
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    const roundQuestions = quizData[currentRound - 1];

    container.innerHTML = '';

    roundQuestions.forEach((q, qIndex) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card fade-in';
        questionCard.style.animationDelay = (qIndex * 0.2) + 's';
        questionCard.id = `question-${qIndex}`;

        let optionsHTML = '';
        q.options.forEach((opt, optIndex) => {
            optionsHTML += `
                        <button class="option-btn" data-question="${qIndex}" data-option="${optIndex}">
                            ${opt}
                        </button>
                    `;
        });

        questionCard.innerHTML = `
                    <div class="question-number">Question ${(currentRound - 1) * 2 + qIndex + 1}</div>
                    <div class="question-text">${q.question}</div>
                    <div class="options-grid">
                        ${optionsHTML}
                    </div>
                `;

        container.appendChild(questionCard);
    });

    // Add event listeners to options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleOptionClick);
    });

    updateRoundBadge();
}

function handleOptionClick(e) {
    const btn = e.target;
    if (btn.classList.contains('disabled')) return;

    playClickSound();

    const qIndex = parseInt(btn.dataset.question);
    const optIndex = parseInt(btn.dataset.option);
    const question = quizData[currentRound - 1][qIndex];
    const isCorrect = optIndex === question.correct;

    // Disable all options for this question
    const questionCard = document.getElementById(`question-${qIndex}`);
    const options = questionCard.querySelectorAll('.option-btn');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === question.correct) {
            opt.classList.add('correct');
        }
    });

    btn.classList.add('selected');

    if (isCorrect) {
        score += CORRECT_SCORE;
        correctAnswers++;
        playCorrectSound();
    } else {
        score += WRONG_SCORE;
        wrongAnswers++;
        btn.classList.add('wrong');
        playWrongSound();
    }

    updateScore();
    checkRoundComplete();
}

function updateScore() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `PKR ${Math.max(0, score).toLocaleString()}`;
}

function updateRoundBadge() {
    document.getElementById('roundBadge').textContent = `Round ${currentRound} of ${TOTAL_ROUNDS}`;
}

function checkRoundComplete() {
    const roundQuestions = quizData[currentRound - 1];
    const allAnswered = roundQuestions.every((_, i) => {
        const card = document.getElementById(`question-${i}`);
        return card && card.querySelectorAll('.disabled').length === 3;
    });

    if (allAnswered) {
        setTimeout(showRoundComplete, 500);
    }
}

function showRoundComplete() {
    const modal = document.getElementById('roundModal');
    const modalAmount = document.getElementById('modalAmount');

    modalAmount.textContent = `PKR ${Math.max(0, score).toLocaleString()}`;
    modal.classList.add('active');

    triggerCelebration();
}

function nextRound() {
    const modal = document.getElementById('roundModal');
    modal.classList.remove('active');

    if (currentRound < TOTAL_ROUNDS) {
        currentRound++;
        renderQuestions();
        document.getElementById('nextRoundBtn').style.display = 'none';
    } else {
        showResults();
    }
}

// ==================== RESULTS ====================
function showResults() {
    showPage('resultPage');

    const finalAmount = document.getElementById('finalAmount');
    const correctCount = document.getElementById('correctCount');
    const wrongCount = document.getElementById('wrongCount');
    const romanticText = document.getElementById('romanticText');

    // Animate counter
    let displayScore = 0;
    const targetScore = Math.max(0, score);
    const increment = Math.ceil(targetScore / 50);

    const counter = setInterval(() => {
        displayScore += increment;
        if (displayScore >= targetScore) {
            displayScore = targetScore;
            clearInterval(counter);
        }
        finalAmount.textContent = `PKR ${displayScore.toLocaleString()}`;
    }, 30);

    correctCount.textContent = correctAnswers;
    wrongCount.textContent = wrongAnswers;

    // Set romantic message based on score
    if (score >= 5000) {
        romanticText.textContent = "Wahhh Januuu Niceee Tu Mujeee Subsee Axheee Se Jantiii Hai Sub Answersss Sahiii Loveeeeee Uhhhh Sooo Muxhhh Kakayyy..!!!!";
    } else if (score >= 4000) {
        romanticText.textContent = "Koi Baaaat Nh Januuu Bussss Scoree Koi Matterr Nh Kartaaa... Uhhh R Alreadyyy Ownerrr Of My Hearttt Loveeeeee Uhhhh...!!!";
    } else {
        romanticText.textContent = "Januuuu Itnee Sareee Answerss Galattt Khairrr Koi Baaat Nh Kakayyy Well Play.... Loveeeee Uhhhh Munayyyyy";
    }

    setTimeout(triggerCelebration, 500);

    // Save completion state
    localStorage.setItem('eidGameCompleted', 'true');
    gameCompleted = true;
}

// ==================== WHATSAPP INTEGRATION ====================
function sendToWhatsApp() {
    const message = `Januuuu Meinee Gameee Win Karliiii! Merii Eidii PKR ${Math.max(0, score).toLocaleString()}/= Hai Ab Dedeee...!!!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ==================== PREVENTIONS ====================
function setupPreventions() {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Warn on refresh
    window.addEventListener('beforeunload', (e) => {
        if (gameCompleted) return;
        const message = 'Are you sure you want to leave? Your progress will be lost!';
        e.returnValue = message;
        return message;
    });
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Login
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('pinInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Start game
    document.getElementById('startGameBtn').addEventListener('click', () => {
        playClickSound();
        showPage('quizPage');
        renderQuestions();
    });

    // Continue after round
    document.getElementById('continueBtn').addEventListener('click', () => {
        playClickSound();
        nextRound();
    });

    // WhatsApp
    document.getElementById('whatsappBtn').addEventListener('click', sendToWhatsApp);

    // Music toggle
    document.getElementById('musicToggle').addEventListener('click', () => {
        isMuted = !isMuted;
        document.getElementById('musicToggle').classList.toggle('muted', isMuted);

        if (!isMuted) {
            initAudio();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }
    });

    // Window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        resizeConfettiCanvas();
        createParticles();
    });
}

// ==================== INIT ====================
function init() {
    // Check if already completed
    if (localStorage.getItem('eidGameCompleted') === 'true') {
        // Allow replay after clearing
        localStorage.removeItem('eidGameCompleted');
    }

    resizeCanvas();
    resizeConfettiCanvas();
    createParticles();
    animateParticles();
    setupPreventions();
    setupEventListeners();

    // Add focus effect to login card
    const pinInput = document.getElementById('pinInput');
    const loginCard = document.querySelector('#loginPage .glass-card');

    pinInput.addEventListener('focus', () => loginCard.classList.add('focused'));
    pinInput.addEventListener('blur', () => loginCard.classList.remove('focused'));
}

// Start the app
document.addEventListener('DOMContentLoaded', init);