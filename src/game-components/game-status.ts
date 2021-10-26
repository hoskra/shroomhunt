import * as ECS from '../../libs/pixi-ecs';
import { TIME_LIMIT } from '../constants/game-constants';
import { ComponentState } from '../../libs/pixi-ecs/engine/component';
import { GameState } from '../constants/enum';

export class GameStatus extends ECS.Component {

  time: number;
  player1_score: number;
  player2_score: number;

  constructor(public multiplayer: boolean) {
    super();
    this.player1_score = 0;
    this.player2_score = 0;
  }

  onInit() {
    this.time = TIME_LIMIT;
  }

  // START_SCREEN = 0,
	// GAME_RUNNING = 1,
	// SCORE_BOARD = 3

  onMessage(msg: any) {
    if(msg == GameState.START_SCREEN) {
      this._cmpState = ComponentState.RUNNING;
    }
    if(msg == GameState.SCORE_BOARD) {
      this._cmpState = ComponentState.FINISHED;
    }
  }

  onUpdate(deltaTime: number) {
    if(GameState.GAME_RUNNING) {
      this.time -= deltaTime;
    }
  }

}