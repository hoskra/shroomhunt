import * as ECS from '../../libs/pixi-ecs';
import { SoundComponent } from './sound-component';

export class MuteButton extends ECS.Component {

  KC: ECS.KeyInputComponent;
  PC: ECS.PointerInputComponent;
  SC: SoundComponent;

	constructor() {
    super();
  }

  onInit() {
    this.KC = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
		this.subscribe(ECS.PointerMessages.POINTER_DOWN)
  }

  mute() {
    this.SC.pauseBackgroundMusic();
    this.owner.alpha = 0;
    this.scene.findObjectByName("soundOn").asSprite().alpha = 1;
  }

  unmute() {
    this.SC.resumeBackgroundMusic();
    this.owner.alpha = 1;
    this.scene.findObjectByName("soundOn").asSprite().alpha = 0;
  }

  onMessage(msg: ECS.Message) {
    if(msg.action === ECS.PointerMessages.POINTER_DOWN)
      this.mute()
  }

	onUpdate() {

    if(this.KC.isKeyPressed(ECS.Keys.KEY_M)) {
      this.KC.handleKey(ECS.Keys.KEY_M);
      if(this.SC.isPlaying()) {
        this.mute()
      } else {
        this.unmute()
      }
    }
  }
}