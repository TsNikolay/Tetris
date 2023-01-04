export default class View {

    static colors = {
        "1": "rgb(255,64,64)",
        "2": "rgb(102,0,255)",
        "3": "rgb(241,156,187)",
        "4": "rgb(254,254,34)",
        "5": "rgb(0,125,255)",
        "6": "rgb(255,136,0)",
        "7": "rgb(124,252,0)"
    }

    static marginsValue = {
        margin24: 24,
        margin48: 48,
        margin96: 96,
        margin125: 125,
        margin510: 510,
        margin540: 540,
        margin570: 570,
        margin600: 600,
    }

    constructor (element, width, height, rows, columns){

        this.element = element;                
        this.width = width;
        this.height = height;

        this.playfieldBorderWidth = 4;
        this.playfieldProportion = 2/3;
        this.playfieldWidth = this.width * this.playfieldProportion;
        this.playfieldX = this.playfieldBorderWidth;
        this.playfieldY = this.playfieldBorderWidth;
        
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldX;
        this.playfieldInnerHeight = this.height - this.playfieldY;

        this.paddingInPixels = 10;
        this.panelProportion = 1/3;
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

    renderCell(x, y, width, height, color){
        this.context.fillStyle = color;
        this.context.strokeStyle = ' rgb(0,191,255)';
        this.context.lineWidth = 2;
        this.context.fillRect(x , y , width, height);
        this.context.strokeRect(x , y , width, height);
    }

    renderPlayfield({playfield}){
        for (let y = 0; y < playfield.length; y++) {
            const row = playfield[y];
            for (let x = 0; x < playfield.length; x++) {
                const cell = row[x];
                if (cell){
                    this.renderCell(
                        this.playfieldX + (x * this.cellWidth), 
                        this.playfieldY + (y * this.cellHeight), 
                        this.cellWidth, 
                        this.cellHeight, 
                        View.colors[cell]);
                }
            }
        }
        this.context.strokeStyle = 'orange';
        this.context.lineWidth = this.playfieldBorderWidth;
        this.context.strokeRect(0,0, this.playfieldWidth, this.height)
    }

    renderStartMenu(){
        this.context.fillStyle = 'white';
        this.context.font = '32px "Bungee"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2); // "2" для пошуку середини
    }

    renderPauseMenu(){
        this.context.fillStyle = 'rgba(255,140,0,0.80)';
        this.context.fillRect(0,0,this.width, this.height);
        this.context.fillStyle = 'white';
        this.context.font = '32px "Bungee"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2); // "2" для пошуку середини
    }

    renderGameOverMenu({score}){
        this.clearPlayfield();
        this.context.fillStyle = 'rgba(255,140,0,0.80)';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = 'white';
        this.context.font = '32px "Bungee"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - View.marginsValue.margin48);  // "2" для пошуку середини
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText(`Press ENTER to restart:`, this.width / 2, this.height / 2 + View.marginsValue.margin48);
    }
     
    renderSidePanel({level, score, lines, nextFigure}){
        this.nextFigureSize = 0.7;
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '24px "Bungee"';
        this.context.fillText(`Score: ${score}`, this.panelX,  this.panelY);
        this.context.fillText(`Level: ${level}`, this.panelX , this.panelY + View.marginsValue.margin24);
        this.context.fillText(`Lines: ${lines}`, this.panelX , this.panelY + View.marginsValue.margin48);
        this.context.fillText(`Next:`, this.panelX , this.panelY + View.marginsValue.margin96);
        this.context.fillText(`⬅️ left`, this.panelX , this.panelY + View.marginsValue.margin510);
        this.context.fillText(`➡️ right`, this.panelX , this.panelY + View.marginsValue.margin540);
        this.context.fillText(`⬇️ down`, this.panelX , this.panelY + View.marginsValue.margin570);
        this.context.fillText(`🔁 space`, this.panelX , this.panelY + View.marginsValue.margin600);

        for (let y = 0; y < nextFigure.shape.length; y++) {
            for (let x = 0; x < nextFigure.shape[y].length; x++) {
                const cell = nextFigure.shape[y][x];
                if(cell) {
                    this.renderCell(
                        this.panelX + (x * this.cellWidth * this.nextFigureSize), 
                        this.panelY + View.marginsValue.margin125 + (y * this.cellHeight * this.nextFigureSize), 
                        this.cellWidth * this.nextFigureSize, 
                        this.cellHeight * this.nextFigureSize, 
                        View.colors[cell]);
                }
            }
            
        }
       
        
    }

    renderGame(state){
        this.clearPlayfield();
        this.renderPlayfield(state);
        this.renderSidePanel(state);
    }

    clearPlayfield(){
        this.context.clearRect(0, 0, this.width, this.height);
    }
}