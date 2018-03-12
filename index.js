import Game from "_js/object/game";

Game.initialize();

if(Game.state === "initialized") {

    Game.run();
}