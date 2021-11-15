import * as ECS from '../../libs/pixi-ecs';
import sound from 'pixi-sound'

import { SoundInfo } from '../constants/asset-info';
export class SoundComponent extends ECS.Component {

  public pickYellow: any;
  public pickRed: any;
  public basket: any;
  public monster: any;

  constructor() {
    super();
  }

  onInit() {
    this.pickYellow = sound.Sound.from(SoundInfo.pickYellow);
    this.pickRed = sound.Sound.from(SoundInfo.pickRed);
    this.basket = sound.Sound.from(SoundInfo.basket);
    this.monster = sound.Sound.from(SoundInfo.monster);
  }

  playPickYellow() {
    this.pickYellow.play();
  }

  playPickRed() {
    this.pickRed.play();
  }

  playBasket() {
    this.basket.play();
  }

  playMonster() {
    this.monster.play();
  }

}