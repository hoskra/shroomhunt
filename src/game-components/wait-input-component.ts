import * as ECS from '../../libs/pixi-ecs';
import { WINDOW_HEIGHT } from '../constants/game-constants';
import { Factory } from '../factory';

export class WaitInputComponent extends ECS.Component {

	keyCmp: ECS.KeyInputComponent;

	onUpdate() {
    this.keyCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    if(this.keyCmp) {

      if(this.keyCmp.isKeyPressed(ECS.Keys.KEY_UP)) {
        this.keyCmp.handleKey(ECS.Keys.KEY_UP);
        this.scene.findObjectByName('selection').position.y = WINDOW_HEIGHT * 0.5;
        this.scene.findGlobalComponentByName<Factory>(Factory.name).setMultiplayer(false);

      } else if(this.keyCmp.isKeyPressed(ECS.Keys.KEY_DOWN)) {
        this.keyCmp.handleKey(ECS.Keys.KEY_DOWN);
        this.scene.findObjectByName('selection').position.y = WINDOW_HEIGHT * 0.6;
        this.scene.findGlobalComponentByName<Factory>(Factory.name).setMultiplayer(true);

      } else if (this.keyCmp.isKeyPressed(ECS.Keys.KEY_SPACE) || this.keyCmp.isKeyPressed(ECS.Keys.KEY_ENTER)) {
        this.finish();
      }

    }
	}
}