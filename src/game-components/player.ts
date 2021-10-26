import * as ECS from '../../libs/pixi-ecs';
import { WINDOW_WIDTH } from '../constants/game-constants';
import { CAVES, COORDS_PLATFORM } from '../constants/map-coordinates';

export class Player extends ECS.Component {

  score: number;
  health: number;
  move: number = 4;
  offset: number = 25;
  facingLeft: boolean;
  previousDirectionLeft: boolean;
  jumping: number;
  entering: number;
  isStandingOnPlatform: boolean;

  constructor(
    public playerID: number,
    private playerConstants: any ) {
      super();
    }

  onInit() {
    this.owner.position.x = this.playerConstants.start_x;
    this.owner.position.y = this.playerConstants.start_y;
    this.facingLeft = this.playerConstants.facingLeft;
    this.previousDirectionLeft = this.playerConstants.facingLeft;
    this.score = 0;
    this.health = 0;
    this.jumping = 0;
    this.entering = 0;
    this.isStandingOnPlatform = true;
    if(!this.facingLeft) this.owner.scale.x *= -1;
  }

  onUpdate(delta: number, absolute: number) {
    const keyInputCmp = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    if(keyInputCmp.isKeyPressed(this.playerConstants.left_code))  { this.moveLeft (delta * 0.25); }
    if(keyInputCmp.isKeyPressed(this.playerConstants.right_code)) { this.moveRight(delta * 0.25); }
    if(keyInputCmp.isKeyPressed(this.playerConstants.jump_code))  { this.jump(); }
    if(keyInputCmp.isKeyPressed(this.playerConstants.down_code))  { this.enterCave(absolute); }

    let standingOnPlatform = -1;
    COORDS_PLATFORM.forEach((platform, index) => {
      if(Math.abs(this.owner.y - platform[1]) <= 3) {
        if(this.owner.x > platform[0] && this.owner.x < platform[0] + platform[2]) {
          standingOnPlatform = index;
          this.isStandingOnPlatform = true;
        }
      }
    });

    if(standingOnPlatform == -1 ) this.isStandingOnPlatform = false;

    if(!this.jumping && !this.isStandingOnPlatform ) {
      this.owner.y += this.move;
    }

    if(this.jumping) {
      this.jumping --;
      this.owner.y -= this.move;
      if(this.owner.y <= this.offset) {
        this.jumping = 0;
      }
    }

    if(this.entering ) {
      this.entering --;
    }

  }

  moveLeft(units: number) {
    if(this.entering == 0 && this.owner.position.x > this.offset) {
      if(!this.previousDirectionLeft) this.owner.scale.x *= -1;
      this.previousDirectionLeft = true;
      this.owner.position.x -= units;
    }
  }

  moveRight(units: number) {
    if(this.entering == 0 && this.owner.position.x < WINDOW_WIDTH - this.offset) {
      if(this.previousDirectionLeft) this.owner.scale.x *= -1;
      this.previousDirectionLeft = false;
      this.owner.position.x += units;
    }
  }

  jump() {
    if(this.entering == 0 && this.jumping == 0 && this.isStandingOnPlatform ) {
      this.jumping = 20;
    }
  }

  enterCave(absolute: number) {

    if(this.entering == 0) {

      for (let key of Object.keys(CAVES)) {

      // Object.keys(CAVES).forEach((key) => {
        if ( Math.abs(this.owner.position.x - CAVES[key].x) < 50 &&  Math.abs(this.owner.position.y - CAVES[key].y) < 10) {
          let pair = CAVES[key].pair;
          // console.log(key + "   " +pair)
          this.owner.position.x = CAVES[pair].x;
          this.owner.position.y = CAVES[pair].y;
          this.entering = 20;
          return;
        }
      // });
      }
    }
  }

}