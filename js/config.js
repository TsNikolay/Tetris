export const config = {
  width: 480,
  height: 640,
  rows: 20,
  columns: 10,

  points: {
    1: 50,
    2: 150,
    3: 500,
    4: 1000,
  },

  colors: {
    red: "rgb(255,64,64)",
    blue: "rgb(102,0,255)",
    pink: "rgb(241,156,187)",
    yellow: "rgb(254,254,34)",
    cyan: "rgb(0,125,255)",
    orange: "rgb(255,136,0)",
    green: "rgb(124,252,0)",
  },

  margins: {
    marginExtraSmall: 24,
    marginSmall: 48,
    marginNormal: 96,
    marginExtraNormal: 125,
    marginLarge: 510,
    marginExtraLarge: 540,
    marginHuge: 570,
    marginExtraHuge: 600,
  },

  figureTypes: [
    "lineShape",
    "squareShape",
    "shapeT",
    "shapeL",
    "shapeJ",
    "shapeS",
    "shapeZ",
  ],

  figures: {
    lineShape: [
      [0, 0, 0, 0],
      ["red", "red", "red", "red"],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],

    squareShape: [
      ["blue", "blue"],
      ["blue", "blue"],
    ],

    shapeT: [
      ["pink", "pink", "pink"],
      [0, "pink", 0],
      [0, 0, 0],
    ],

    shapeL: [
      ["yellow", "yellow", "yellow"],
      ["yellow", 0, 0],
      [0, 0, 0],
    ],

    shapeJ: [
      ["cyan", "cyan", "cyan"],
      [0, 0, "cyan"],
      [0, 0, 0],
    ],

    shapeS: [
      [0, "orange", "orange"],
      ["orange", "orange", 0],
      [0, 0, 0],
    ],

    shapeZ: [
      ["green", "green", 0],
      [0, "green", "green"],
      [0, 0, 0],
    ],
  },
};
