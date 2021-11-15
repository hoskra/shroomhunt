import * as ECS from '../../libs/pixi-ecs';

export class SoundComponent extends ECS.Component {

  public pickYellow: any;
  public pickRed: any;
  public basket: any;
  public monster: any;

  constructor() {
    super();
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