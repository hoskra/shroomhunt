import * as ECS from '../libs/pixi-ecs';
import { Assets } from './constants/enum';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './constants/game-constants';
import { COORDS_PLATFORM } from './constants/map-coordinates';
import { player1_constants } from './constants/player-constants';
import { Factory } from './factory';
import { Player } from './game-components/player';

class ShroomHunt {
	engine: ECS.Engine;
	private creature: PIXI.Sprite;

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
			.add(Assets.PLAYER1, './assets/player1.gif')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		let resources = this.engine.app.loader.resources;
		console.log(resources)
		// init the scene and run your game.
		let scene = this.engine.scene;
		scene.addGlobalComponent(new ECS.KeyInputComponent);

		const graphics = new PIXI.Graphics();

		graphics.beginFill(0x8888aa);
		graphics.drawRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
		graphics.endFill();

		COORDS_PLATFORM.forEach(p => {
			graphics.lineStyle(5, 0xFFFFFF);
			graphics.moveTo(p[0], p[1]);
			graphics.lineTo(p[0]+p[2], p[1]);
		});

		graphics.lineStyle(100, 0x555577);
		graphics.moveTo(0, WINDOW_HEIGHT);
		graphics.lineTo(WINDOW_WIDTH, WINDOW_HEIGHT);

		const factory = new Factory();
		factory.loadLevel(this.engine.scene);

		this.engine.app.stage.addChild(graphics);

		this.creature = PIXI.Sprite.from("./assets/player1.gif");
		this.creature.anchor.set(0.5);
		this.creature.x = this.engine.app.screen.width / 2;
		this.creature.y = this.engine.app.screen.height / 2;
		this.engine.app.stage.addChild(this.creature);


		var img = document.createElement('img');
		img.src = "../assets/player1.gif";
		console.log(document.getElementsByTagName("body")[0])
		document.getElementsByTagName("body")[0].appendChild(img)

		let playerrr =  this.engine.app.loader.resources.player1.texture

		new ECS.Builder(scene.stage)
			.localPos(this.engine.app.screen.width * 0.5, this.engine.app.screen.height * 0.2)
			.anchor(0.5)
			.withParent(scene.stage)
			.asText('ShroomHunt', new PIXI.TextStyle({ fill: '#000000', fontSize: 60, fontFamily: 'Courier New' }))
			.build();

			new ECS.Builder(scene)
			.localPos(this.engine.app.screen.width / 2, this.engine.app.screen.height / 2)
			.anchor(0.5)
			.withParent(scene.stage)
			.withComponent(new ECS.FuncComponent('rotation').doOnUpdate((cmp, delta, absolute) => cmp.owner.rotation += 0.001 * delta))
			.asSimplePlane(PIXI.Texture.from(Assets.PLAYER1), 201, 301)
			.scale(1)
			.globalPos(100, 100)
			.build();

			let texture = PIXI.Texture.from(Assets.PLAYER1).clone();

		new ECS.Builder(this.engine.scene)
			.localPos(player1_constants.start_x, player1_constants.start_y)
			.anchor(0.5)
			.asSprite(texture)
			.withParent(scene.stage)
			.withComponent(new Player(0, player1_constants))
			.scale(64)
			.build();


	// 	new ECS.Builder(scene)
	// 		.localPos(this.engine.app.screen.width / 2, this.engine.app.screen.height / 2)
	// 		.anchor(0.5)
	// 		.withParent(scene.stage)
	// 		.withComponent(new ECS.FuncComponent('rotation').doOnUpdate((cmp, delta, absolute) => cmp.owner.rotation += 0.001 * delta))
	// 		.asText('Hello World', new PIXI.TextStyle({ fill: '#FF0000', fontSize: 80, fontFamily: 'Courier New' }))
	// 		.build();
	}
}

// this will create a new instance as soon as this file is loaded
export default new ShroomHunt();