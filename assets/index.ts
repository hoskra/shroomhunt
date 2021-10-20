import basket1Img from './basket1';
import basket2Img from './basket2';
import player1Img from './player1';
import player2Img from './player2';
import cave1Img from './cave1';
import monsterImg from './monster';
import shroomImg from './shroom';
import special_shroomImg from './special_shroom';

export const ASSETS = {
  basket1: basket1Img,
  basket2: basket2Img,
  player1: player1Img,
  player2: player2Img,
  cave1: cave1Img,
  monster: monsterImg,
  shroom: shroomImg,
  special_shroom: special_shroomImg
};

export const RESOURCES = (() => {
	let resources = [];
	for (let name in ASSETS) resources.push({ name, url: ASSETS[name] });
	return resources;
})();
