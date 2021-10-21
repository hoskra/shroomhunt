import * as ECS from '../../libs/pixi-ecs';

export class Cave extends ECS.Component {

  constructor(public x: number, public y: number) {
      super();
  }

  onInit() {
    this.owner.position.x = this.x;
    this.owner.position.y = this.y - 35;
  }

}