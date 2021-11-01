import * as ECS from '../libs/pixi-ecs';
import { Builders } from './builders';
import { WaitInputComponent } from './game-components/wait-input-component';
export class Factory extends ECS.Component {

	scene : ECS.Scene;
	multiplayer: boolean;

  constructor(scene: ECS.Scene) {
		super();
		this.scene = scene;
		this.multiplayer = false;

		Builders.welcomeScreenBuilder(scene);

		this.scene.addGlobalComponentAndRun(new ECS.ChainComponent()
			.waitFor(() => new WaitInputComponent())
			.mergeWith(this.loadGame()));
	}

	setMultiplayer(multiplayer: boolean) {
		this.multiplayer = multiplayer;
	}

	loadGame() {
		return new ECS.ChainComponent()
		.call(() => {
			Builders.backgroundBuilder(this.scene);
			Builders.caveBuilder(this.scene, true);
			Builders.platformsBuilder(this.scene);
			Builders.basketsBuilder(this.scene, this.multiplayer);
			Builders.shroomsBuilder(this.scene, 15, false);
			Builders.shroomsBuilder(this.scene, 3, true);
			Builders.monsterBuilder(this.scene);
			Builders.playersBuilder(this.scene, this.multiplayer);

			Builders.scoreBuilder(this.scene, this.multiplayer);

			console.log(this.multiplayer)
		});
	}
}