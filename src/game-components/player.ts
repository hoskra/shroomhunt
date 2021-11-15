import * as ECS from '../../libs/pixi-ecs';
import { MAXIMUM_CARRY, SHROOM_CNT, SPECIAL_SHROOM_BONUS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/game-constants';
import { CAVES, COORDS_PLATFORM, SHROOM_VALID_COORDS, SPECIAL_SHROOM_VALID_COORDS } from '../constants/map-coordinates';
import { GameStatus } from './game-status';
import { ShroomManager } from './shroom-manager';
import { SoundComponent } from './sound-component';

export class Player extends ECS.Component {

  score: number;
  takenShrooms: number;
  health: number;
  move: number = 4;
  offset: number = 25;
  facingLeft: boolean;
  previousDirectionLeft: boolean;
  jumping: number;
  entering: number;
  isStandingOnPlatform: boolean;
  GS: GameStatus;
  SC: SoundComponent;
  shroomManagerCmp: ShroomManager;
  
  constructor(
    public playerID: number,
    private playerConstants: any ) {
      super();
    }
    
    getScore() { return this.score; }
    
    onInit() {
      this.owner.position.x = this.playerConstants.start_x;
      this.owner.position.y = this.playerConstants.start_y;
      this.facingLeft = this.playerConstants.facingLeft;
      this.previousDirectionLeft = this.playerConstants.facingLeft;
      this.score = 0;
      this.takenShrooms = 0;
      this.health = 0;
      this.jumping = 0;
      this.entering = 0;
      this.isStandingOnPlatform = true;
      this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);
      this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
      this.shroomManagerCmp = this.scene.findGlobalComponentByName<ShroomManager>(ShroomManager.name);

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

    if(this.owner.y > WINDOW_HEIGHT + 100) {
      this.owner.position.x = this.playerConstants.start_x;
      this.owner.position.y = this.playerConstants.start_y;
    }

    if(this.takenShrooms < MAXIMUM_CARRY)
      SHROOM_VALID_COORDS.forEach((shroom, index) => {
        if (this.shroomManagerCmp.shroomVector[index]) {
          if(Math.abs(this.owner.position.x - shroom[1]) <= 8 && Math.abs(this.owner.position.y - shroom[0]) <= 8) {
            this.shroomManagerCmp.pickShroom(index);
            this.takenShrooms++;
          }
        }
      })

    if(this.takenShrooms) {
      if(Math.abs(this.owner.position.x - this.playerConstants.start_x) <= 30 &&
      Math.abs(this.owner.position.y - this.playerConstants.start_y)    <= 30) {
        this.score += this.takenShrooms;
          this.writeToScore();
          this.takenShrooms = 0;
          this.SC.playBasket();
      }
    }


    SPECIAL_SHROOM_VALID_COORDS.forEach((shroom, index) => {
      if (this.shroomManagerCmp.specialShroomVector[index]) {
        if(Math.abs(this.owner.position.x - shroom[1]) <= 8 && Math.abs(this.owner.position.y - shroom[0]) <= 8) {
          this.shroomManagerCmp.pickSpecialShroom(index);
          this.score += SPECIAL_SHROOM_BONUS;
          this.writeToScore();
        }
      }
    })

  }

  writeToScore() {
    let name = "p";
    if(this.playerID == 0) name += "1";
    else if(this.playerID == 1) name += "2";
    name += "_score";
    let s = this.scene.findObjectByName(name);
    s.asText().text = this.score.toString();

    if(this.playerID == 0) this.GS.setScore1(this.score);
    else if(this.playerID == 1) this.GS.setScore2(this.score);
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