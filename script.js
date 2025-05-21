const notes = [
    { key: 'A', note: 'A', file: 'audio/do.wav' },
    { key: 'S', note: 'S', file: 'audio/re.wav' },
    { key: 'D', note: 'D', file: 'audio/mi.wav' },
    { key: 'F', note: 'F', file: 'audio/fa.wav' },
    { key: 'G', note: 'G', file: 'audio/sol.wav' },
    { key: 'H', note: 'H', file: 'audio/la.wav' },
    { key: 'J', note: 'J', file: 'audio/si.wav' },
];

let score = 0;
let speed = 3;
const tiles = [];

function playSound(noteObj) {
    const audio = new Audio(noteObj.file);
    audio.currentTime = 0;
    audio.play();
}

function spawnTile(noteObj) {
    const button = document.querySelector(`.tecla[data-nota='${noteObj.note}']`);
    const buttonRect = button ? button.getBoundingClientRect() : null;
    const x = buttonRect ? buttonRect.left + buttonRect.width / 2 - 40 : 100;
    const tile = {
        note: noteObj.note,
        x: x,
        y: 0,
        speed: speed
    };
    tiles.push(tile);
}

function updateTiles() {
    for (let i = tiles.length - 1; i >= 0; i--) {
        tiles[i].y += tiles[i].speed;
        if (tiles[i].y > window.innerHeight) {
            tiles.splice(i, 1);
        }
    }
}

function drawTiles(context) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    tiles.forEach(tile => {
        context.fillStyle = 'rgba(78, 84, 200, 0.8)';
        context.strokeStyle = '#fff';
        context.lineWidth = 3;
        context.fillRect(tile.x, tile.y, 80, 80);
        context.strokeRect(tile.x, tile.y, 80, 80);
        context.fillStyle = '#fff';
        context.font = 'bold 28px Segoe UI';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(tile.note, tile.x + 40, tile.y + 40);
    });
    context.fillStyle = '#fff';
    context.font = 'bold 28px Segoe UI';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(`Score: ${score}`, 20, 20);
}

function handleKeyPress(e) {
    const noteObj = notes.find(n => n.key === e.key.toUpperCase());
    if (noteObj) {
        const hitIndex = tiles.findIndex(tile => tile.note === noteObj.note && tile.y > window.innerHeight - 120);
        if (hitIndex !== -1) {
            playSound(noteObj);
            score++;
            tiles.splice(hitIndex, 1);
            speed += 0.2;
        }
    }
}

function handleClick(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const hitIndex = tiles.findIndex(tile => (
        mouseX >= tile.x && mouseX <= tile.x + 80 &&
        mouseY >= tile.y && mouseY <= tile.y + 80
    ));

    if (hitIndex !== -1) {
        const tile = tiles[hitIndex];
        const noteObj = notes.find(n => n.note === tile.note);
        if (noteObj) {
            playSound(noteObj);
            score++;
            tiles.splice(hitIndex, 1);
            speed += 0.2;
        }
    }
}

function gameLoop(context) {
    updateTiles();
    drawTiles(context);
    requestAnimationFrame(() => gameLoop(context));
}

window.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d');

    setInterval(() => {
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        spawnTile(randomNote);
    }, 900);

    canvas.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);

    gameLoop(context);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
};

