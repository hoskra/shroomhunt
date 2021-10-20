import * as ECS from '../../libs/pixi-ecs';
import { MONSTER_DURATION } from '../constants/game-constants';

export class Monster extends ECS.Component {

  duration: number;

  constructor(public cave: number) {
    super();
  }

  onInit() {
    this.duration = MONSTER_DURATION;
  }

}