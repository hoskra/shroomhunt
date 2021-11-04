import * as ECS from '../../libs/pixi-ecs';
import { WINDOW_HEIGHT } from '../constants/game-constants';
import { GameStatus } from './game-status';

export class WaitInputComponent extends ECS.Component {

	keyCmp: ECS.KeyInputComponent;
	GS: GameStatus;

	onUpdate() {
    this.keyCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);

    if(this.keyCmp) {

      if(this.keyCmp.isKeyPressed(ECS.Keys.KEY_UP)) {
        this.keyCmp.handleKey(ECS.Keys.KEY_UP);
        this.scene.findObjectByName('selection').position.y = WINDOW_HEIGHT * 0.5;
        this.GS.setMultiplayer(false);

      } else if(this.keyCmp.isKeyPressed(ECS.Keys.KEY_DOWN)) {
        this.keyCmp.handleKey(ECS.Keys.KEY_DOWN);
        this.scene.findObjectByName('selection').position.y = WINDOW_HEIGHT * 0.6;
        this.GS.setMultiplayer(true);

      } else if (this.keyCmp.isKeyPressed(ECS.Keys.KEY_SPACE) || this.keyCmp.isKeyPressed(ECS.Keys.KEY_ENTER)) {
        this.finish();
      }

    }
	}
}