/*
  Cave pairs can be generated randomly e.g. using generateCaves function.
  For better game experience, it's better to manually set the cave pairs.
  That way, we can assure cave pairs make sense.
*/

let caves = {
  "0" : {x:76, y:100,  pair: 14 },
  "1" : {x:240, y:100, pair: 20 },
  "2" : {x:417, y:100, pair: 3 },
  "3" : {x:612, y:100, pair: 1 },
  "4" : {x:511, y:196, pair: 2 },
  "5" : {x:757, y:196, pair: 19 },
  "6" : {x:895, y:196, pair: 8 },
  "7" : {x:120, y:270, pair: 7 },
  "8" : {x:331, y:270, pair: 16 },
  "9" : {x:671, y:315, pair: 17 },
 "10" : {x:823, y:315, pair: 12 },
 "11" : {x:681, y:464, pair: 4 },
 "12" : {x:833, y:464, pair: 11 },
 "13" : {x:671, y:590, pair: 21 },
 "14" : {x:823, y:590, pair: 0 },
 "15" : {x:358, y:387, pair: 23 },
 "16" : {x:511, y:387, pair: 10 },
 "17" : {x:58,  y:438, pair: 9 },
 "18" : {x:211, y:438, pair: 22 },
 "19" : {x:312, y:534, pair: 13 },
 "20" : {x:465, y:534, pair: 15 },
 "21" : {x:128, y:656, pair: 5 },
 "22" : {x:340, y:656, pair: 6 },
 "23" : {x:493, y:656, pair: 18 },
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

let indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export default function generateCaves() {
  let pairs = [];

  shuffle(indexes);
  console.log(indexes);
  for (let i = 0; i < 12; i++) {
    let pair = [indexes[0], indexes[1]];
    pairs.push(pair);
    indexes.splice(0, 2);
    shuffle(indexes);
  }

  pairs.forEach(p => {
    caves[p[0]].pair = p[1];
    caves[p[1]].pair = p[0];
  });

  return caves;
}