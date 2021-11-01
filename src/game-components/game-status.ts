import * as ECS from '../../libs/pixi-ecs';
import { TIME_LIMIT } from '../constants/game-constants';
import { Messages } from '../constants/enum';
import { GameStates } from '../constants/enum';
export class GameStatus extends ECS.Component {

  time: number;
  stateId: number;
  multiplayer: boolean;

  constructor() {
    super();
    this.stateId = GameStates.WELCOME_SCREEN;
  }

  getStateId() {
    return this.stateId;
  }

  setMultiplayer(multiplayer: boolean) {
    this.multiplayer = multiplayer;
  }

  onInit() {
    this.time = TIME_LIMIT;
    this.subscribe(Messages.GAME_START, Messages.GAME_PAUSE, Messages.GAME_FINISH, Messages.GAME_RESTART);
  }

  onMessage(msg: ECS.Message) {
    switch(msg.action) {
      case Messages.GAME_START:
        this.stateId = GameStates.START;
        console.log("Game started.")
        break;
        case Messages.GAME_PAUSE:
        this.stateId = GameStates.PAUSE;
        console.log("Game paused.")
        break;
      case Messages.GAME_FINISH:
        this.stateId = GameStates.FINISH;
        console.log("Game finished.")
        break;
      case Messages.GAME_RESTART:
        this.stateId = GameStates.RESTART;
        this.time = TIME_LIMIT;
        console.log("Game restarting.")
        break;
    }
  }

  onUpdate(delta: number, absolute: number) {

  }

}