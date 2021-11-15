import * as ECS from '../../libs/pixi-ecs';
import { Assets, Tags } from '../constants/enum';
import { SHROOM_CNT, SPECIAL_SHROOM_CNT } from '../constants/game-constants';
import { SHROOM_VALID_COORDS, SPECIAL_SHROOM_VALID_COORDS } from '../constants/map-coordinates';
import { SoundComponent } from './sound-component';

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export class ShroomManager extends ECS.Component {

  public shroomCnt: number;
  public specialShroomCnt: number;
  public shroomVector: boolean[];
  public specialShroomVector: boolean[];

  SC: SoundComponent;

  constructor() {
    super();
    this.shroomCnt = SHROOM_CNT;
    this.specialShroomCnt = SPECIAL_SHROOM_CNT;
  }

  onInit() {
    this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
  }

  growShrooms(scene: ECS.Scene) {
    this.shroomVector = [];
    for(let i = 0; i < SHROOM_CNT; i++) this.shroomVector.push(1)
    for(let i = 0; i < SHROOM_VALID_COORDS.length - SHROOM_CNT; i++) this.shroomVector.push(0)
    shuffle(this.shroomVector);

    SHROOM_VALID_COORDS.forEach((shroom, index) => {
      if(this.shroomVector[index])
        new ECS.Builder(scene.stage)
        .localPos(shroom[1], shroom[0])
        .anchor(0.5, 1)
        .withTag(Tags.SHROOM)
        .withParent(scene.stage)
        .asSprite(PIXI.Texture.from(Assets.SHROOM))
        .withName("shroom" + index)
        .build();
    } )
  }

  growSpecialShrooms(scene: ECS.Scene) {
    this.specialShroomVector = [];
    for(let i = 0; i < SPECIAL_SHROOM_CNT; i++) this.specialShroomVector.push(1)
    for(let i = 0; i < SPECIAL_SHROOM_VALID_COORDS.length - SPECIAL_SHROOM_CNT; i++) this.specialShroomVector.push(0)
    shuffle(this.specialShroomVector);

    SPECIAL_SHROOM_VALID_COORDS.forEach((shroom, index) => {
      if(this.specialShroomVector[index])
        new ECS.Builder(scene.stage)
          .localPos(shroom[1], shroom[0])
          .anchor(0.5, 1)
          .withTag(Tags.SPECIAL_SHROOM)
          .withParent(scene.stage)
          .asSprite(PIXI.Texture.from(Assets.SPECIAL_SHROOM))
          .withName("special_shroom" + index)
          .build();
    } )
  }

  pickShroom(index: number) {
    this.SC.playPickYellow();

    this.shroomVector[index] = false;
    let s = this.scene.findObjectByName("shroom" + index);
    if(s) {
      s.destroy()
    }

    this.shroomCnt--;
  }

  pickSpecialShroom(index: number) {
    this.SC.playPickRed();

    this.specialShroomVector[index] = false;
    let s = this.scene.findObjectByName("special_shroom" + index);
    if(s) {
      s.destroy()
    }

    this.specialShroomCnt--;
  }

  onUpdate() {
    if(this.shroomCnt == 0) {
      this.shroomCnt = SHROOM_CNT;
      this.growShrooms(this.scene);
    }
    if(this.specialShroomCnt == 0) {
      this.specialShroomCnt = SPECIAL_SHROOM_CNT;
      this.growSpecialShrooms(this.scene);
    }
  }
}