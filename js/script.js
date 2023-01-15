import Game from "./game.js";
import View from "./view.js";
import Controller from "./controller.js";
import { config } from "./config.js";

const root = document.querySelector("#root");

const game = new Game();
const view = new View(root, config.width, config.height, config.rows, config.columns);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;
