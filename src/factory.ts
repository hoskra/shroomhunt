import * as ECS from '../libs/pixi-ecs';
import { Builders } from './builders';
import { GameStates, Messages } from './constants/enum';
import { GameStatus } from './game-components/game-status';
import { ShroomManager } from './game-components/shroomManager';
import { WaitInputComponent } from './game-components/wait-input-component';
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

		Builders.welcomeScreenBuilder(scene);

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

		});
	}

	onInit() {
		this.GS = this.scene.findGlobalComponentByName<GameStatus>(GameStatus.name);
	}

	setMultiplayer(multiplayer: boolean) {
		this.multiplayer = multiplayer;
	}

	onUpdate() {

		if (this.GS.getStateId() == GameStates.FINISH) {
			this.sendMessage(Messages.GAME_PAUSE, {} );

			if(this.multiplayer) {
				Builders.finishScreenBuild(this.scene, this.GS.getScore1(), this.GS.getScore2());
			} else {
				Builders.finishScreenBuild(this.scene, this.GS.getScore1());
			}

		}
	}
}