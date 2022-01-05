import * as ECS from '../../libs/pixi-ecs';
import { Messages } from '../constants/enum';
import { TIME_LIMIT } from '../constants/game-constants';

export class TimeCounter extends ECS.Component {
  time: number;
	paused: boolean = false;

	constructor(  ) {
      super();
			this.time = TIME_LIMIT;
		}

	onInit() {
		this.subscribe(Messages.GAME_RUNNING, Messages.GAME_PAUSE);
		setInterval( () => {
			if(!this.paused) {
				this.time --;
			}
			}, 1000)
	}

	onMessage(msg: ECS.Message) {
		if (msg.action === Messages.GAME_PAUSE) {
			this.paused = true;
		} else if (msg.action === Messages.GAME_RUNNING) {
			this.paused = false;
		}
	}

	onUpdate() {
		if (this.time >= 0) {
			let min = Math.floor(this.time / 60);
			let sec = this.time % 60;
			if (sec < 10) sec = "0" + sec;
			this.scene.findObjectByName("time").asText().text = min + ":" + sec;
		} else {
			this.sendMessage(Messages.GAME_FINISH, {} );
			this.finish();
		}
	}
}