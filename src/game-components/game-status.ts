import * as ECS from '../../libs/pixi-ecs';
import { TIME_LIMIT } from '../constants/game-constants';
import { Messages } from '../constants/enum';
import { GameStates } from '../constants/enum';
import { Builders } from '../builders';
import { Factory } from '../factory';
import { WaitInputRestart } from './wait-input-restart';
import { WaitInputComponent } from './wait-input-component';
export class GameStatus extends ECS.Component {

  time: number;
  stateId: number;
  multiplayer: boolean;
  player1_score: number;
  player2_score: number;

  constructor() {
    super();
    this.stateId = GameStates.WELCOME_SCREEN;
    this.player1_score = 0;
    this.player2_score = 0;
  }

  setScore1(num: number) {
    this.player1_score = num;
  }

  setScore2(num: number) {
    this.player2_score = num;
  }

  getScore1() { return this.player1_score; }
  getScore2() { return this.player2_score; }

  getStateId() {
    return this.stateId;
  }

  isMultiplayer() {
    return this.multiplayer;
  }

  setMultiplayer(multiplayer: boolean) {
    this.multiplayer = multiplayer;
  }

  onInit() {
    this.time = TIME_LIMIT;
    this.subscribe(Messages.GAME_RUNNING, Messages.GAME_PAUSE, Messages.GAME_FINISH, Messages.GAME_RESTART);
  }

  onMessage(msg: ECS.Message) {
    switch(msg.action) {
      case Messages.WELCOME_SCREEN:
        this.stateId = GameStates.WELCOME_SCREEN;
        console.log("Welcome screen.")
        break;
      case Messages.GAME_RUNNING:
        this.stateId = GameStates.RUNNING;
        console.log("Game started.")
        break;
      case Messages.GAME_PAUSE:
        this.stateId = GameStates.PAUSE;
        console.log("Game paused.")
        break;
      case Messages.GAME_FINISH:
        this.stateId = GameStates.FINISH;
        console.log("Game finished.")
        // this.restartGame();
        break;
      case Messages.GAME_RESTART:
        this.stateId = GameStates.RESTART;
        this.time = TIME_LIMIT;
        console.log("Game restarting.")
        break;
    }
  }

  restartGame() {
    const factory = this.scene.findGlobalComponentByName<Factory>(Factory.name);


		this.sendMessage(Messages.GAME_RESTART, {} );

    this.scene.stage.destroyChildren();

    // display score
		if(this.multiplayer) {
			Builders.finishScreenBuild(this.scene, this.getScore1(), this.getScore2());
		} else {
			Builders.finishScreenBuild(this.scene, this.getScore1());
		}

		// // wait for user input
		this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
			.waitFor(() => new WaitInputRestart())
			.mergeWith(factory.welcomeScreen()));

		// // clear scene


		// // pick mode and load game
		// this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
		// 	.waitFor(() => new WaitInputComponent())
		// 	.mergeWith(factory.loadGame()));

		// this.sendMessage(Messages.GAME_RUNNING, {} );

		// Builders.welcomeScreenBuilder(this.scene);
  }

  // onUpdate() {
  //   const keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

  //   if(this.stateId == GameStates.FINISH)
  //     if(keyInputCmp.isKeyPressed(ECS.Keys.KEY_ENTER) || keyInputCmp.isKeyPressed(ECS.Keys.KEY_SPACE)) {
  //       keyInputCmp.handleKey(ECS.Keys.KEY_ENTER);
  //       keyInputCmp.handleKey(ECS.Keys.KEY_SPACE);

  //       this.stateId = GameStates.RESTART;
  //       const factory = this.scene.findGlobalComponentByName<Factory>(Factory.name);
  //       factory.restartGame();
  //     }

  //   }
}