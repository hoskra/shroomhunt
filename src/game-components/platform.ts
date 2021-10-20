import * as ECS from '../../libs/pixi-ecs';

export class Platform extends ECS.Component {

  public x: number;
  public y: number;
  public width: number;

  constructor(
    public platformID: number,
    data: [number, number, number]
    ) {
      super();
      this.x = data[0];
      this.y = data[1];
      this.width = data[2];
  }

  onInit() {
  }

}