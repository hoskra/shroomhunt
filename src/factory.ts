import * as ECS from '../libs/pixi-ecs';
import { Builders } from './builders';
import { Messages } from './constants/enum';
import { GameStatus } from './game-components/game-status';
import { ShroomManager } from './game-components/shroom-manager';
import { SoundComponent } from './game-components/sound-component';
import { WaitInputComponent } from './game-components/wait-input-component';
import { WaitInputRestart } from './game-components/wait-input-restart';
export class Factory extends ECS.Component {
	multiplayer: boolean = false;
	previous: number;
	GS: GameStatus = null;
	SC: SoundComponent = null;

  constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.newGame();
	}

	onInit() {
		this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);
		this.SC = this.scene.findGlobalComponentByName<SoundComponent>(SoundComponent.name);
	}

	loadGame() {
		return new ECS.ChainComponent()
		.call(() => {
			this.SC.playBackgroundMusic();

			Builders.backgroundBuilder(this.scene);
			Builders.caveBuilder(this.scene);
			Builders.platformsBuilder(this.scene);
			Builders.basketsBuilder(this.scene);
			Builders.shroomsBuilder(this.scene);
			Builders.monsterBuilder(this.scene);
			Builders.playersBuilder(this.scene);
			Builders.scoreBuilder(this.scene);
			Builders.muteButtonBuilder(this.scene);

			this.sendMessage(Messages.GAME_RUNNING, {} );
		});
	}

  restartGame() {
		this.sendMessage(Messages.GAME_PAUSE, {} );
		this.SC.stopBackgroundMusic();
    this.scene.stage.destroyChildren();

		Builders.displayScore(this.scene);

		this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
		.waitFor(() => new WaitInputRestart())
		.mergeWith(new ECS.ChainComponent()
		.call(() => {
			this.newGame();
		})));
	}

	newGame() {
		this.scene.stage.destroyChildren();
		this.sendMessage(Messages.GAME_PAUSE, {} );

		Builders.welcomeScreenBuilder(this.scene);

		this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
			.waitFor(() => new WaitInputComponent())
			.mergeWith(this.loadGame()));
	}
}