import Config from "./config.js";

export default class View {
  constructor(element, width, height, rows, columns) {
    this.config = new Config();
    this.element = element;
    this.width = width;
    this.height = height;

    this.playfieldBorderWidth = 4;
    this.playfieldProportion = 2 / 3;
    this.playfieldWidth = this.width * this.playfieldProportion;
    this.playfieldX = this.playfieldBorderWidth;
    this.playfieldY = this.playfieldBorderWidth;

    this.playfieldInnerWidth = this.playfieldWidth - this.playfieldX;
    this.playfieldInnerHeight = this.height - this.playfieldY;

    this.paddingInPixels = 10;
    this.panelProportion = 1 / 3;
    this.panelWidth = this.width * this.panelProportion;
    this.panelHeight = this.height;
    this.panelX = this.playfieldWidth + this.paddingInPixels;
    this.panelY = 0;

    this.cellWidth = this.playfieldInnerWidth / columns;
    this.cellHeight = this.playfieldInnerHeight / rows;

    this.canvas = document.createElement("canvas");
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.context = this.canvas.getContext("2d");
    this.element.appendChild(this.canvas);
  }

  renderCell(x, y, width, height, color) {
    const context = this.context;
    context.fillStyle = color;
    context.strokeStyle = " rgb(0,191,255)";
    context.lineWidth = 2;
    context.fillRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
  }

  renderPlayfield({ playfield }) {
    for (let y = 0; y < playfield.length; y++) {
      const row = playfield[y];
      for (let x = 0; x < playfield.length; x++) {
        const cell = row[x];
        if (cell) {
          this.renderCell(
            this.playfieldX + x * this.cellWidth,
            this.playfieldY + y * this.cellHeight,
            this.cellWidth,
            this.cellHeight,
            this.config.colors[cell]
          );
        }
      }
    }
    this.context.strokeStyle = "orange";
    this.context.lineWidth = this.playfieldBorderWidth;
    this.context.strokeRect(0, 0, this.playfieldWidth, this.height);
  }

  renderStartMenu() {
    const context = this.context;
    context.fillStyle = "white";
    context.font = '32px "Bungee"';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Press ENTER to Start", this.width / 2, this.height / 2); // "2" для пошуку середини
  }

  renderPauseMenu() {
    const context = this.context;
    context.fillStyle = "rgba(255,140,0,0.80)";
    context.fillRect(0, 0, this.width, this.height);
    context.fillStyle = "white";
    context.font = '32px "Bungee"';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Press ENTER to Resume", this.width / 2, this.height / 2); // "2" для пошуку середини
  }

  renderGameOverMenu({ score }) {
    const context = this.context;
    const margins = this.config.margins;
    
    this.clearPlayfield();
    context.fillStyle = "rgba(255,140,0,0.80)";
    context.fillRect(0, 0, this.width, this.height);
    context.fillStyle = "white";
    context.font = '32px "Bungee"';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText( "GAME OVER", this.width / 2, this.height / 2 - margins.marginSmall); // "2" для пошуку середини
    context.fillText( `Score: ${score}`, this.width / 2, this.height / 2);
    context.fillText( `Press ENTER to restart:`, this.width / 2, this.height / 2 + margins.marginSmall);
  }

  renderSidePanel({ level, score, lines, nextFigure }) {
    const context = this.context;
    const margins = this.config.margins;

    this.nextFigureSize = 0.7;
    context.textAlign = "start";
    context.textBaseline = "top";
    context.fillStyle = "white";
    context.font = '24px "Bungee"';
    context.fillText( `Score: ${score}`, this.panelX, this.panelY);
    context.fillText( `Level: ${level}`, this.panelX, this.panelY + margins.marginExtraSmall);
    context.fillText( `Lines: ${lines}`, this.panelX, this.panelY + margins.marginSmall);
    context.fillText( `Next:`, this.panelX, this.panelY + margins.marginNormal);
    context.fillText( `⬅️ left`, this.panelX, this.panelY + margins.marginLarge);
    context.fillText( `➡️ right`, this.panelX, this.panelY + margins.marginExtraLarge);
    context.fillText( `⬇️ down`, this.panelX, this.panelY + margins.marginHuge);
    context.fillText( `🔁 space`, this.panelX, this.panelY + margins.marginExtraHuge);

    for (let y = 0; y < nextFigure.shape.length; y++) {
      for (let x = 0; x < nextFigure.shape[y].length; x++) {
        const cell = nextFigure.shape[y][x];
        if (cell) {
          this.renderCell(
            this.panelX + x * this.cellWidth * this.nextFigureSize,
            this.panelY + margins.marginExtraNormal + y * this.cellHeight * this.nextFigureSize,
            this.cellWidth * this.nextFigureSize,
            this.cellHeight * this.nextFigureSize,
            this.config.colors[cell]
          );
        }
      }
    }
  }

  renderGame(state) {
    this.clearPlayfield();
    this.renderPlayfield(state);
    this.renderSidePanel(state);
  }

  clearPlayfield() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
}
