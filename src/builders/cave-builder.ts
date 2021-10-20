import * as ECS from '../../libs/pixi-ecs';
import { COORDS_PLATFORM } from '../constants/map-coordinates';
import { Platform } from '../game-components/platform';

export class PlatformBuilder extends ECS.Component {

  public x: number;
  public y: number;
  public width: number;

  constructor( data : [number, number, number] ) {
    super();
    this.x = data[0];
    this.y = data[1];
    this.width = data[2];
  }

  build() {
    let platforms = new ECS.Container('platforms');
    let id = 0;
      COORDS_PLATFORM.forEach(platform => {
        platforms.addComponent(new Platform(id++, platform));
    });

    // this.scene.stage.addGlobalComponent(platforms)
  }

}