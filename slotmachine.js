const REEL_WIDTH = 100;
const REEL_HEIGHT = 100;
const REELS_COUNT = 5;
const ROWS_COUNT = 3;

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

let gameContainer, reelsContainer, symbolsSprites, spinButton, winningsText;
let currentPositions = [0, 0, 0, 0, 0];

// Slot Machine
function setupGame() {
    app.stage.removeChild(loaderText);

    gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);

    reelsContainer = new PIXI.Container();
    gameContainer.addChild(reelsContainer);

    symbolsSprites = [];
    for (let row = 0; row < ROWS_COUNT; row++) {
        symbolsSprites[row] = [];
        for (let col = 0; col < REELS_COUNT; col++) {
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
}

function getSymbolAt(reel, row, position) {
    const band = REEL_BANDS[reel];
    const bandPos = (position + row) % band.length;
    return band[bandPos];
}
        

    



