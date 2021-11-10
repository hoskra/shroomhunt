import * as ECS from '../libs/pixi-ecs';
import { Builders } from './builders';
import { GameStates, Messages } from './constants/enum';
import { GameStatus } from './game-components/game-status';
import { ShroomManager } from './game-components/shroomManager';
import { WaitInputComponent } from './game-components/wait-input-component';
import { WaitInputRestart } from './game-components/wait-input-restart';
export class Factory extends ECS.Component {
	scene : ECS.Scene;
	multiplayer: boolean;
	previous: number;
	SM: ShroomManager = null;
	GS: GameStatus = null;

  constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.multiplayer = false;
		this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);

		this.newGame();
	}

	newGame() {
		this.scene.stage.destroyChildren();
		this.sendMessage(Messages.GAME_PAUSE, {} );

		Builders.welcomeScreenBuilder(this.scene);

		this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
			.waitFor(() => new WaitInputComponent())
			.mergeWith(this.loadGame()));
	}

	loadGame() {
		return new ECS.ChainComponent()
		.call(() => {

			Builders.backgroundBuilder(this.scene);
			Builders.caveBuilder(this.scene, true);
			Builders.platformsBuilder(this.scene);
			Builders.basketsBuilder(this.scene);

			this.SM = this.scene.findGlobalComponentByName<ShroomManager>(ShroomManager.name);
			this.SM.growShrooms(this.scene);
			this.SM.growSpecialShrooms(this.scene);

			Builders.monsterBuilder(this.scene);
			Builders.playersBuilder(this.scene);
			Builders.scoreBuilder(this.scene);

			this.sendMessage(Messages.GAME_RUNNING, {} );
		});
	}

  restartGame() {
		this.sendMessage(Messages.GAME_PAUSE, {} );
    this.scene.stage.destroyChildren();

		// display score
		if(this.GS.isMultiplayer()) {
			Builders.finishScreenBuild(this.scene, this.GS.getScore1(), this.GS.getScore2());
		} else {
			Builders.finishScreenBuild(this.scene, this.GS.getScore1());
		}

		this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
		.waitFor(() => new WaitInputRestart())
		.mergeWith(new ECS.ChainComponent()
		.call(() => {
			this.newGame();
		})));
	}

	onUpdate() {
		if (this.GS.getStateId() == GameStates.FINISH) {
			this.restartGame();
		}
	}
}