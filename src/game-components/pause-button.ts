import * as ECS from '../../libs/pixi-ecs';
import { Assets, Messages } from '../constants/enum';
import { isInBounds } from '../utils/help-functions';

export class PauseButton extends ECS.Component {

  KC: ECS.KeyInputComponent;
  PC: ECS.PointerInputComponent;
  paused: boolean = false;

	constructor() {
    super();
  }

  onInit() {
    this.KC = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
		this.subscribe(ECS.PointerMessages.POINTER_TAP)
  }

  pause() {
    this.sendMessage(Messages.GAME_PAUSE, {} );
    this.owner.asSprite().texture = PIXI.Texture.from(Assets.PLAY);
  }

  play() {
    this.sendMessage(Messages.GAME_RUNNING, {} );
    this.owner.asSprite().texture = PIXI.Texture.from(Assets.PAUSE);
  }

  onMessage(msg: ECS.Message) {
    let bounds = isInBounds(this.owner.getBounds(), msg.data.mousePos);

    if(msg.action === ECS.PointerMessages.POINTER_TAP && bounds) {
      if(this.paused) {
        this.play();
        this.paused = false;
      } else {
        this.pause();
        this.paused = true;
      }
    }
  }

	onUpdate() {
    if(this.KC.isKeyPressed(ECS.Keys.KEY_P)) {
      this.KC.handleKey(ECS.Keys.KEY_P);
      if(this.paused) {
        this.play()
        this.paused = false;
      } else {
        this.pause()
        this.paused = true;
      }
    }
  }
}