import * as ECS from '../../libs/pixi-ecs';
import sound from 'pixi-sound'

import { SoundInfo } from '../constants/asset-info';
import { BACKGROUND_VOLUME } from '../constants/game-constants';
import { Messages } from '../constants/enum';
export class SoundComponent extends ECS.Component {

  public pickYellow: any;
  public pickRed: any;
  public basket: any;
  public monster: any;
  public background: any;

  constructor() {
    super();
  }

  onInit() {
    this.pickYellow = sound.Sound.from(SoundInfo.pickYellow);
    this.pickRed = sound.Sound.from(SoundInfo.pickRed);
    this.basket = sound.Sound.from(SoundInfo.basket);
    this.monster = sound.Sound.from(SoundInfo.monster);
    this.background = sound.Sound.from(SoundInfo.background);
    this.subscribe(Messages.PLAY_MUSIC, Messages.STOP_MUSIC, Messages.PLAY_BASKET, Messages.PLAY_MONSTER);
  }

  onMessage(msg: ECS.Message) {
    switch (msg.action) {
      case Messages.PLAY_MUSIC:
        this.playBackgroundMusic();
        break;
      case Messages.STOP_MUSIC:
        this.stopBackgroundMusic();
        break;
      case Messages.PLAY_BASKET:
        this.playBasket();
        break;
      case Messages.PLAY_MONSTER:
        this.playMonster();
        break;
    }
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

  playBackgroundMusic() {
    this.background.play({
      loop: true,
      volume: BACKGROUND_VOLUME
    });
  }
  resumeBackgroundMusic() {
    this.background.resume();
  }
  pauseBackgroundMusic() {
    this.background.pause();
  }
  stopBackgroundMusic() {
    this.background.stop();
  }
  isPlaying() {
    return this.background.isPlaying;
  }
}