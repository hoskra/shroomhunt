import * as ECS from '../../libs/pixi-ecs';
import { TIME_LIMIT } from '../constants/game-constants';
import { Messages } from '../constants/enum';
import { GameStates } from '../constants/enum';
import { Factory } from '../factory';
export class GameStatus extends ECS.Component {

  time: number;
  stateId: number;
  multiplayer: boolean;
  player1_score: number;
  player2_score: number;
  caveWithMonster: number = -1;

  constructor() {
    super();
    this.stateId = GameStates.WELCOME_SCREEN;
    this.player1_score = 0;
    this.player2_score = 0;
  }

  getMonsterPosition() {
    return this.caveWithMonster;
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
    this.subscribe(Messages.GAME_RUNNING, Messages.GAME_PAUSE, Messages.GAME_FINISH, Messages.GAME_RESTART,
      Messages.MONSTER_POSITION);
  }

  onMessage(msg: ECS.Message) {
    switch(msg.action) {
      case Messages.WELCOME_SCREEN:
        this.stateId = GameStates.WELCOME_SCREEN;
        // console.log("Welcome screen.")
        break;
      case Messages.GAME_RUNNING:
        this.stateId = GameStates.RUNNING;
        // console.log("Game started.")
        break;
      case Messages.GAME_PAUSE:
        this.stateId = GameStates.PAUSE;
        // console.log("Game paused.")
        break;
      case Messages.GAME_FINISH:
        this.stateId = GameStates.FINISH;
        // console.log("Game finished.")
        const factory = this.scene.findGlobalComponentByName<Factory>(Factory.name);
        factory.restartGame();
        break;
      case Messages.GAME_RESTART:
        this.stateId = GameStates.RESTART;
        this.time = TIME_LIMIT;
        // console.log("Game restarting.")
        break;
      case Messages.MONSTER_POSITION:
        this.caveWithMonster = msg.data;
        break;
    }
  }

  onUpdate() {
    if (this.stateId === GameStates.RUNNING) {
      if(this.getScore2() > this.getScore1()) {
        this.stateId = GameStates.FINISH;
      } else if (this.getScore1() > this.getScore2()) {
        this.stateId = GameStates.FINISH;
      }
    }
  }

}