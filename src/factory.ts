import * as ECS from '../libs/pixi-ecs';
import { Player } from './game-components/player';
import { player1_constants, player2_constants } from './constants/player-constants';
import { Assets } from './constants/enum';
import { SpritesheetInfo } from './constants/spritesheet-info';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './constants/game-constants';

export class Factory {
  loadLevel (scene: ECS.Scene) {


		// const base = new BaseTexture('./assets/player1.png')
		// base.setSize(64, 64) // Original image size
		// const playerTexture = new Texture(base)
		// playerTexture.frame = new Rectangle(0, 0, 40, 40)

		// let texture = PIXI.Texture.from('./assets/spritesheet.png', {width: 232, height: 166}).clone();
		// texture.frame = new PIXI.Rectangle(SpritesheetInfo.player2.x, SpritesheetInfo.player2.y,
		// 		SpritesheetInfo.player2.width, SpritesheetInfo.player2.height);

		// const sceneHeight = SCENE_WIDTH / (scene.app.view.width / scene.app.view.height);
		// scene.assignGlobalAttribute('scene_height', sceneHeight);


		// new ECS.Builder(scene)
		// 	.localPos(player1_constants.start_x, player1_constants.start_y)
		// 	.anchor(0.5)
		// 	// .asSprite(PIXI.Texture.from('./assets/player1.gif'))
		// 	.asSprite(PIXI.Texture.from(Assets.PLAYER1))
		// 	.withParent(scene.stage)
		// 	.withComponent(new Player(0, player1_constants))
		// 	.build();

			let x = new ECS.Builder(scene)
			.localPos(100, 100)
			.anchor(0.5)
			.withParent(scene.stage)
			.asText('Hello World', new PIXI.TextStyle({ fill: '#FF0000', fontSize: 80, fontFamily: 'Courier New' }))
			.build();

			x.vertexData = [215.5, 537, 744.5, 537, 744.5, 615, 215.5, 615];


				console.log(scene)
			// new ECS.Builder(scene)
			// .anchor(0.5)
			// .asSprite(this.createTexture(
			// 	SpritesheetInfo.player2.x, SpritesheetInfo.player2.y,
			// 	SpritesheetInfo.player2.width, SpritesheetInfo.player2.height))
			// .withParent(scene.stage)
			// .withComponent(new Player(0, player2_constants))
			// .build();
  }

  private createTexture(offsetX: number, offsetY: number, width: number, height: number) {
		let texture = PIXI.Texture.from('spritesheet').clone();
		texture.frame = new PIXI.Rectangle(offsetX, offsetY, width, height);
		return texture;
	}
}