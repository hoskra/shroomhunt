import * as ECS from '../libs/pixi-ecs';
import { Player } from './game-components/player';
import { player1_constants, player2_constants } from './constants/player-constants';
import { Assets } from './constants/enum';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './constants/game-constants';
import { CAVES, COORDS_PLATFORM, SHROOM_VALID_COORDS, SPECIAL_SHROOM_VALID_COORDS } from './constants/map-coordinates';
export class Factory {

	loadLevel (scene: ECS.Scene) {

		// TODO : why noy working ?
		const keyInputCmp2 = scene.findGlobalComponentByName<ECS.KeyInputComponent>(ECS.KeyInputComponent.name);
    if(keyInputCmp2 && keyInputCmp2.isKeyPressed(32)) {
			console.log("Spacebar in Factory works!")
		}

		this.welcomeScreen(scene);

		this.drawBackground(scene);
		this.drawCaves(scene);
		this.drawPlatforms(scene);
		this.drawBaskets(scene);
		this.drawShrooms(scene);
		this.drawSpecialShrooms(scene);
		this.drawPlayers(scene);
	}

	welcomeScreen (scene: ECS.Scene) {
		new ECS.Builder(scene.stage).localPos(WINDOW_WIDTH* 0.5, WINDOW_HEIGHT* 0.3).anchor(0.5).withParent(scene.stage).asText('ShroomHunt', new PIXI.TextStyle({ fill: '#ffffff', fontSize: 60, fontFamily: 'Courier New' })).build();
		new ECS.Builder(scene.stage).localPos(WINDOW_WIDTH* 0.5, WINDOW_HEIGHT* 0.5).anchor(0.5).withParent(scene.stage).asText('1 player', new PIXI.TextStyle({ fill: '#ffffff', fontSize: 40, fontFamily: 'Courier New' })).build();
		// .withComponent(new ECS.FuncComponent('rotation').doOnUpdate((cmp, delta, absolute) =>  {cmp.owner.rotation += (Math.sin(absolute) * 0.1 ) }))
		new ECS.Builder(scene.stage).localPos(WINDOW_WIDTH* 0.5, WINDOW_HEIGHT* 0.6).anchor(0.5).withParent(scene.stage).asText('2 players', new PIXI.TextStyle({ fill: '#ffffff', fontSize: 40, fontFamily: 'Courier New' })).build();

		let rectWidth = 300;
		let rectHeight = 50;

		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xFFFFFF, 0);
		graphics.lineStyle(5, 0xFF0000);
		graphics.drawRect(WINDOW_WIDTH* 0.5 -rectWidth/2, WINDOW_HEIGHT* 0.5 - rectHeight/2, WINDOW_WIDTH* 0.5, WINDOW_HEIGHT* 0.5);
		scene.stage.addChild(graphics);
	}

	drawBaskets(scene: ECS.Scene) {
		new ECS.Builder(scene).localPos(player1_constants.start_x, player1_constants.start_y).anchor(0.5, 0.6).asSprite(PIXI.Texture.from(Assets.BASKET1)).withParent(scene.stage).build();
		new ECS.Builder(scene).localPos(player2_constants.start_x, player2_constants.start_y).anchor(0.5, 0.6).withParent(scene.stage).asSprite(PIXI.Texture.from(Assets.BASKET2)).build();
	}

	drawPlayers(scene: ECS.Scene) {
		new ECS.Builder(scene).anchor(0.5, 1).withParent(scene.stage).asSprite(PIXI.Texture.from(Assets.PLAYER1)).withComponent(new Player(0, player1_constants)) .build();
		new ECS.Builder(scene).anchor(0.5, 1).withParent(scene.stage).asSprite(PIXI.Texture.from(Assets.PLAYER2)).withComponent(new Player(1, player2_constants)).build();
	}

	drawCaves(scene: ECS.Scene) {
		Object.keys(CAVES).forEach(function (key) {
			new ECS.Builder(scene.stage).localPos(CAVES[key].x, CAVES[key].y - 0).anchor(0.5, 1).withParent(scene.stage).asSprite(PIXI.Texture.from(Assets.CAVE1)).withName(key).build();
			if (Math.random() < 0.5) scene.findObjectByName(key).scale.x *= -1;
			new ECS.Builder(scene.stage).localPos(CAVES[key].x, CAVES[key].y - 10).anchor(0.5, 1)
			.withParent(scene.stage).asText(key, new PIXI.TextStyle({ fill: '#ffffff', fontSize: 40, fontFamily: 'Courier New' })).build();
			new ECS.Builder(scene.stage).localPos(CAVES[key].x, CAVES[key].y - 50).anchor(0.5, 1)
			.withParent(scene.stage).asText(CAVES[key].pair, new PIXI.TextStyle({ fill: '#ffffff', fontSize: 20, fontFamily: 'Courier New' })).build();
		});
	}

	drawShrooms(scene: ECS.Scene) {
		let shroom_vector = [];

		SHROOM_VALID_COORDS.forEach(shroom => {
			shroom[1].forEach(element => {
				if (Math.random() < 0.5)
					shroom_vector.push(0)
				else
					shroom_vector.push(1)
			});
		});

		let id = 0;
		SHROOM_VALID_COORDS.forEach(shroomRow => {
			id++;
			shroomRow[1].forEach((shroomX) => {
				if(shroom_vector[id])
					new ECS.Builder(scene.stage)
					.localPos(shroomX, shroomRow[0]).anchor(0.5, 1)
					.withParent(scene.stage).asSprite(PIXI.Texture.from(Assets.SHROOM)).withName(id).build();
				})
		} )
	}

	drawSpecialShrooms(scene: ECS.Scene) {
		let shroom_vector = [];

		SHROOM_VALID_COORDS.forEach(shroom => {
			shroom[1].forEach(element => {
				if (Math.random() < 0.5)
					shroom_vector.push(0)
				else
					shroom_vector.push(1)
			});
		});

		let id = 0;
		SPECIAL_SHROOM_VALID_COORDS.forEach(shroomRow => {
			id++;
			shroomRow[1].forEach((shroomX) => {
				if(shroom_vector[id])
					new ECS.Builder(scene.stage)
					.localPos(shroomX - 10, shroomRow[0]).anchor(0.5, 1)
					.withParent(scene.stage).asSprite(PIXI.Texture.from(Assets.SPECIAL_SHROOM)).withName(id).build();
				})
		} )
	}

	drawBackground(scene: ECS.Scene) {
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0x8888aa);
		graphics.drawRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
		graphics.endFill();
		scene.stage.addChild(graphics);
	}

	drawPlatforms(scene: ECS.Scene) {
		const graphics = new PIXI.Graphics();
		COORDS_PLATFORM.forEach(p => {
			graphics.lineStyle(5, 0xFFFFFF);
			graphics.moveTo(p[0],      p[1]);
			graphics.lineTo(p[0]+p[2], p[1]);
		});
		graphics.lineStyle(100, 0x555577);
		graphics.moveTo(0, WINDOW_HEIGHT);
		graphics.lineTo(WINDOW_WIDTH, WINDOW_HEIGHT);
		scene.stage.addChild(graphics);
	}
}