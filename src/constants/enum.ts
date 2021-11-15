export enum Assets {
	SPRITESHEET = 'spritesheet',
	BASKET1 = 'basket1',
	BASKET2 = 'basket2',
	PLAYER1 = 'player1',
	PLAYER2 = 'player2',
	CAVE1 = 'cave1',
	MONSTER = 'monster',
	SHROOM = 'shroom',
	SPECIAL_SHROOM = 'special_shroom',
	MUSHROOM = 'mushroom',
	HEART = 'heart'
}

export enum GameStates {
  WELCOME_SCREEN = 0,
  RUNNING   = 1,
  PAUSE   = 2,
  FINISH  = 3,
  RESTART = 4,
}

export enum Messages {
  WELCOME_SCREEN = "WELCOME_SCREEN",
  GAME_RUNNING = "GAME_RUNNING",
  GAME_PAUSE = "GAME_PAUSE",
  GAME_FINISH = "GAME_FINISH",
  GAME_RESTART = "GAME_RESTART",
  PLAYER_1_DEAD = "PLAYER_1_DEAD",
  PLAYER_2_DEAD = "PLAYER_2_DEAD",
  MONSTER_POSITION = "MONSTER_POSITION",
}

export enum Tags {
	SHROOM = 'shroom',
	SPECIAL_SHROOM = 'special_shroom',
}

export enum Colors {
  BACKGROUND        = 0xdbbda1,
  SCORE_BACKGROUND  = 0x3f292b,
  PLATFORM          = 0xa37b72,
}