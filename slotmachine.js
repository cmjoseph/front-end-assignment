const REEL_BANDS = [
    ["hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2"],
    ["hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2"],
    ["lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4"],
    ["hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2"],
    ["lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4"],
];

const SYMBOLS = ["hv1", "hv2", "hv3", "hv4", "lv1", "lv2", "lv3", "lv4"];

const SYMBOL_IMAGES = {
    hv1: "assets/hv1_symbol.png",
    hv2: "assets/hv2_symbol.png",
    hv3: "assets/hv3_symbol.png",
    hv4: "assets/hv4_symbol.png",
    lv1: "assets/lv1_symbol.png",
    lv2: "assets/lv2_symbol.png",
    lv3: "assets/lv3_symbol.png",
    lv4: "assets/lv4_symbol.png",
};

const SPIN_BUTTON_IMAGE = "assets/spin_button.png";

const PAYTABLE = {
    hv1: [10, 20, 50],
    hv2: [5, 10, 20],
    hv3: [5, 10, 15],
    hv4: [5, 10, 15],
    lv1: [2, 5, 10],
    lv2: [1, 2, 5],
    lv3: [1, 2, 3],
    lv4: [1, 2, 3],
};

const PAYLINES = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
    [0, 1, 1, 1, 0],
    [2, 1, 1, 1, 2],
];

const INIT_POS = [0, 0, 0, 0, 0];