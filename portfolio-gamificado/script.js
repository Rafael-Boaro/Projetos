// --- Elementos do Jogo ---
const player = document.querySelector('#player-sprite');
const gameContainer = document.querySelector('#game-container');
const world = document.querySelector('#world');
const platforms = document.querySelectorAll('.platform');
const interactiveObjects = document.querySelectorAll('.interactive-object');
const parallaxLayers = document.querySelectorAll('.background-parallax');
const infoBox = document.querySelector('#info-box');
const closeBtn = document.querySelector('#close-btn');
const interactionTip = document.querySelector('#interaction-tip');
const quizBox = document.querySelector('#quiz-box');
const quizQuestionEl = document.querySelector('#quiz-question');
const quizOptionsEl = document.querySelector('#quiz-options');
const closeQuizBtn = document.querySelector('#close-quiz-btn');
const hiddenBridge = document.querySelector('#hidden-bridge');
const fellScreen = document.querySelector('#fell-screen');
const retryBtn = document.querySelector('#retry-btn');


// --- Dados ---
const infoData = {
    "project-1": { title: "Meus Projetos", description: "Todos os projetos que realizei.", link: "https://github.com/Rafael-Boaro/Projetos" },
    "about-me": { title: "Sobre Mim", description: "Um jovem de 17 anos tentando virar programador", link: "https://www.instagram.com/rafael_pboaro/" },
    "skill-js": { title: "JavaScript", description: "Minha experiência com JavaScript ainda é básica, mas estou sempre buscando evoluir!", link: "" },
    "skill-react": { title: "React", description: "Ainda não tive a oportunidade de me aprofundar em React, mas está nos meus planos de estudo.", link: "#" },
    "contact": { title: "Contato", description: "Envie um email ou mande mensagem para mim.", link: "mailto:rafaelboaro7@gmail.com" }
};

const quizQuestions = [
    { question: "Qual tag HTML é usada para criar um hyperlink?", options: ["<a>", "<link>", "<h1>", "<p>"], correctAnswer: 0, feedback: { correct: "Exato! A tag <a> (âncora) é a base da navegação na web. Sua curiosidade te levará longe!", incorrect: "Quase! A resposta correta é <a>. Mas não se preocupe, até o computador mais potente começou com um 'Hello, World!'." } },
    { question: "Qual propriedade CSS é usada para alterar a cor do texto?", options: ["font-color", "text-color", "color", "background-color"], correctAnswer: 2, feedback: { correct: "Correto! A propriedade 'color' define a cor do conteúdo textual. Você tem um bom olho para os detalhes!", incorrect: "Opa! A propriedade é apenas 'color'. Continue tentando, a persistência é a mãe do código bonito!" } },
    { question: "O que `console.log()` faz em JavaScript?", options: ["Mostra um pop-up", "Registra uma mensagem no console", "Muda o estilo da página", "Cria uma variável"], correctAnswer: 1, feedback: { correct: "Perfeito! `console.log()` é o melhor amigo do dev para depuração. Você sabe como encontrar respostas.", incorrect: "Não exatamente. Ele escreve no console, uma ferramenta super útil! Pense nele como um diário de bordo para o seu código." } },
    { question: "Qual a principal diferença entre um `<div>` e um `<span>`?", options: ["<div> é para imagens, <span> para texto", "Não há diferença", "<div> é um elemento de bloco, <span> é um elemento em linha", "<span> tem mais opções de estilo"], correctAnswer: 2, feedback: { correct: "Isso mesmo! `div` (block) ocupa toda a largura disponível, enquanto `span` (inline) ocupa apenas o espaço necessário. Entender isso é fundamental para o layout!", incorrect: "Essa é uma dúvida comum! A resposta certa é que `div` é um elemento de bloco e `span` é em linha. Saber quando usar cada um é um superpoder do front-end!" } }
];

// --- MUDANÇA 1: EMBARALHAR AS PERGUNTAS NO INÍCIO ---
// Função para embaralhar um array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
    }
}

let shuffledQuizQuestions = [...quizQuestions]; // Cria uma cópia do array original
shuffleArray(shuffledQuizQuestions); // Embaralha a cópia


const animations = {
    idle: { files: ['assets/adventurer-idle-00.png'], speed: 10 },
    run: { files: ['assets/adventurer-run-00.png', 'assets/adventurer-run-01.png', 'assets/adventurer-run-02.png'], speed: 6 },
    jump: { files: ['assets/adventurer-jump-02.png'], speed: 10 },
    fall: { files: ['assets/adventurer-fall-00.png'], speed: 10 }
};
Object.values(animations).forEach(a => a.files.forEach(f => { new Image().src = f; }));

// --- Variáveis de Jogo ---
let state = {
    pos: { x: 50, y: 50 },
    vel: { y: 0 },
    keys: { right: false, left: false },
    direction: 'right',
    onPlatform: true,
    isJumping: false,
    anim: 'idle',
    currentFrame: 0,
    frameCounter: 0,
    camera: { x: 0 },
    quizCompleted: false,
    quizQuestionIndex: 0 
};

const config = {
    speed: 4,
    gravity: 0.65,
    jumpStrength: 16,
    playerWidth: 50,
    playerHeight: 74,
};

// --- Funções Principais ---

function handleMovement() {
    if (state.keys.left) { state.pos.x -= config.speed; state.direction = 'left'; }
    if (state.keys.right) { state.pos.x += config.speed; state.direction = 'right'; }
}

function handlePhysics() {
    if (!state.onPlatform) {
        state.vel.y -= config.gravity;
    }
    state.pos.y += state.vel.y;
}

function handleCollisions() {
    state.onPlatform = false;
    const playerHitbox = {
        left: state.pos.x + 10,
        right: state.pos.x + config.playerWidth - 10,
        top: state.pos.y + config.playerHeight,
        bottom: state.pos.y,
        nextBottom: state.pos.y + state.vel.y,
    };

    let landedOnAPlatform = false;

    platforms.forEach(platform => {
        if (platform.id === 'hidden-bridge' && !platform.classList.contains('visible')) {
            return;
        }
        const pRect = platform.getBoundingClientRect();
        const worldRect = world.getBoundingClientRect();
        const p = {
            left: pRect.left - worldRect.left,
            right: pRect.right - worldRect.left,
            top: gameContainer.clientHeight - pRect.top + worldRect.top,
            bottom: gameContainer.clientHeight - pRect.bottom + worldRect.top,
        };
        
        if (playerHitbox.right > p.left && playerHitbox.left < p.right) {
            if (state.vel.y <= 0 && playerHitbox.bottom >= p.top && playerHitbox.nextBottom <= p.top) {
                state.vel.y = 0;
                state.pos.y = p.top;
                landedOnAPlatform = true;
            }
        }
    });

    if (landedOnAPlatform) {
        state.onPlatform = true;
        state.isJumping = false;
    }

    if (state.pos.y < -150) {
        fellScreen.classList.add('visible');
        return;
    }
}

function updateCamera() {
    const screenWidth = window.innerWidth;
    const worldWidth = world.scrollWidth;
    let targetCameraX = state.pos.x - screenWidth / 2;
    if (targetCameraX < 0) targetCameraX = 0;
    if (targetCameraX > worldWidth - screenWidth) targetCameraX = worldWidth - screenWidth;
    state.camera.x = targetCameraX;

    parallaxLayers.forEach((layer, index) => {
        const speed = (index + 1) * 0.2;
        layer.style.transform = `translateX(-${state.camera.x * speed}px)`;
    });
}

function updateAnimationState() {
    if (state.onPlatform) {
        state.anim = (state.keys.left || state.keys.right) ? 'run' : 'idle';
    } else {
        state.anim = state.vel.y > 0 ? 'jump' : 'fall';
    }
    const anim = animations[state.anim];
    if (!anim) return;
    state.frameCounter++;
    if (state.frameCounter >= anim.speed) {
        state.frameCounter = 0;
        state.currentFrame = (state.currentFrame + 1) % anim.files.length;
        player.src = anim.files[state.currentFrame];
    }
}

function render() {
    player.style.left = state.pos.x + 'px';
    player.style.bottom = state.pos.y + 'px';
    player.style.transform = `scale(2) scaleX(${state.direction === 'left' ? -1 : 1})`;
    world.style.transform = `translateX(-${state.camera.x}px)`;
}

function handleInteractions() {
    let activeInteractiveObject = null;
    const playerBoundingRect = player.getBoundingClientRect();
    interactiveObjects.forEach(obj => {
        const objRect = obj.getBoundingClientRect();
        if (playerBoundingRect.left < objRect.right && playerBoundingRect.right > objRect.left &&
            playerBoundingRect.top < objRect.bottom && playerBoundingRect.bottom > objRect.top) {
            activeInteractiveObject = obj;
        }
    });
    
    if (activeInteractiveObject) {
        interactionTip.style.display = 'block';
        const objRect = activeInteractiveObject.getBoundingClientRect();
        interactionTip.style.left = (objRect.left + (objRect.width / 2) - (interactionTip.offsetWidth / 2)) + 'px';
        interactionTip.style.top = (objRect.top - 30) + 'px';
        interactionTip.dataset.activeKey = activeInteractiveObject.dataset.infoKey;
        
        if (activeInteractiveObject.id === 'quiz-master') {
            if (state.quizQuestionIndex >= shuffledQuizQuestions.length) {
                interactionTip.innerText = 'Desafio Concluído!';
            } else {
                interactionTip.innerText = 'Pressione E para um Desafio';
            }
        } else {
            interactionTip.innerText = 'Pressione E';
        }
    } else {
        interactionTip.style.display = 'none';
        delete interactionTip.dataset.activeKey;
    }
}

function startQuiz() {
    if (state.quizQuestionIndex >= shuffledQuizQuestions.length) {
        showFeedback("Parabéns!", "Você respondeu todas as perguntas e completou o desafio!", "success");
        return;
    }

    const questionData = shuffledQuizQuestions[state.quizQuestionIndex];
    
    quizQuestionEl.innerText = questionData.question;
    quizOptionsEl.innerHTML = ''; 

    questionData.options.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.innerText = optionText;
        button.addEventListener('click', () => selectAnswer(index, questionData));
        quizOptionsEl.appendChild(button);
    });

    quizBox.classList.add('visible');
}

function selectAnswer(selectedIndex, questionData) {
    quizBox.classList.remove('visible');
    const isCorrect = selectedIndex === questionData.correctAnswer;

    if (isCorrect) {
        state.quizQuestionIndex++; 
        
        if (state.quizQuestionIndex >= shuffledQuizQuestions.length) {
            showFeedback("Resposta Correta!", "Você concluiu o desafio! Uma ponte apareceu para você continuar.", "success");
            hiddenBridge.classList.add('visible'); 
            state.quizCompleted = true;
        } else {
            showFeedback("Resposta Correta!", questionData.feedback.correct, "success");
        }
    } else {
        showFeedback("Ops, não foi dessa vez!", questionData.feedback.incorrect, "error");
    }
}

function closeQuiz() { quizBox.classList.remove('visible'); }

function showFeedback(title, description, type) {
    infoBox.querySelector('#info-title').innerText = title;
    infoBox.querySelector('#info-description').innerText = description;
    infoBox.querySelector('#info-link').style.display = 'none';
    infoBox.style.borderColor = type === 'success' ? '#228B22' : '#B22222';
    infoBox.classList.add('visible');
}

function resetPlayer() {
    // Redefine completamente o estado do jogador para o inicial
    state.pos = { x: 50, y: 50 };
    state.vel = { y: 0 };
    state.keys = { right: false, left: false };
    state.direction = 'right';
    state.onPlatform = true;
    state.isJumping = false;
    state.anim = 'idle';
    state.currentFrame = 0;

    // Se o jogo reiniciar, o quiz também reinicia
    shuffledQuizQuestions = [...quizQuestions];
    shuffleArray(shuffledQuizQuestions);
    state.quizQuestionIndex = 0;
    state.quizCompleted = false;
    hiddenBridge.classList.remove('visible');
    
    // Esconde a tela de queda
    fellScreen.classList.remove('visible');
}

// --- Loop Principal e Eventos ---
function gameLoop() {
    handleMovement();
    handlePhysics();
    handleCollisions();
    updateAnimationState();
    updateCamera();
    handleInteractions();
    render();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') state.keys.left = true;
    if (e.key === 'ArrowRight') state.keys.right = true;
    if (e.code === 'Space' && state.onPlatform && !state.isJumping) {
        state.vel.y = config.jumpStrength;
        state.isJumping = true;
    }
    
    if (e.key.toLowerCase() === 'e' && interactionTip.style.display === 'block') {
        const key = interactionTip.dataset.activeKey;
        if (key === 'quiz-master') {
            startQuiz();
        } 
        else if (key && infoData[key]) {
            const data = infoData[key];
            document.querySelector('#info-title').innerText = data.title;
            document.querySelector('#info-description').innerText = data.description;
            const linkElement = document.querySelector('#info-link');
            if (data.link && data.link !== "" && data.link !== "#") {
                linkElement.href = data.link;
                linkElement.style.display = 'inline-block';
            } else {
                linkElement.style.display = 'none';
            }
            infoBox.classList.add('visible');
        }
    }
});

window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') state.keys.left = false;
    if (e.key === 'ArrowRight') state.keys.right = false;
});

closeQuizBtn.addEventListener('click', closeQuiz);
closeBtn.addEventListener('click', () => {
    infoBox.classList.remove('visible');
    infoBox.style.borderColor = '#333';
});
retryBtn.addEventListener('click', resetPlayer);

// --- Início do Jogo ---
player.src = animations.idle.files[0];
requestAnimationFrame(gameLoop);