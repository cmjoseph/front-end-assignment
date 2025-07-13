const REEL_WIDTH = 100;
const REEL_HEIGHT = 100;
const REELS_COUNT = 5;
const ROWS_COUNT = 3;
const SPRITE_SIZE = 150;
const BUTTON_SIZE = 140;

const SYMBOLS = ['hv1', 'hv2', 'hv3', 'hv4', 'lv1', 'lv2', 'lv3', 'lv4'];

const REEL_BANDS = [
    ['hv2', 'lv3', 'lv3', 'hv1', 'hv1', 'lv1', 'hv1', 'hv4', 'lv1', 'hv3', 'hv2', 'hv3', 'lv4', 'hv4', 'lv1', 'hv2', 'lv4', 'lv1', 'lv3', 'hv2'],
    ['hv1', 'lv2', 'lv3', 'lv2', 'lv1', 'lv1', 'lv4', 'lv1', 'lv1', 'hv4', 'lv3', 'hv2', 'lv1', 'lv3', 'hv1', 'lv1', 'lv2', 'lv4', 'lv3', 'lv2'],
    ['lv1', 'hv2', 'lv3', 'lv4', 'hv3', 'hv2', 'lv2', 'hv2', 'hv2', 'lv1', 'hv3', 'lv1', 'hv1', 'lv2', 'hv3', 'hv2', 'hv4', 'hv1', 'lv2', 'lv4'],
    ['hv2', 'lv2', 'hv3', 'lv2', 'lv4', 'lv4', 'hv3', 'lv2', 'lv4', 'hv1', 'lv1', 'hv1', 'lv2', 'hv3', 'lv2', 'lv3', 'hv2', 'lv1', 'hv3', 'lv2'],
    ['lv3', 'lv4', 'hv2', 'hv3', 'hv4', 'hv1', 'hv3', 'hv2', 'hv2', 'hv4', 'hv4', 'hv2', 'lv2', 'hv4', 'hv1', 'lv2', 'hv1', 'lv2', 'hv4', 'lv4']
];

const PAYTABLE = {
    'hv1': [10, 20, 50],
    'hv2': [5, 10, 20],
    'hv3': [5, 10, 15],
    'hv4': [5, 10, 15],
    'lv1': [2, 5, 10],
    'lv2': [1, 2, 5],
    'lv3': [1, 2, 3],
    'lv4': [1, 2, 3]
};

const PAYLINES = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [1, 1, 2, 2, 2],
    [2, 2, 1, 1, 1],
    [1, 2, 1, 2, 1],
    [2, 1, 2, 1, 2]
];

const ASSETS = {
    symbols: {
        hv1: 'assets/hv1_symbol.png',
        hv2: 'assets/hv2_symbol.png',
        hv3: 'assets/hv3_symbol.png',
        hv4: 'assets/hv4_symbol.png',
        lv1: 'assets/lv1_symbol.png',
        lv2: 'assets/lv2_symbol.png',
        lv3: 'assets/lv3_symbol.png',
        lv4: 'assets/lv4_symbol.png',
    },
    spinButton: 'assets/spin_button.png',
};

// Init
let app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});
document.getElementById("game-container").appendChild(app.view);

// Preloader
const loader = new PIXI.Loader();
Object.values(ASSETS.symbols).forEach(url => loader.add(url));
loader.add(ASSETS.spinButton);

const loaderText = new PIXI.Text('Loading: 0%', {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 0xffffff,
    align: 'center'
});
loaderText.anchor.set(0.5);
loaderText.x = app.screen.width / 2;
loaderText.y = app.screen.height / 2;
app.stage.addChild(loaderText);

loader.onProgress.add((l) => {
    loaderText.text = `Loading: ${Math.round(l.progress)}%`;
    loaderText.x = app.screen.width / 2;
    loaderText.y = app.screen.height / 2;
});

loader.load(setupGame);

let gameContainer, reelsContainer, symbolsSprites, backgroundSprites, spinButton, winningsText;
let currentPositions = [0, 0, 0, 0, 0];

// Slot Machine
function setupGame() {
    app.stage.removeChild(loaderText);

    gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);

    reelsContainer = new PIXI.Container();
    gameContainer.addChild(reelsContainer);

    symbolsSprites = [];
    backgroundSprites = [];
    for (let row = 0; row < ROWS_COUNT; row++) {
        symbolsSprites[row] = [];
        backgroundSprites[row] = [];
        for (let col = 0; col < REELS_COUNT; col++) {
            
            const background = new PIXI.Graphics();
            background.beginFill(0x000000, 0);
            background.drawRect(-SPRITE_SIZE / 2, -SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
            background.endFill();
            reelsContainer.addChild(background);
            backgroundSprites[row][col] = background;

            const symbolId = getSymbolAt(col, row, currentPositions[col]);
            const tex = loader.resources[ASSETS.symbols[symbolId]].texture;
            const sprite = new PIXI.Sprite(tex);
            sprite.anchor.set(0.5);
            reelsContainer.addChild(sprite);
            symbolsSprites[row][col] = sprite;
        }
    }

    spinButton = new PIXI.Sprite(loader.resources[ASSETS.spinButton].texture);
    spinButton.anchor.set(0.5);
    spinButton.interactive = true;
    spinButton.buttonMode = true;
    spinButton.on('pointerdown', onSpin);
    gameContainer.addChild(spinButton);

    winningsText = new PIXI.Text('', {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: 0xffff00,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 600
    });
    winningsText.anchor.set(0.5, 0);
    gameContainer.addChild(winningsText);

    updateReels();
    displayWinnings([]);

    gameContainer.x = app.screen.width / 2;
    gameContainer.y = app.screen.height / 2;

    window.addEventListener('resize', resizeGame);
    resizeGame();
}

function getSymbolAt(reel, row, position) {
    const band = REEL_BANDS[reel];
    const bandPos = (position + row) % band.length;
    return band[bandPos];
}

function onSpin() {
    currentPositions = REEL_BANDS.map(band =>
        Math.floor(Math.random() * band.length)
    );
    updateReels();

    const screen = [];
    for (let row = 0; row < ROWS_COUNT; row++) {
        screen[row] = [];
        for (let col = 0; col < REELS_COUNT; col++) {
            screen[row][col] = getSymbolAt(col, row, currentPositions[col]);
        }
    }
    const wins = calculateWinnings(screen);
    displayWinnings(wins);
}

function displayWinnings({ total = 0, results = [] }) {
    let text = `Total wins: ${total}`;
    if (results.length) {
        results.forEach(win => {
            text += `\n- Payline ${win.payline}, ${win.symbol} x${win.count}, ${win.payout}`;
        });
    }
    winningsText.text = text;
    scaleWinningsText();

    for (let row = 0; row < ROWS_COUNT; row++) {
        for (let col = 0; col < REELS_COUNT; col++) {
            backgroundSprites[row][col].clear();
            backgroundSprites[row][col].beginFill(0x000000, 0);
            backgroundSprites[row][col].drawRect(-SPRITE_SIZE / 2, -SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
            backgroundSprites[row][col].endFill();
        }
    }

    results.forEach(win => {
        const payline = PAYLINES[win.payline - 1];
        for (let i = 0; i < win.count; i++) {
            const row = payline[i];
            const col = i;
            backgroundSprites[row][col].clear();
            backgroundSprites[row][col].beginFill(0xffff00, 1); // Yellow background for winners
            backgroundSprites[row][col].drawRect(-SPRITE_SIZE / 2, -SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
            backgroundSprites[row][col].endFill();
        }
    });
}

function updateReels() {
    for (let row = 0; row < ROWS_COUNT; row++) {
        for (let col = 0; col < REELS_COUNT; col++) {
            const symbolId = getSymbolAt(col, row, currentPositions[col]);
            const tex = loader.resources[ASSETS.symbols[symbolId]].texture;
            symbolsSprites[row][col].texture = tex;
        }
    }
}

function calculateWinnings(screen) {
    const results = [];
    let total = 0;
    PAYLINES.forEach((line, idx) => {
       
        const symbols = line.map((row, col) => screen[row][col]);
        const first = symbols[0];
        let matchCount = 1;
       
        for (let i = 1; i < symbols.length; i++) {
            if (symbols[i] === first) matchCount++;
            else break;
        }
        if (matchCount >= 3) {
            const payout = PAYTABLE[first][matchCount - 3];
            total += payout;
            results.push({
                payline: idx + 1,
                symbol: first,
                count: matchCount,
                payout
            });
        }
    });
    return { total, results };
}

function resizeGame() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const reelsWidth = REELS_COUNT * SPRITE_SIZE + (REELS_COUNT - 1) * 20;
    const reelsHeight = ROWS_COUNT * SPRITE_SIZE + (ROWS_COUNT - 1) * 20;
    const totalHeight = reelsHeight + BUTTON_SIZE + 40 + 200;

    const scale = Math.min(
        w * 0.9 / reelsWidth,
        h * 0.9 / totalHeight,
        1
    );
    gameContainer.scale.set(scale);

    gameContainer.x = w / 2 - (reelsWidth * scale) / 2;
    gameContainer.y = h / 2 - (totalHeight * scale) / 2;

    reelsContainer.x = 0;
    reelsContainer.y = 0;

    for (let row = 0; row < ROWS_COUNT; row++) {
        for (let col = 0; col < REELS_COUNT; col++) {
            const sprite = symbolsSprites[row][col];
            const background = backgroundSprites[row][col];
            sprite.x = col * (SPRITE_SIZE + 20) + SPRITE_SIZE / 2;
            sprite.y = row * (SPRITE_SIZE + 20) + SPRITE_SIZE / 2;
            sprite.width = SPRITE_SIZE;
            sprite.height = SPRITE_SIZE;

            background.x = sprite.x;
            background.y = sprite.y;
        }
    }

    spinButton.x = reelsWidth / 2;
    spinButton.y = reelsHeight + BUTTON_SIZE / 2 + 40;
    spinButton.width = BUTTON_SIZE;
    spinButton.height = BUTTON_SIZE;

    winningsText.x = reelsWidth / 2;
    winningsText.y = reelsHeight + BUTTON_SIZE + 60;

    scaleWinningsText();
}

function centerDisplayObject(obj) {
    obj.x = app.screen.width / 2;
    obj.y = app.screen.height / 2;
}

function scaleWinningsText() {
    if (!winningsText) return;
    const maxWidth = REELS_COUNT * SPRITE_SIZE + (REELS_COUNT - 1) * 20;
    const maxHeight = 180;
    winningsText.style.wordWrapWidth = maxWidth;
    winningsText.scale.set(1);

    if (winningsText.height > maxHeight) {
        winningsText.scale.set(maxHeight / winningsText.height);
    }
}

function showInitialScreen() {
    currentPositions = [0, 0, 0, 0, 0];
    updateReels();
    const screen = [];
    for (let row = 0; row < ROWS_COUNT; row++) {
        screen[row] = [];
        for (let col = 0; col < REELS_COUNT; col++) {
            screen[row][col] = getSymbolAt(col, row, currentPositions[col]);
        }
    }
    const wins = calculateWinnings(screen);
    displayWinnings(wins);
}


        

    



