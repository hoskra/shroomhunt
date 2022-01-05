import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants/enum';
import { MONSTER_DURATION } from '../constants/game-constants';
import { CAVES } from '../constants/map-coordinates';

export class Monster extends ECS.Component {

  private currentTime: number = 0;
  private duration: number = MONSTER_DURATION;
  private paused: boolean = false;

  constructor() {
    super();
  }

  onInit() {
    this.pickRandomLocation();
		this.subscribe(Messages.GAME_RUNNING, Messages.GAME_PAUSE);
  }

  onMessage(msg: ECS.Message) {
		if (msg.action === Messages.GAME_PAUSE) {
			this.paused = true;
		} else if (msg.action === Messages.GAME_RUNNING) {
			this.paused = false;
		}
	}

  pickRandomLocation() {
    let randomCave = Math.floor(Math.random() * (Object.keys(CAVES).length));
    this.owner.position.x = CAVES[randomCave].x;
    this.owner.position.y = CAVES[randomCave].y;
    this.currentTime = 0;
		this.sendMessage(Messages.MONSTER_POSITION, randomCave );
  }

  onUpdate(delta: number, absolute: number) {
    if(!this.paused) {
      this.currentTime += delta * 0.002;
      if (this.currentTime > this.duration) {
          this.pickRandomLocation();
      } else {
        let x = this.duration / this.currentTime;
        let fade = x === 1 ? 1 : 1 - Math.pow(2, -10 * x);;
        this.owner.pixiObj.filters = [
          new PIXI.filters.AlphaFilter(fade)
        ];
      }
    }
  }
}