export default class Controller {
    constructor(game, view){

        this.game = game;
        this.view = view;
        this.isPlaying = false;
        this.interval = null;

        document.addEventListener('keydown', this.handleKeyboardClick.bind(this));
        document.addEventListener('keyup', this.handleKeyboardUp.bind(this));
        
        this.view.renderStartMenu();
    }

    update(){
        this.game.moveFigureDown();
        this.updateView();
    }

    play(){
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause(){
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    restart() {
        this.game.restartProperties(); 
        this.play()
    }

    updateView() {
        const state = this.game.getState();

        if(state.isGameOver){
            this.view.renderGameOverMenu(state);
        } else if (!this.isPlaying){
            this.view.renderPauseMenu(state);
        } else {
            this.view.renderGame(state);
        }
    }

    startTimer(){
        const oneSecond = 1000;
        const multiplier = 100;
        const speed = oneSecond - this.game.getState().level * multiplier;
        if (!this.interval){
            this.interval = setInterval(() => this.update(), speed > 0 ? speed : multiplier);
        }
    }

    stopTimer(){
        if(this.interval){
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    handleKeyboardClick(event){
        const state = this.game.getState();

        switch(event.keyCode){
            case 13:
                if(state.isGameOver){
                    this.restart();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break; 

            case 32:
                game.rotateFigure()
                this.updateView();
                break; 
    
            case 37:
                game.moveFigureLeft()
                this.updateView();
                break;
    
            case 39:
                game.moveFigureRight()
                this.updateView();
                break; 
            case 40:
                this.stopTimer();
                game.moveFigureDown()
                this.updateView();
                break;      
        }
    }

    handleKeyboardUp(event) {
        switch(event.keyCode){
            case 40:
                this.startTimer();
                break;       
        }
    }
}