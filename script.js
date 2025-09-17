// Variables globales
let gameState = {
    score: 0,
    currentQuestion: 0,
    totalQuestions: 10,
    timeLeft: 30,
    timer: null,
    difficulty: 'facil',
    puzzleSize: 3,
    selectedImage: null,
    questions: [],
    earnedPieces: [],
    puzzleGrid: []
};

// Banco de preguntas sobre Cliente/Servidor
const questionBank = {
    facil: [
        {
            question: "¿Qué es un servidor web?",
            options: ["Un programa que almacena y sirve páginas web", "Un tipo de navegador", "Un lenguaje de programación", "Un sistema operativo"],
            correct: 0
        },
        {
            question: "¿Qué significa HTTP?",
            options: ["HyperText Transfer Protocol", "High Tech Transfer Program", "Home Text Transfer Protocol", "HyperText Terminal Protocol"],
            correct: 0
        },
        {
            question: "¿Cuál es el puerto por defecto para HTTP?",
            options: ["21", "25", "80", "443"],
            correct: 2
        },
        {
            question: "¿Qué es un cliente en la arquitectura cliente-servidor?",
            options: ["El servidor", "La aplicación que solicita servicios", "La base de datos", "El protocolo de comunicación"],
            correct: 1
        },
        {
            question: "¿Qué método HTTP se usa para obtener datos?",
            options: ["POST", "GET", "PUT", "DELETE"],
            correct: 1
        },
        {
            question: "¿Qué es una API?",
            options: ["Application Programming Interface", "Advanced Programming Integration", "Automatic Program Interface", "Application Process Integration"],
            correct: 0
        },
        {
            question: "¿Cuál es el puerto por defecto para HTTPS?",
            options: ["80", "443", "21", "22"],
            correct: 1
        },
        {
            question: "¿Qué es un DNS?",
            options: ["Domain Name System", "Data Network Service", "Digital Name Server", "Dynamic Network System"],
            correct: 0
        },
        {
            question: "¿Qué protocolo se usa para transferir archivos?",
            options: ["HTTP", "SMTP", "FTP", "TCP"],
            correct: 2
        },
        {
            question: "¿Qué significa URL?",
            options: ["Uniform Resource Locator", "Universal Resource Link", "Unique Resource Location", "United Resource Locator"],
            correct: 0
        }
    ],
    medio: [
        {
            question: "¿Qué es un middleware en el desarrollo web?",
            options: ["Un tipo de base de datos", "Software que conecta componentes de aplicaciones", "Un protocolo de red", "Un lenguaje de programación"],
            correct: 1
        },
        {
            question: "¿Cuál es la diferencia principal entre GET y POST?",
            options: ["GET es más rápido", "GET envía datos en la URL, POST en el cuerpo", "POST es más seguro siempre", "No hay diferencia"],
            correct: 1
        },
        {
            question: "¿Qué es REST en el contexto de APIs?",
            options: ["Representational State Transfer", "Rapid Exchange Service Technology", "Remote Execute Service Transfer", "Reliable Enhanced Service Transfer"],
            correct: 0
        },
        {
            question: "¿Qué código de estado HTTP indica éxito?",
            options: ["404", "500", "200", "302"],
            correct: 2
        },
        {
            question: "¿Qué es un proxy server?",
            options: ["Un tipo de base de datos", "Un servidor que actúa como intermediario", "Un protocolo de seguridad", "Un lenguaje de consulta"],
            correct: 1
        },
        {
            question: "¿Qué protocolo usa HTTPS para el cifrado?",
            options: ["FTP", "SSL/TLS", "SMTP", "TCP"],
            correct: 1
        },
        {
            question: "¿Qué es un load balancer?",
            options: ["Un tipo de servidor web", "Distribuye el tráfico entre varios servidores", "Un protocolo de red", "Una base de datos"],
            correct: 1
        },
        {
            question: "¿Qué significa CORS?",
            options: ["Cross-Origin Resource Sharing", "Common Object Request System", "Centralized Origin Resource Service", "Cross-Object Resource Security"],
            correct: 0
        },
        {
            question: "¿Qué es JSON?",
            options: ["Java Standard Object Notation", "JavaScript Object Notation", "Java Secure Object Network", "JavaScript Organized Network"],
            correct: 1
        },
        {
            question: "¿Qué método HTTP se usa para actualizar recursos?",
            options: ["GET", "POST", "PUT", "DELETE"],
            correct: 2
        }
    ],
    dificil: [
        {
            question: "¿Qué es el patrón MVC en desarrollo web?",
            options: ["Model-View-Controller", "Multi-Version Control", "Master-Virtual-Client", "Modern-Visual-Component"],
            correct: 0
        },
        {
            question: "¿Qué es un WebSocket?",
            options: ["Un protocolo para comunicación bidireccional en tiempo real", "Un tipo de servidor web", "Una base de datos", "Un framework de JavaScript"],
            correct: 0
        },
        {
            question: "¿Qué es GraphQL?",
            options: ["Un tipo de base de datos", "Un lenguaje de consulta para APIs", "Un framework web", "Un protocolo de red"],
            correct: 1
        },
        {
            question: "¿Qué es un microservicio?",
            options: ["Un servidor muy pequeño", "Arquitectura donde la aplicación se divide en servicios independientes", "Un tipo de base de datos", "Un protocolo de comunicación"],
            correct: 1
        },
        {
            question: "¿Qué es OAuth?",
            options: ["Open Authorization framework", "Object Authentication", "Organized Access Control", "Optimal Auth Protocol"],
            correct: 0
        },
        {
            question: "¿Qué es un CDN?",
            options: ["Central Data Network", "Content Delivery Network", "Centralized Domain Name", "Common Data Node"],
            correct: 1
        },
        {
            question: "¿Qué es el patrón Singleton en programación?",
            options: ["Un patrón que asegura una sola instancia de una clase", "Un tipo de base de datos", "Un protocolo de red", "Un framework web"],
            correct: 0
        },
        {
            question: "¿Qué es Docker en el contexto de despliegue?",
            options: ["Un lenguaje de programación", "Plataforma de contenedores", "Un tipo de servidor", "Una base de datos"],
            correct: 1
        },
        {
            question: "¿Qué es Redis?",
            options: ["Un framework web", "Un sistema de base de datos en memoria", "Un protocolo de red", "Un lenguaje de programación"],
            correct: 1
        },
        {
            question: "¿Qué es el patrón Repository en desarrollo?",
            options: ["Un tipo de base de datos", "Patrón que encapsula la lógica de acceso a datos", "Un protocolo de red", "Un framework web"],
            correct: 1
        }
    ]
};

// Sonidos mejorados usando Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function createBeep(frequency, duration, type = 'sine', volume = 0.3) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function playCorrectSound() {
    // Sonido de éxito - melodía ascendente
    createBeep(523.25, 0.15); // Do
    setTimeout(() => createBeep(659.25, 0.15), 150); // Mi
    setTimeout(() => createBeep(783.99, 0.2), 300); // Sol
}

function playIncorrectSound() {
    // Sonido de error - tono descendente
    createBeep(311.13, 0.3, 'square'); // Mi bemol
    setTimeout(() => createBeep(246.94, 0.4, 'square'), 200); // Si
}

function playTickSound() {
    // Tick del reloj
    createBeep(800, 0.05, 'square', 0.1);
}

function playStartSound() {
    // Sonido de inicio
    createBeep(440, 0.2); // La
    setTimeout(() => createBeep(554.37, 0.2), 200); // Do#
    setTimeout(() => createBeep(659.25, 0.3), 400); // Mi
}

function playPieceSound() {
    // Sonido al colocar pieza correctamente
    createBeep(880, 0.1); // La agudo
}

function playWrongPieceSound() {
    // Sonido al colocar pieza incorrectamente
    createBeep(220, 0.2, 'sawtooth'); // La grave
}

function playVictorySound() {
    // Fanfarria de victoria
    createBeep(523.25, 0.2); // Do
    setTimeout(() => createBeep(659.25, 0.2), 200); // Mi
    setTimeout(() => createBeep(783.99, 0.2), 400); // Sol
    setTimeout(() => createBeep(1046.50, 0.4), 600); // Do octava
}

function startGame() {
    const fileInput = document.getElementById('image-upload');
    if (!fileInput.files[0]) {
        alert('Por favor selecciona una imagen para el rompecabezas');
        return;
    }

    gameState.puzzleSize = parseInt(document.getElementById('puzzle-size').value);
    gameState.difficulty = document.getElementById('difficulty').value;
    gameState.totalQuestions = parseInt(document.getElementById('questions-count').value);
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        gameState.selectedImage = e.target.result;
        initializeGame();
    };
    reader.readAsDataURL(file);
}

function initializeGame() {
    gameState.score = 0;
    gameState.currentQuestion = 0;
    gameState.earnedPieces = [];
    
    const questions = [...questionBank[gameState.difficulty]];
    gameState.questions = [];
    
    for (let i = 0; i < gameState.totalQuestions && questions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        gameState.questions.push(questions.splice(randomIndex, 1)[0]);
    }

    const totalPieces = gameState.puzzleSize * gameState.puzzleSize;
    gameState.puzzleGrid = new Array(totalPieces).fill(null);

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    updateGameUI();
    createPuzzleGrid();
    loadNextQuestion();

    playStartSound();
}

function updateGameUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('question-counter').textContent = gameState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = gameState.totalQuestions;
}

function createPuzzleGrid() {
    const puzzleArea = document.getElementById('puzzle-area');
    puzzleArea.innerHTML = '';
    puzzleArea.style.gridTemplateColumns = `repeat(${gameState.puzzleSize}, 1fr)`;
    
    const totalPieces = gameState.puzzleSize * gameState.puzzleSize;
    
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece empty';
        piece.dataset.position = i;
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragover', handleDragOver);
        puzzleArea.appendChild(piece);
    }
}

function updateClockHand(timeLeft) {
    const clockHand = document.getElementById('clock-hand');
    const percentage = (30 - timeLeft) / 30;
    const degrees = percentage * 360;
    clockHand.style.transform = `rotate(${degrees}deg)`;
}

function loadNextQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length) {
        endGame();
        return;
    }

    const question = gameState.questions[gameState.currentQuestion];
    
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });

    gameState.timeLeft = 30;
    updateTimer();
    updateClockHand(gameState.timeLeft);
    gameState.timer = setInterval(() => {
        updateTimer();
        updateClockHand(gameState.timeLeft);
        if (gameState.timeLeft % 5 === 0 && gameState.timeLeft > 0) {
            playTickSound();
        }
    }, 1000);

    document.getElementById('feedback').classList.add('hidden');
}

function updateTimer() {
    gameState.timeLeft--;
    document.getElementById('timer').textContent = gameState.timeLeft;
    
    if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timer);
        selectAnswer(-1);
    }
}

function selectAnswer(selectedIndex) {
    clearInterval(gameState.timer);
    
    const question = gameState.questions[gameState.currentQuestion];
    const feedback = document.getElementById('feedback');
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        gameState.score += 100;
        feedback.className = 'feedback correct';
        feedback.textContent = '¡Correcto! +100 puntos';
        
        givePuzzlePiece();
        playCorrectSound();
        
    } else {
        gameState.score = Math.max(0, gameState.score - 50);
        feedback.className = 'feedback incorrect';
        
        if (selectedIndex === -1) {
            feedback.textContent = '¡Tiempo agotado! -50 puntos';
        } else {
            feedback.textContent = `Incorrecto. La respuesta correcta era: ${question.options[question.correct]}. -50 puntos`;
        }
        
        playIncorrectSound();
    }
    
    feedback.classList.remove('hidden');
    updateGameUI();
    
    gameState.currentQuestion++;
    
    setTimeout(() => {
        loadNextQuestion();
    }, 3000);
}

function givePuzzlePiece() {
    const pieceIndex = gameState.earnedPieces.length;
    const totalPieces = gameState.puzzleSize * gameState.puzzleSize;
    
    if (pieceIndex < totalPieces) {
        gameState.earnedPieces.push(pieceIndex);
        createInventoryPiece(pieceIndex);
    }
}

function createInventoryPiece(pieceIndex) {
    const inventory = document.getElementById('piece-inventory');
    
    if (inventory.textContent.includes('Piezas obtenidas')) {
        inventory.innerHTML = '';
    }
    
    const piece = document.createElement('div');
    piece.className = 'inventory-piece';
    piece.draggable = true;
    piece.dataset.pieceIndex = pieceIndex;
    
    const row = Math.floor(pieceIndex / gameState.puzzleSize);
    const col = pieceIndex % gameState.puzzleSize;
    
    piece.style.backgroundImage = `url(${gameState.selectedImage})`;
    piece.style.backgroundPosition = `${-col * 60}px ${-row * 60}px`;
    piece.style.backgroundSize = `${gameState.puzzleSize * 60}px ${gameState.puzzleSize * 60}px`;
    
    piece.addEventListener('dragstart', handleDragStart);
    piece.addEventListener('dragend', handleDragEnd);
    
    inventory.appendChild(piece);
    
    piece.classList.add('pulse');
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.pieceIndex);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const pieceIndex = e.dataTransfer.getData('text/plain');
    const targetPosition = parseInt(e.target.dataset.position);
    
    if (parseInt(pieceIndex) === targetPosition) {
        placePuzzlePiece(targetPosition, pieceIndex);
        removePieceFromInventory(pieceIndex);
        playPieceSound();
        checkPuzzleComplete();
    } else {
        playWrongPieceSound();
    }
}

function placePuzzlePiece(position, pieceIndex) {
    const puzzlePiece = document.querySelector(`.puzzle-piece[data-position="${position}"]`);
    
    const row = Math.floor(position / gameState.puzzleSize);
    const col = position % gameState.puzzleSize;
    
    puzzlePiece.style.backgroundImage = `url(${gameState.selectedImage})`;
    puzzlePiece.style.backgroundPosition = `${-col * (400/gameState.puzzleSize)}px ${-row * (400/gameState.puzzleSize)}px`;
    puzzlePiece.style.backgroundSize = `400px 400px`;
    puzzlePiece.classList.remove('empty');
    
    gameState.puzzleGrid[position] = pieceIndex;
}

function removePieceFromInventory(pieceIndex) {
    const piece = document.querySelector(`.inventory-piece[data-piece-index="${pieceIndex}"]`);
    if (piece) {
        piece.remove();
    }
}

function checkPuzzleComplete() {
    const completedPieces = gameState.puzzleGrid.filter(piece => piece !== null).length;
    const totalPieces = gameState.puzzleSize * gameState.puzzleSize;
    
    if (completedPieces === totalPieces) {
        gameState.score += 500;
        playVictorySound();
        setTimeout(endGame, 1000);
    }
}

function endGame() {
    clearInterval(gameState.timer);
    
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.remove('hidden');
    
    const maxScore = gameState.totalQuestions * 100 + 500;
    const percentage = (gameState.score / maxScore) * 100;
    
    let rating = '';
    if (percentage >= 80) {
        rating = '🏆 ¡EXCELENTE!';
    } else if (percentage >= 60) {
        rating = '🥈 BUENO';
    } else if (percentage >= 40) {
        rating = '🥉 REGULAR';
    } else {
        rating = '📚 NECESITAS PRACTICAR';
    }
    
    document.getElementById('final-points').textContent = gameState.score;
    document.getElementById('score-rating').textContent = rating;
    
    // Mostrar el rompecabezas completado
    showCompletedPuzzle();
}

function showCompletedPuzzle() {
    // Crear contenedor para el rompecabezas final
    const endScreen = document.getElementById('end-screen');
    
    // Verificar si ya existe el puzzle final para no duplicarlo
    let finalPuzzleContainer = document.getElementById('final-puzzle-container');
    if (!finalPuzzleContainer) {
        finalPuzzleContainer = document.createElement('div');
        finalPuzzleContainer.id = 'final-puzzle-container';
        finalPuzzleContainer.innerHTML = `
            <h3 style="margin: 20px 0; color: #333;">🧩 Tu rompecabezas completado:</h3>
            <div id="final-puzzle" class="final-puzzle"></div>
        `;
        
        // Insertar antes del botón de reiniciar
        const restartButton = endScreen.querySelector('.btn');
        endScreen.insertBefore(finalPuzzleContainer, restartButton);
    }
    
    const finalPuzzle = document.getElementById('final-puzzle');
    finalPuzzle.innerHTML = '';
    finalPuzzle.style.display = 'grid';
    finalPuzzle.style.gridTemplateColumns = `repeat(${gameState.puzzleSize}, 1fr)`;
    finalPuzzle.style.gap = '2px';
    finalPuzzle.style.margin = '20px auto';
    finalPuzzle.style.maxWidth = '300px';
    finalPuzzle.style.border = '3px solid #333';
    finalPuzzle.style.borderRadius = '10px';
    finalPuzzle.style.padding = '5px';
    finalPuzzle.style.background = '#333';
    
    const totalPieces = gameState.puzzleSize * gameState.puzzleSize;
    const completedPieces = gameState.puzzleGrid.filter(piece => piece !== null).length;
    
    // Crear todas las piezas del rompecabezas final
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.style.aspectRatio = '1';
        piece.style.border = '1px solid #666';
        piece.style.borderRadius = '3px';
        
        const row = Math.floor(i / gameState.puzzleSize);
        const col = i % gameState.puzzleSize;
        
        if (gameState.puzzleGrid[i] !== null || completedPieces === totalPieces) {
            // Pieza completada - mostrar la imagen
            piece.style.backgroundImage = `url(${gameState.selectedImage})`;
            piece.style.backgroundPosition = `${-col * (300/gameState.puzzleSize)}px ${-row * (300/gameState.puzzleSize)}px`;
            piece.style.backgroundSize = `300px 300px`;
            piece.style.backgroundRepeat = 'no-repeat';
        } else {
            // Pieza faltante - mostrar vacío
            piece.style.background = '#f5f5f5';
            piece.style.border = '2px dashed #999';
            piece.style.display = 'flex';
            piece.style.alignItems = 'center';
            piece.style.justifyContent = 'center';
            piece.style.fontSize = '12px';
            piece.style.color = '#999';
            piece.textContent = '?';
        }
        
        finalPuzzle.appendChild(piece);
    }
    
    // Agregar información sobre el progreso
    const progressInfo = document.createElement('div');
    progressInfo.style.marginTop = '10px';
    progressInfo.style.fontSize = '14px';
    progressInfo.style.color = '#666';
    
    if (completedPieces === totalPieces) {
        progressInfo.innerHTML = '✅ <strong>¡Rompecabezas 100% completado!</strong>';
        progressInfo.style.color = '#333';
    } else {
        const percentage = Math.round((completedPieces / totalPieces) * 100);
        progressInfo.innerHTML = `📊 Progreso del rompecabezas: <strong>${completedPieces}/${totalPieces} piezas (${percentage}%)</strong>`;
    }
    
    // Verificar si ya existe la info de progreso para no duplicarla
    const existingProgress = finalPuzzleContainer.querySelector('.progress-info');
    if (existingProgress) {
        existingProgress.remove();
    }
    
    progressInfo.className = 'progress-info';
    finalPuzzleContainer.appendChild(progressInfo);
}

function restartGame() {
    gameState = {
        score: 0,
        currentQuestion: 0,
        totalQuestions: 10,
        timeLeft: 30,
        timer: null,
        difficulty: 'facil',
        puzzleSize: 3,
        selectedImage: null,
        questions: [],
        earnedPieces: [],
        puzzleGrid: []
    };
    
    // Limpiar el rompecabezas final si existe
    const finalPuzzleContainer = document.getElementById('final-puzzle-container');
    if (finalPuzzleContainer) {
        finalPuzzleContainer.remove();
    }
    
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    
    document.getElementById('image-upload').value = '';
    document.getElementById('puzzle-size').value = '3';
    document.getElementById('difficulty').value = 'facil';
    document.getElementById('questions-count').value = '10';
    
    createBeep(261.63, 0.2);
}

// Inicializar audio context
document.addEventListener('click', function initAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });