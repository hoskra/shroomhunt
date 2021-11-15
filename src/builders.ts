import * as ECS from '../libs/pixi-ecs';
import { Component } from '../libs/pixi-ecs';
import { Assets, Colors } from './constants/enum';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from './constants/game-constants';
import { CAVES, COORDS_PLATFORM } from './constants/map-coordinates';
import { player1_constants, player2_constants } from './constants/player-constants';
import { GameStatus } from './game-components/game-status';
import { Monster } from './game-components/monster';
import { Player } from './game-components/player';
import { ShroomManager } from './game-components/shroom-manager';

import { TimeCounter } from './game-components/time-counter'

export class Builders {

  static shroomsBuilder(scene: ECS.Scene) {
    const SM = scene.findGlobalComponentByName<ShroomManager>(ShroomManager.name);
    SM.growShrooms(scene);
    SM.growSpecialShrooms(scene);
  }

  static textBuilder = (scene: ECS.Scene, x: number, y: number, text: string, fontSize: number, name: string = text) => {
    new ECS.Builder(scene.stage)
      .localPos(x, y)
      .anchor(0.5)
      .withName(name)
      .withParent(scene.stage)
      .asText(text, new PIXI.TextStyle({ fill: '#ffffff', fontSize: fontSize, fontFamily: 'Courier New' }))
      .build();
  }

  static simpleBuilder = (scene: ECS.Scene, x: number, y: number, anchor_x: number, anchor_y: number, asset: string)  => {
    new ECS.Builder(scene)
    .localPos(x, y)
    .anchor(anchor_x, anchor_y)
    .asSprite(PIXI.Texture.from(asset))
    .withParent(scene.stage).build();
  }

  static playerBuilder = (scene: ECS.Scene, anchor_x: number, anchor_y: number, asset: string, cmp: Component<any>, name: string)  => {
    new ECS.Builder(scene)
    .anchor(anchor_x, anchor_y)
    .asSprite(PIXI.Texture.from(asset))
    .withComponent(cmp)
    .withName(name)
    .withParent(scene.stage).build();
  }

  static welcomeScreenBuilder = (scene: ECS.Scene) => {
    let center = WINDOW_WIDTH*0.1;
    this.textBuilder(scene, WINDOW_WIDTH * 0.5, WINDOW_HEIGHT * 0.2, "Shroomhunt", 70, "Shroomhunt");
    this.textBuilder(scene, WINDOW_WIDTH * 0.5 - center, WINDOW_HEIGHT * 0.5, "1 player ", 40, "1p");
    this.simpleBuilder(scene,  WINDOW_WIDTH * 0.8 - center, WINDOW_HEIGHT * 0.5, 0.5, 0.6, Assets.PLAYER1)
    this.textBuilder(scene, WINDOW_WIDTH * 0.5 - center, WINDOW_HEIGHT * 0.6, "2 players", 40, "2p");
    this.simpleBuilder(scene,  WINDOW_WIDTH * 0.75 - center, WINDOW_HEIGHT * 0.6, 0.5, 0.6, Assets.PLAYER1)
    this.simpleBuilder(scene,  WINDOW_WIDTH * 0.85 - center, WINDOW_HEIGHT * 0.6, 0.5, 0.6, Assets.PLAYER2)
    this.textBuilder(scene, WINDOW_WIDTH * 0.35 - center, WINDOW_HEIGHT * 0.5, ">", 40, "selection");

    this.textBuilder(scene, WINDOW_WIDTH * 0.5, WINDOW_HEIGHT * 0.9, ".. press enter to start the game ..", 30, "note");
  }

  static displayScore = (scene: ECS.Scene) => {
		const GS = scene.findGlobalComponentByName<GameStatus>(GameStatus.name);
    let score1 = GS.getScore1();
    let score2 = GS.getScore2();

    const graphics = new PIXI.Graphics();

    graphics.beginFill(0x000000);
		graphics.drawRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
		graphics.endFill();

    scene.stage.addChild(graphics);

    if(!GS.isMultiplayer()) {
      this.textBuilder(scene, WINDOW_WIDTH * 0.5, WINDOW_HEIGHT * 0.2, "New high score!", 70, "gameover");
      this.textBuilder(scene, WINDOW_WIDTH * 0.4, WINDOW_HEIGHT * 0.5, "Player 1 score: " + score1, 40, "1p");
      this.simpleBuilder(scene,  WINDOW_WIDTH * 0.8, WINDOW_HEIGHT * 0.5, 0.5, 0.6, Assets.PLAYER1)

    } else {

      let message = "Player 1 wins!";
      if(score1 < score2) message = "Player 2 wins!";
      else if(score1 == score2) message = "It's a tie!";

      this.textBuilder(scene, WINDOW_WIDTH * 0.5, WINDOW_HEIGHT * 0.3, message, 60, "gameover");
      this.textBuilder(scene, WINDOW_WIDTH * 0.4, WINDOW_HEIGHT * 0.5, "Player 1 score: " + score1, 40, "1p");
      this.simpleBuilder(scene,  WINDOW_WIDTH * 0.75, WINDOW_HEIGHT * 0.5, 0.5, 0.6, Assets.PLAYER1)
      this.textBuilder(scene, WINDOW_WIDTH * 0.4, WINDOW_HEIGHT * 0.6, "Player 2 score: " + score2, 40, "2p");
      this.simpleBuilder(scene,  WINDOW_WIDTH * 0.75, WINDOW_HEIGHT * 0.6, 0.5, 0.6, Assets.PLAYER2)
    }

    this.textBuilder(scene, WINDOW_WIDTH * 0.5, WINDOW_HEIGHT * 0.9, ".. press enter to continue ..", 30, "note");

  }

  static basketsBuilder(scene: ECS.Scene) {
    this.simpleBuilder(scene, player1_constants.start_x, player1_constants.start_y, 0.5, 0.6, Assets.BASKET1)
		const GS = scene.findGlobalComponentByName<GameStatus>(GameStatus.name);

    GS.isMultiplayer() && this.simpleBuilder(scene, player2_constants.start_x, player2_constants.start_y, 0.5, 0.6, Assets.BASKET2)
	}

  static playersBuilder(scene: ECS.Scene) {
    this.playerBuilder(scene, 0.5, 1, Assets.PLAYER1, new Player(0, player1_constants), "player1");
		const GS = scene.findGlobalComponentByName<GameStatus>(GameStatus.name);

    GS.isMultiplayer() && this.playerBuilder(scene, 0.5, 1, Assets.PLAYER2, new Player(1, player2_constants), "player2");
	}

  static caveBuilder(scene: ECS.Scene, debug: boolean = false) {
		Object.keys(CAVES).forEach((key) => {
			new ECS.Builder(scene.stage)
				.localPos(CAVES[key].x, CAVES[key].y - 0)
				.anchor(0.5, 1)
				.withParent(scene.stage)
				.asSprite(PIXI.Texture.from(Assets.CAVE1))
				.withName(key)
				.build();

      if (Math.random() < 0.5)
				scene.findObjectByName(key).scale.x *= -1;

      if (debug) {
        this.textBuilder(scene, CAVES[key].x, CAVES[key].y - 30, key, 35, key);
        this.textBuilder(scene, CAVES[key].x, CAVES[key].y - 60, CAVES[key].pair, 15, CAVES[key].pair);
      }
		});
	}

  static backgroundBuilder(scene: ECS.Scene) {
		const graphics = new PIXI.Graphics();

    graphics.beginFill(Colors.BACKGROUND);
		graphics.drawRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
		graphics.endFill();

    graphics.lineStyle(120, Colors.SCORE_BACKGROUND);
    graphics.moveTo(0, WINDOW_HEIGHT);
    graphics.lineTo(WINDOW_WIDTH, WINDOW_HEIGHT);

    scene.stage.addChild(graphics);
	}

	static platformsBuilder(scene: ECS.Scene) {
		const graphics = new PIXI.Graphics();
		COORDS_PLATFORM.forEach(p => {
			graphics.lineStyle(5, Colors.PLATFORM);
			graphics.moveTo(p[0],      p[1]);
			graphics.lineTo(p[0]+p[2], p[1]);
		});
		scene.stage.addChild(graphics);
	}

	static playerStats(scene: ECS.Scene, x: number, y: number, scoreName: string, healthName: string) {
    let mushroom_offset = 55;
    let heart_offset    = 35;

    this.textBuilder(scene, x, y, "0", 35, scoreName);
    new ECS.Builder(scene)
      .localPos(x + mushroom_offset, y)
      .anchor(0.5)
      .asSprite(PIXI.Texture.from(Assets.MUSHROOM))
      .withParent(scene.stage)
      .scale(0.7)
      .build();

    x += 150;

    this.textBuilder(scene, x, y, "3", 35, healthName);
    new ECS.Builder(scene)
      .localPos(x + heart_offset, y)
      .anchor(0.5)
      .asSprite(PIXI.Texture.from(Assets.HEART))
      .withParent(scene.stage)
      .scale(0.7)
      .build();
  }

  static scoreBuilder(scene: ECS.Scene) {
		const GS = scene.findGlobalComponentByName<GameStatus>(GameStatus.name);

    let y = 9.6*WINDOW_HEIGHT/10;
    let f = WINDOW_WIDTH/10;

    new ECS.Builder(scene.stage)
      .localPos(f*5, y)
      .anchor(0.5)
      .withName("time")
      .withParent(scene.stage)
      .asText("00:00", new PIXI.TextStyle({ fill: '#ffffff', fontSize: 35, fontFamily: 'Courier New' }))
      .withComponent(new TimeCounter())
      .build();

    this.playerStats(scene, f*7, y, "p1_score", "p1_health");


    if(GS.isMultiplayer()) {
      this.playerStats(scene, f, y, "p2_score", "p2_health");
    }

  }

  static monsterBuilder(scene: ECS.Scene) {

    new ECS.Builder(scene)
    .anchor(0.5, 1)
    .asSprite(PIXI.Texture.from(Assets.MONSTER))
    .withComponent(new Monster())
    .withParent(scene.stage)
    .build();
  }

}
