import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants/enum';
import { MAXIMUM_CARRY, SPECIAL_SHROOM_BONUS, WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/game-constants';
import { CAVES, COORDS_PLATFORM, SHROOM_VALID_COORDS, SPECIAL_SHROOM_VALID_COORDS } from '../constants/map-coordinates';
import { GameStatus } from './game-status';
import { ShroomManager } from './shroom-manager';
import { SoundComponent } from './sound-component';

export class Player extends ECS.Component {

  score                 : number = 0;
  takenShrooms          : number = 0;
  move                  : number = 4;
  offset                : number = 25;
  facingLeft            : boolean;
  previousDirectionLeft : boolean;
  jumping               : number = 0;
  entering              : number = 0;
  isStandingOnPlatform  : boolean = true;
  paused                : boolean = false;
  GS: GameStatus;
  SC: SoundComponent;
  SM: ShroomManager;
  KC: ECS.KeyInputComponent;

  constructor(
    public playerID: number,
    private playerConstants: any ) {
      super();
    }

  getScore() {
    return this.score;
  }

  onInit() {
    this.owner.position.x = this.playerConstants.start_x;
    this.owner.position.y = this.playerConstants.start_y;
    this.facingLeft = this.playerConstants.facingLeft;
    this.previousDirectionLeft = this.playerConstants.facingLeft;
    this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);
    this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
    this.SM = this.scene.findGlobalComponentByName<ShroomManager>(ShroomManager.name);
    this.KC = this.scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);

    // flip sprite
    if(!this.facingLeft) this.owner.scale.x *= -1;
		this.subscribe(Messages.GAME_RUNNING, Messages.GAME_PAUSE);
  }

  onMessage(msg: ECS.Message) {
		if (msg.action === Messages.GAME_PAUSE) {
			this.paused = true;
		} else if (msg.action === Messages.GAME_RUNNING) {
			this.paused = false;
		}
	}

  onUpdate(delta: number, absolute: number) {
    if(!this.paused) {
      if(this.KC.isKeyPressed(this.playerConstants.left_code))  { this.moveLeft (delta * 0.25); }
      if(this.KC.isKeyPressed(this.playerConstants.right_code)) { this.moveRight(delta * 0.25); }
      if(this.KC.isKeyPressed(this.playerConstants.jump_code))  { this.jump(); }
      if(this.KC.isKeyPressed(this.playerConstants.down_code))  { this.enterCave(absolute); }

      this.gravity();
      this.processJumping();
      this.processCaveEntering();
      this.avoidFallingOfScreen();
      this.processYellowShroomCollision();
      this.processBasketInteraction();
      this.processRedShroomCollision();
    }
  }

  shroomCnt() {
    let x = this.scene.findObjectByName('collected_player' + (this.playerID+1));
    x.asText().text = this.takenShrooms.toString();
    x.position.x = this.owner.position.x + 5;
    x.position.y = this.owner.position.y - 75;
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
    this.shroomCnt();
    if(this.entering == 0 && this.owner.position.x > this.offset) {
      if(!this.previousDirectionLeft) this.owner.scale.x *= -1;
      this.previousDirectionLeft = true;
      this.owner.position.x -= units;
    }
  }

  moveRight(units: number) {
    this.shroomCnt();
    if(this.entering == 0 && this.owner.position.x < WINDOW_WIDTH - this.offset) {
      if(this.previousDirectionLeft) this.owner.scale.x *= -1;
      this.previousDirectionLeft = false;
      this.owner.position.x += units;
    }
  }

  jump() {
    this.shroomCnt();
    if(this.entering == 0 && this.jumping == 0 && this.isStandingOnPlatform ) {
      this.jumping = 20;
    }
  }

  enterCave(absolute: number) {
    this.shroomCnt();
    if(this.entering == 0) {
      for (let key of Object.keys(CAVES)) {
        if ( Math.abs(this.owner.position.x - CAVES[key].x) < 50 &&  Math.abs(this.owner.position.y - CAVES[key].y) < 10) {
          let pair = CAVES[key].pair;
          this.owner.position.x = CAVES[pair].x;
          this.owner.position.y = CAVES[pair].y;
          this.entering = 20;

          let monster =this.GS.getMonsterPosition();
          if(monster == parseInt(key) || monster == parseInt(pair)) {
            this.beBitten();
          }
          return;
        }
      }
    }
  }

  beBitten() {
    this.SC.playMonster();
    let x = this.scene.findObjectByName('collected_player' + (this.playerID+1));
    this.takenShrooms = 0;
    x.asText().text = this.takenShrooms.toString();
  }

  processRedShroomCollision() {
    SPECIAL_SHROOM_VALID_COORDS.forEach((shroom, index) => {
      if (this.SM.specialShroomVector[index]) {
        if(Math.abs(this.owner.position.x - shroom[1]) <= 8 && Math.abs(this.owner.position.y - shroom[0]) <= 8) {
          this.SM.pickSpecialShroom(index);
          this.score += SPECIAL_SHROOM_BONUS;
          this.writeToScore();
        }
      }
    })
  }

  gravity() {
    this.shroomCnt();
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
  }

  processJumping() {
    if(this.jumping) {
      this.jumping--;
      this.owner.y -= this.move;
      if(this.owner.y <= this.offset) {
        this.jumping = 0;
      }
    }
  }

  processCaveEntering() {
    if(this.entering) {
      this.entering --;

      this.owner.pixiObj.filters = [
        new PIXI.filters.AlphaFilter(1 - (this.entering/20))
      ];
    }
  }

  avoidFallingOfScreen() {
    if(this.owner.y > WINDOW_HEIGHT + 100) {
      this.owner.position.x = this.playerConstants.start_x;
      this.owner.position.y = this.playerConstants.start_y;
    }
  }

  processYellowShroomCollision() {
    if(this.takenShrooms < MAXIMUM_CARRY)
      SHROOM_VALID_COORDS.forEach((shroom, index) => {
        if (this.SM.shroomVector[index]) {
          if(Math.abs(this.owner.position.x - shroom[1]) <= 8 && Math.abs(this.owner.position.y - shroom[0]) <= 8) {
            this.SM.pickShroom(index);
            this.takenShrooms++;
          }
        }
      })
  }

  processBasketInteraction() {
    if(this.takenShrooms) {
      if(Math.abs(this.owner.position.x - this.playerConstants.start_x) <= 30 &&
      Math.abs(this.owner.position.y - this.playerConstants.start_y)    <= 30) {
        this.score += this.takenShrooms;
          this.writeToScore();
          this.takenShrooms = 0;
          this.SC.playBasket();
      }
    }
  }
}