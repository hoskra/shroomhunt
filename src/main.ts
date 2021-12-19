import * as ECS from '../libs/pixi-ecs';
import { Ticker } from 'pixi.js';
import { addStats, Stats } from 'pixi-stats';

import { WINDOW_WIDTH, WINDOW_HEIGHT, DEBUG_STATS } from './constants/game-constants';
import { Assets } from './constants/enum';
import { GameStatus } from './game-components/game-status';
import { Factory } from './factory';
import { ShroomManager } from './game-components/shroom-manager';
import { SoundComponent } from './game-components/sound-component';
import { PointerInputComponentProps } from '../libs/pixi-ecs/components/pointer-input-component';

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
			.add(Assets.MUSHROOM, './assets/mushroom.png')
			.add(Assets.HEART, './assets/hearts.png')
			.add(Assets.SOUND_ON, './assets/sound_on.png')
			.add(Assets.SOUND_OFF, './assets/sound_off.png')

			.load(() => this.onAssetsLoaded());

			const SC = new SoundComponent();
			this.engine.scene.stage.addComponentAndRun(SC);
	}

	onAssetsLoaded() {

		if(DEBUG_STATS) {
			const stats: Stats = addStats(document, this);
			const ticker: Ticker = Ticker.shared;
			ticker.add(stats.update, stats);
		}


		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent);
		// scene.addGlobalComponent(new ECS.PointerInputComponent(new PointerInputComponentProps()))


		this.engine.scene.stage.addComponentAndRun(new GameStatus());
		this.engine.scene.stage.addComponentAndRun(new ShroomManager());
		this.engine.scene.stage.addComponentAndRun(new Factory(scene));

	}
}

// this will create a new instance as soon as this file is loaded
export default new ShroomHunt();