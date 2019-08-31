var game;
var fieldSize = 7;
var donutsDif = 7;
var donutSize = 100;
//
var swapSpeed = 200;
var fallSpeed = 1000;
var destroySpeed = 500;
var fastFall = true;
//
var gameArray = [];
var removeMap = [];
var donuts;
var selectedDonut;
var canPick = true;
//
var handTween;
var hand;

window.onload = function() {
  game = new Phaser.Game(1200, 1100);
  game.state.add("PlayGame", playGame);
  game.state.start("PlayGame");
};

var playGame = function(game) {};
playGame.prototype = {
  preload: function() {
    game.load.spritesheet("hand", "./src/images/game/hand.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    game.load.spritesheet(
      "level1Background",
      "./src/images/backgrounds/level1Background.png",
      {
        frameWidth: 1300,
        frameHeight: 1000
      }
    );
    game.load.spritesheet(
      "gem00",
      "./src/images/game/gem00.png",
      donutSize,
      donutSize
    );
    game.load.spritesheet("gem01", "./src/images/game/gem01.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    game.load.spritesheet("gem02", "./src/images/game/gem02.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    game.load.spritesheet("gem03", "./src/images/game/gem03.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    game.load.spritesheet("gem04", "./src/images/game/gem04.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    game.load.spritesheet("gem05", "./src/images/game/gem05.png", {
      frameWidth: 100,
      frameHeight: 100
    });
    game.load.spritesheet("gem06", "./src/images/game/gem06.png", {
      frameWidth: 100,
      frameHeight: 100
    });
  },
  create: function() {
    var background = game.add.image(0, 0, "level1Background");
    this.textScores = this.add.text(50, 50, "Scores : " /* + this.score */, {
      fontFamily: "Fredoka One",
      color: "black",
      fontSize: "3rem"
    });
    this.timerLimit = this.add.text(500, 50, "Time : " /* + this.timer */, {
      fontFamily: "Fredoka One",
      color: "red",
      fontSize: "3rem"
    });
    // Lives
    lives = game.add.group();
    game.add.text(980, 50, "Lives x" /* + this.lives */, {
      fontFamily: "Fredoka One",
      color: "green",
      fontSize: "3rem"
    });
    //Create lives icons
    for (var i = 0; i < 3; i++) {
      var icon = lives.create(970 + 90 * i, 140, "gem00");
      icon.anchor.setTo(0.5, 0.5);
      icon.angle = 90;
      icon.alpha = 0.6;
    }
    drawField();
    canPick = true;
    game.input.onDown.add(donutSelect);
    game.input.onUp.add(donutDeselect);
  }
};
//Створюємо масив з пончиками і відображаємо їх
function drawField() {
  donuts = game.add.group();
  for (var i = 0; i < fieldSize; i++) {
    gameArray[i] = [];
    for (var j = 0; j < fieldSize; j++) {
      this.count = game.rnd.between(0, donutsDif - 1);
      var donut = game.add.sprite(
        donutSize * j + 290,
        donutSize * i + 300,
        "gem0" + this.count
      );
      donut.anchor.set(0.5);
      donuts.add(donut);
      //console.log(donut);
      do {
        donut.frame = this.count;
        gameArray[i][j] = {
          donutID: count,
          donutSprite: donut
        };
      } while (isHorizontalMatch(i, j) && isVerticalMatch(i, j));
      //console.log(donut);
    }
  }
  selectedDonut = null;
  hand = game.add.sprite(0, 0, "hand");
  hand.anchor.set(0.5);
  hand.visible = false;
}

function donutSelect(point) {
  console.log(point);
  if (canPick) {
    hand.visible = false;
    //handTween.stop();
    var row = Math.floor((point.clientY - 300) / donutSize);
    var col = Math.floor((point.clientX - 290) / donutSize);
    var pickedDonut = gemAt(row, col);
    console.log(pickedDonut);
    if (pickedDonut != -1) {
      if (selectedDonut == null) {
        pickedDonut.donutSprite.scale.setTo(1.2);
        pickedDonut.donutSprite.bringToTop();
        selectedDonut = pickedDonut;
        console.log(selectedDonut);
        game.input.addMoveCallback(donutMove);
      } else {
        if (pickedDonut.donutID === selectedDonut.donutID) {
          selectedDonut.donutSprite.scale.setTo(1);
          selectedDonut = null;
          donutDeselect();
          console.log("The same!");
        } else {
          if (pickedDonut.donutID !== selectedDonut.donutID) {
            selectedDonut.donutSprite.scale.setTo(1);
            pickedDonut.donutSprite.scale.setTo(1.2);
            console.log(pickedDonut);
            console.log(selectedDonut);
            swapDonuts(selectedDonut, pickedDonut, true);
          } else {
            selectedDonut.donutSprite.scale.setTo(1);
            pickedDonut.donutSprite.scale.setTo(1.2);
            selectedDonut = pickedDonut;
            game.input.addMoveCallback(donutMove);
            console.log(pickedDonut);
            console.log("We Pick!");
          }
        }
      }
    }
  }
}

function donutDeselect() {
  this.game.input.deleteMoveCallback(donutMove);
}

function donutMove(point) {
  console.log(point.id);
  if (point.id == 1) {
    var distX = point.pageX - selectedDonut.donutSprite.x;
    var distY = point.pageY - selectedDonut.donutSprite.y;
    var deltaRow = 0;
    var deltaCol = 0;
    console.log(distX);
    console.log(distY);
    if (Math.abs(distX) > 50 / 2) {
      if (distX > 0) {
        deltaCol = 1;
      } else {
        deltaCol = -1;
      }
    } else {
      if (Math.abs(distY) > 50 / 2) {
        if (distY > 0) {
          deltaRow = 1;
        } else {
          deltaRow = -1;
        }
      }
    }
    console.log(deltaRow);
    console.log(deltaCol);
    if (deltaRow + deltaCol != 0) {
      var pickedDonut = gemAt(
        getDonutRow(selectedDonut) + deltaRow,
        getDonutCol(selectedDonut) + deltaCol
      );
      console.log(pickedDonut);
      if (pickedDonut != -1) {
        selectedDonut.donutSprite.scale.setTo(1);
        //swapOrbs(selectedDonut, pickedDonut, true);
      }
    }
  }
}
//Переміщення пончиків
function swapDonuts(selectedDonut, pickedDonut, swapBack) {
  canPick = false;
  swapBack = false;
  var fromID = selectedDonut.donutID;
  var fromSprite = selectedDonut.donutSprite;
  var toID = pickedDonut.donutID;
  var toSprite = pickedDonut.donutSprite;
  var x = 10;
  var i = getDonutRow(selectedDonut);
  var j = getDonutCol(selectedDonut);
  var k = getDonutRow(pickedDonut);
  var l = getDonutCol(pickedDonut);
  gameArray[i][j].donutID = toID;
  gameArray[i][j].donutSprite = toSprite;
  gameArray[k][l].donutID = fromID;
  gameArray[k][l].donutSprite = fromSprite;
  var donut1Tween = game.add.tween(gameArray[i][j].donutSprite).to(
    {
      x: j * donutSize + donutSize - x,
      y: i * donutSize
    },
    swapSpeed,
    Phaser.Easing.Linear.None,
    true
  );
  var donut2Tween = game.add.tween(gameArray[k][l].donutSprite).to(
    {
      x: l * donutSize + donutSize - x,
      y: k * donutSize
    },
    swapSpeed,
    Phaser.Easing.Linear.None,
    true
  );
  canPick = true;
  selectedDonut = null;
  handleMatches(row, col);
}

function handleMatches(row, col) {
  removeMap = [];
  for (var i = 0; i < fieldSize; i++) {
    removeMap[i] = [];
    for (var j = 0; j < fieldSize; j++) {
      removeMap[i].push(0);
    }
  }
  isHorizontalMatch(row, col);
  isVerticalMatch(row, col);
  //handleVerticalMatches();
  //destroyDonuts();
}

function destroyDonuts(row, col) {
  console.log(gameArray[row][col]);
  console.log(gameArray[row][col - 1]);
  console.log(gameArray[row][col - 2]);
  /*  for (var i = 0; i < fieldSize; i++) {
    for (var j = 0; j < fieldSize; j++) {
      if (removeMap[i][j] === removeMap[row][col]) {
        var destroyTween = game.add.tween(gameArray[row][col].donutSprite).to(
          {
            alpha: 0
          },
          destroySpeed,
          Phaser.Easing.Linear.None,
          true
        );
      }
    }
  } */
  /* if (removeMap[row][col]) {
    var destroyTween = game.add.tween(gameArray[row][col].donutSprite).to(
      {
        alpha: 0
      },
      destroySpeed,
      Phaser.Easing.Linear.None,
      true
    );
    var destroyTween = game.add.tween(gameArray[row][col - 1].donutSprite).to(
      {
        alpha: 0
      },
      destroySpeed,
      Phaser.Easing.Linear.None,
      true
    );
    var destroyTween = game.add.tween(gameArray[row][col - 2].donutSprite).to(
      {
        alpha: 0
      },
      destroySpeed,
      Phaser.Easing.Linear.None,
      true
    );
    console.log(removeMap[i][j]);
    destroyed++;
    destroyTween.onComplete.add(function(donut) {
      donut.destroy();
      destroyed--;
      if (destroyed == 0) {
        //makeOrbsFall();
        if (fastFall) {
          //restorationField();
        }
      }
    });
    gameArray[i][j] = null;
  } */
}

//Перевіряємо коректність даних і повертаємо масив координат
function gemAt(row, col) {
  if (row < 0 || row >= fieldSize || col < 0 || col >= fieldSize) {
    return -1;
  }
  //console.log(gameArray[row][col]);
  return gameArray[row][col];
}
//Перевіряємо по горизонталі на ідентичність
function isHorizontalMatch(row, col) {
  if (
    gemAt(row, col).donutID == gemAt(row, col - 1).donutID &&
    gemAt(row, col).donutID == gemAt(row, col - 2).donutID
  ) {
    console.log("we have horizontal match of three!");
    console.log(gemAt(row, col).donutID);
    console.log(row, col);
    console.log(row, col - 1);
    console.log(row, col - 2);
    //destroyDonuts(row, col);
  } else if (
    gemAt(row, col).donutID == gemAt(row, col - 1).donutID &&
    gemAt(row, col).donutID == gemAt(row, col - 2).donutID &&
    gemAt(row, col).donutID == gemAt(row, col - 3).donutID
  ) {
    console.log("we have horizontal match of four of them!");
    console.log(gemAt(row, col).donutID);
    console.log(row, col);
    console.log(row, col - 1);
    console.log(row, col - 2);
    console.log(row, col - 3);
  }
  return (
    gemAt(row, col).donutID == gemAt(row, col - 1).donutID &&
    gemAt(row, col).donutID == gemAt(row, col - 2).donutID
  );
}
//Перевіряємо по вертикалі на ідентичність
function isVerticalMatch(row, col) {
  if (
    gemAt(row, col).donutID == gemAt(row - 1, col).donutID &&
    gemAt(row, col).donutID == gemAt(row - 2, col).donutID
  ) {
    console.log("we have vertical match of three!");
    console.log(gemAt(row, col).donutID);
    console.log(row, col);
    console.log(row - 1, col);
    console.log(row - 2, col);
    //destroyDonuts(row, col);
  } else if (
    gemAt(row, col).donutID == gemAt(row - 1, col).donutID &&
    gemAt(row, col).donutID == gemAt(row - 2, col).donutID &&
    gemAt(row, col).donutID == gemAt(row - 3, col).donutID
  ) {
    console.log("we have vertical match of four of them!");
    console.log(gemAt(row, col).donutID);
    console.log(row, col);
    console.log(row - 1, col);
    console.log(row - 2, col);
    console.log(row - 3, col);
  }
  return (
    gemAt(row, col).donutID == gemAt(row - 1, col).donutID &&
    gemAt(row, col).donutID == gemAt(row - 2, col).donutID
  );
}

function matchInStart() {
  for (var i = 0; i < fieldSize; i++) {
    for (var j = 0; j < fieldSize; j++) {
      if (isHorizontalMatch(i, j) && isVerticalMatch(i, j)) {
        return true;
      }
    }
  }
  return false;
}

function getDonutRow(donut) {
  return Math.floor(donut.donutSprite.y / donutSize);
}

function getDonutCol(donut) {
  return Math.floor(donut.donutSprite.x / donutSize);
}
