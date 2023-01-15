import { config } from "./config.js";

export default class Game {
  constructor() {
    this.restartProperties();
  }

  restartProperties() {
    this.score = 0;
    this.lines = 0;
    this.isTopReached = false;
    this.playfield = this.createPlayfield();
    this.activeFigure = this.createNewFigure();
    this.nextFigure = this.createNewFigure();
  }

  moveFigureLeft() {
    this.activeFigure.x -= 1;
    if (this.hasCollision()) {
      this.activeFigure.x += 1;
    }
  }

  moveFigureRight() {
    this.activeFigure.x += 1;
    if (this.hasCollision()) {
      this.activeFigure.x -= 1;
    }
  }

  moveFigureDown() {
    if (this.isTopReached) return;

    this.activeFigure.y += 1;

    if (this.hasCollision()) {
      this.activeFigure.y -= 1;
      this.fixFigure();
      this.updateScore(this.clearLines());
      this.updateFigures();
    }

    if (this.hasCollision()) {
      this.isTopReached = true;
    }
  }

  rotateFigure() {
    const shape = this.activeFigure.shape;
    const tempRotate = [];

    for (let i = 0; i < shape.length; i++) {
      tempRotate[i] = new Array(shape.length).fill(0);
    }

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape.length; x++) {
        tempRotate[x][y] = shape[shape.length - y - 1][x];
      }
    }

    this.activeFigure.shape = tempRotate;

    if (this.hasCollision()) {
      this.activeFigure.shape = shape;
    }
  }

  createPlayfield() {
    const playfield = [];

    for (let y = 0; y < config.rows; y++) {
      playfield[y] = [];
      for (let x = 0; x < config.columns; x++) {
        playfield[y][x] = 0;
      }
    }
    return playfield;
  }

  createNewFigure() {
    const figure = {
      x: 0,
      y: 0,
      shape: [],
    };

    const figureIndex = Math.floor(Math.random() * config.figureTypes.length);
    const type = config.figureTypes[figureIndex];

    figure.shape = config.figures[`${type}`];
    figure.x = Math.floor((config.columns - figure.shape[0].length) / 2); // "2" для знаходження середини поля

    return figure;
  }

  getState() {
    const playfield = this.createPlayfield();
    const activeFigure = this.activeFigure;
    const shape = activeFigure.shape;

    for (let y = 0; y < this.playfield.length; y++) {
      playfield[y] = [...this.playfield[y]];
    }

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          playfield[activeFigure.y + y][activeFigure.x + x] = shape[y][x];
        }
      }
    }

    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      nextFigure: this.nextFigure,
      isGameOver: this.isTopReached,
      playfield,
    };
  }

  updateFigures() {
    this.activeFigure = this.nextFigure;
    this.nextFigure = this.createNewFigure();
  }

  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += config.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines;
    }
  }

  clearLines() {
    let lines = [];

    for (let y = config.rows - 1; y >= 0; y--) {
      let blocksNumber = 0;
      for (let x = 0; x < config.columns; x++) {
        if (this.playfield[y][x]) {
          blocksNumber++;
        }
      }

      if (blocksNumber === 0) break;
      else if (blocksNumber < config.columns) continue;
      else if (blocksNumber === config.columns) {
        lines.unshift(y);
      }
    }

    for (let index of lines) {
      this.playfield.splice(index, 1);
      this.playfield.unshift(new Array(config.columns).fill(0));
    }

    return lines.length;
  }

  hasCollision() {
    const activeFigure = this.activeFigure;
    const playfield = this.playfield;
    let figureY;
    let figureX;

    for (let y = 0; y < activeFigure.shape.length; y++) {
      for (let x = 0; x < activeFigure.shape[y].length; x++) {
        figureY = activeFigure.y + y;
        figureX = activeFigure.x + x;

        function isFigureExist() {
          return activeFigure.shape[y][x];
        }

        function isFigureReachedBottom() {
          return playfield[figureY] === undefined;
        }

        function isFigureOutOfPlayfield() {
          return isFigureReachedBottom() || playfield[figureY][figureX] === undefined;
        }

        function isFigureHasCollision() {
          return isFigureOutOfPlayfield() || playfield[figureY][figureX];
        }

        if (isFigureExist() && isFigureHasCollision()) {
          return true;
        }
      }
    }

    return false;
  }

  fixFigure() {
    const shape = this.activeFigure.shape;
    const activeFigure = this.activeFigure;

    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          this.playfield[activeFigure.y + y][activeFigure.x + x] = shape[y][x];
        }
      });
    });
  }

  get level() {
    const calcNumber = 0.1;
    return Math.floor(this.lines * calcNumber);
  }
}
