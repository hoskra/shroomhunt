import * as ECS from '../libs/pixi-ecs';
import { Player } from './game-components/player';
import { player1_constants, player2_constants } from './constants/player-constants';
import { Assets } from './constants/enum';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './constants/game-constants';
import { COORDS_CAVE, COORDS_PLATFORM } from './constants/map-coordinates';
import { Cave } from './game-components/cave';

export class Factory {
  loadLevel (scene: ECS.Scene) {

		// platforms
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0x8888aa);
		graphics.drawRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
		graphics.endFill();
		COORDS_PLATFORM.forEach(p => {
			graphics.lineStyle(5, 0xFFFFFF);
			graphics.moveTo(p[0],      p[1] + 7);
			graphics.lineTo(p[0]+p[2], p[1] + 7);
		});
		graphics.lineStyle(100, 0x555577);
		graphics.moveTo(0, WINDOW_HEIGHT);
		graphics.lineTo(WINDOW_WIDTH, WINDOW_HEIGHT);
		scene.stage.addChild(graphics);

		// caves
		// let caves = new ECS.Container('caves');
		let id=0;
		COORDS_CAVE.forEach(cave => {
			let name = "cave" + id++;
			new ECS.Builder(scene.stage)
			.anchor(0.5)
			.withParent(scene.stage)
			.asSprite(PIXI.Texture.from(Assets.CAVE1))
			.withComponent(new Cave(cave[0], cave[1]))
			.withName(name)
			.build();

			if (Math.random() < 0.5) scene.findObjectByName(name).scale.x *= -1;
		});

		// baskets
		new ECS.Builder(scene)
		.localPos(player1_constants.start_x, player1_constants.start_y)
		.anchor(0.5)
		.asSprite(PIXI.Texture.from(Assets.BASKET1))
		.withParent(scene.stage)
		.build();
		new ECS.Builder(scene)
		.localPos(player2_constants.start_x, player2_constants.start_y)
		.anchor(0.5)
		.withParent(scene.stage)
		.asSprite(PIXI.Texture.from(Assets.BASKET2))
		.build();

		// players
		new ECS.Builder(scene)
		.anchor(0.5)
		.withParent(scene.stage)
		.asSprite(PIXI.Texture.from(Assets.PLAYER1))
		.withComponent(new Player(0, player1_constants))
		.build();
		new ECS.Builder(scene.stage)
		.anchor(0.5)
		.withParent(scene.stage)
		.asSprite(PIXI.Texture.from(Assets.PLAYER2))
		.withComponent(new Player(1, player2_constants))
		.build();

		// shroomhunt
		new ECS.Builder(scene.stage)
		.localPos(WINDOW_HEIGHT* 0.5, WINDOW_HEIGHT* 0.96)
		.anchor(0.5)
		.withParent(scene.stage)
		.asText('ShroomHunt', new PIXI.TextStyle({ fill: '#000000', fontSize: 60, fontFamily: 'Courier New' }))
		.build();
  }
}