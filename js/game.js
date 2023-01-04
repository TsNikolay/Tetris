import Config from './config.js';

export default class Game {

    constructor(){
        this.config = new Config();
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
        if (this.hasCollision()){
            this.activeFigure.x += 1;
        }
    }

    moveFigureRight() {                         
        this.activeFigure.x += 1;
        if (this.hasCollision()){
            this.activeFigure.x -= 1;
        }
    }

    moveFigureDown() {                          
        if (this.isTopReached) return

        this.activeFigure.y += 1;

        if (this.hasCollision()){
            this.activeFigure.y -= 1;
            this.fixFigure();
            this.updateScore(this.clearLines());
            this.updateFigures();
        }

        if(this.hasCollision()){
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
                tempRotate[x][y] = shape[shape.length - 1 - y][x];
            }   
        }
        this.activeFigure.shape = tempRotate;

        if(this.hasCollision()){
            this.activeFigure.shape = shape;
        }
    }

    createPlayfield() {                                        
        const playfield = [];

        for (let y = 0; y < this.config.rows; y++) {
            playfield[y] = [];
            for (let x = 0; x < this.config.columns; x++) {
                playfield[y][x] = 0; 
            }
        }
        return playfield
    }

    createNewFigure() {          
        const types = ["lineShape", "squareShape", "shapeT", "shapeL", "shapeJ", "shapeS", "shapeZ"];
        const figureNumber = Math.floor(Math.random() * types.length);
        const type = types[figureNumber];
        const figure = {
            x: 0,
            y: 0
        }

        switch(type){
            case "lineShape":
                figure.shape = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                break;

            case "squareShape":
                figure.shape = [
                    [2,2],
                    [2,2]
                ];
                break;    

            case "shapeT":
                figure.shape = [
                    [3,3,3],
                    [0,3,0],
                    [0,0,0]
                ];
                break;
                
            case "shapeL":
                figure.shape = [
                    [4,4,4],
                    [4,0,0],
                    [0,0,0]
                ];
                break;
    
            case "shapeJ":
                figure.shape = [
                    [5,5,5],
                    [0,0,5],
                    [0,0,0]
                ];
                 break;    
    
             case "shapeS":
                figure.shape = [
                    [0,6,6],
                    [6,6,0],
                    [0,0,0]
                ];
                break;
        
            case "shapeZ":
                figure.shape = [
                    [7,7,0],
                    [0,7,7],
                    [0,0,0]
                ];
                break; 

            default:
                throw new Error('Невідомий тип фігури');         
        }

        figure.x = Math.floor((this.config.columns - figure.shape[0].length) / 2); // "2" для знаходження середини поля

       return figure
    }

    getState() {
        const playfield = this.createPlayfield();
        const activeFigure = this.activeFigure;

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];
            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < activeFigure.shape.length; y++) {
            for (let x = 0; x < activeFigure.shape[y].length; x++) {
                if (activeFigure.shape[y][x]) {
                    playfield[activeFigure.y + y][activeFigure.x + x] = activeFigure.shape[y][x];
                } 
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextFigure: this.nextFigure,
            isGameOver: this.isTopReached,
            playfield  
        }    
    }

    updateFigures(){
        this.activeFigure = this.nextFigure;
        this.nextFigure = this.createNewFigure();
    }

    updateScore(clearedLines){
        if (clearedLines > 0) {
            this.score += this.config.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    clearLines() {
        let lines = [];

        for (let y = this.config.rows - 1; y >= 0; y--){
            let blocksNumber =  0;
            for (let x = 0; x < this.config.columns; x++) {
                if (this.playfield[y][x]){
                    blocksNumber++;
                }
            }

            if (blocksNumber === 0) break;
            else if (blocksNumber < this.config.columns) continue
            else if (blocksNumber === this.config.columns){
                lines.unshift(y);
            }
        }
        
        for (let index of lines) {
            this.playfield.splice(index,1);
            this.playfield.unshift(new Array(this.config.columns).fill(0));
        }

        return lines.length;
    }

    hasCollision() {
        const activeFigure = this.activeFigure;
        const playfield = this.playfield;

        for (let y = 0; y < activeFigure.shape.length; y++) {
           for (let x = 0; x < activeFigure.shape[y].length; x++) {
                if (activeFigure.shape[y][x] && ((playfield[activeFigure.y + y] === undefined || playfield[activeFigure.y + y ][activeFigure.x + x] === undefined ) || (playfield[activeFigure.y + y][activeFigure.x + x]))){
                    return true;
                }
            }
        }
        return false
    }

    fixFigure() {
        const shape = this.activeFigure.shape;
        const activeFigure = this.activeFigure;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]){
                    this.playfield[activeFigure.y + y][activeFigure.x + x] = shape[y][x];
                }
            }
        }
    }

    get level() {
        const calcNumber = 0.1;
        return Math.floor(this.lines * calcNumber);
    }

}

