import * as ECS from '../../libs/pixi-ecs';
import { Assets } from '../constants/enum';
import { isInBounds } from '../utils/help-functions';
import { SoundComponent } from './sound-component';

export class MuteButton extends ECS.Component {

  KC: ECS.KeyInputComponent;
  PC: ECS.PointerInputComponent;
  SC: SoundComponent;
  muted: boolean = false;

	constructor() {
    super();
  }

  onInit() {
    this.KC = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
		this.subscribe(ECS.PointerMessages.POINTER_TAP)
  }

  mute() {
    this.SC.pauseBackgroundMusic();
    this.owner.asSprite().texture = PIXI.Texture.from(Assets.SOUND_ON)
  }

  unmute() {
    this.SC.resumeBackgroundMusic();
    this.owner.asSprite().texture = PIXI.Texture.from(Assets.SOUND_OFF)
  }

  onMessage(msg: ECS.Message) {
    let bounds = isInBounds(this.owner.getBounds(), msg.data.mousePos);

    if(msg.action === ECS.PointerMessages.POINTER_TAP && bounds) {
      if(this.muted) {
        this.unmute();
        this.muted = false;
      } else {
        this.mute();
        this.muted = true;
      }
    }
  }

	onUpdate() {
    if(this.KC.isKeyPressed(ECS.Keys.KEY_M)) {
      this.KC.handleKey(ECS.Keys.KEY_M);
      if(this.muted) {
        this.unmute()
        this.muted = false;
      } else {
        this.mute()
        this.muted = true;
      }
    }
  }
}