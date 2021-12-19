import * as ECS from '../../libs/pixi-ecs';
import { Assets } from '../constants/enum';
import { SoundComponent } from './sound-component';
import PIXI from 'pixi.js';

export class MuteButton extends ECS.Component {

  KC: ECS.KeyInputComponent;
  SC: SoundComponent;

	constructor() {
    super();
  }

  onInit() {
    this.KC = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
  }

	onUpdate() {
    if(this.KC.isKeyPressed(ECS.Keys.KEY_M)) {
      this.KC.handleKey(ECS.Keys.KEY_M);
      if(this.SC.isPlaying()) {
        this.SC.pauseBackgroundMusic();
        this.owner.alpha = 0;
      } else {
        this.SC.resumeBackgroundMusic();
        this.owner.alpha = 1;
      }
    }

  }
}