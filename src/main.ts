import * as ECS from '../libs/pixi-ecs';
import { Assets } from './constants/enum';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constants/game-constants';
import { Factory } from './factory';

class ShroomHunt {
	engine: ECS.Engine;

	constructor() {
		this.engine = new ECS.Engine();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, {
			resizeToScreen: true,
			width: WINDOW_WIDTH,
			height: WINDOW_HEIGHT,
			resolution: 1,
			flagsSearchEnabled: false, // searching by flags feature
			statesSearchEnabled: false, // searching by states feature
			tagsSearchEnabled: false, // searching by tags feature
			namesSearchEnabled: true, // searching by names feature
			notifyAttributeChanges: false, // will send message if attributes change
			notifyStateChanges: false, // will send message if states change
			notifyFlagChanges: false, // will send message if flags change
			notifyTagChanges: false, // will send message if tags change
			debugEnabled: false // debugging window
		});

		this.engine.app.loader
			.reset()
			.add(Assets.SPRITESHEET, './assets/spritesheet.png')
			.add(Assets.CAVE1, './assets/cave.gif')
			.add(Assets.MONSTER, './assets/monster.gif')
			.add(Assets.BASKET1, './assets/basket1.gif')
			.add(Assets.BASKET2, './assets/basket2.gif')
			.add(Assets.PLAYER1, './assets/player1.gif')
			.add(Assets.PLAYER2, './assets/player2.gif')
			.add(Assets.SHROOM, './assets/shroom.gif')
			.add(Assets.SPECIAL_SHROOM, './assets/special_shroom.gif')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent);

		const factory = new Factory();
		factory.loadLevel(this.engine.scene);

	}
}

// this will create a new instance as soon as this file is loaded
export default new ShroomHunt();