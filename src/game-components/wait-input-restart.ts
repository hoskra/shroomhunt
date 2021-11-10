import * as ECS from '../../libs/pixi-ecs';
import { GameStatus } from './game-status';

export class WaitInputRestart extends ECS.Component {

	keyCmp: ECS.KeyInputComponent;
	GS: GameStatus;

	onUpdate() {
    this.keyCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);
    if(this.keyCmp) {
      if (this.keyCmp.isKeyPressed(ECS.Keys.KEY_ENTER)) {
        this.keyCmp.handleKey(ECS.Keys.KEY_ENTER);
        this.finish();
      }
    }
  }
}