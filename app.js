document.addEventListener("DOMContentLoaded", () => {
  class Board { 
    create() {
      for (let i = 0; i < 15; i++) {
        const node = document.createElement("div");
        for (let i = 0; i < 30; i++) {
          const innerNode = document.createElement("div");
          node.appendChild(innerNode);
        }
        document.getElementById("board").appendChild(node);
      }
      this.createScoreBoard();
    }

    createScoreBoard() {
      const scoreBoard = document.getElementById("scoreBoard");
      const textNode = document.createTextNode("Points: " + points);
      scoreBoard.append(textNode);
    }
  }

  class Frog {
    constructor() {
      this.row = 15;
      this.column = 15;
    }

    create() {
      const board = document.getElementById("board");
      const frog = board.childNodes[this.row].childNodes[this.column];
      
      frog.style.backgroundColor = "green";
    }

    update(direction) {
      const board = document.getElementById("board");
      if (direction === "left") {
        if (this.column === 0) {
          return;
        } else {
          this.column -= 1;
          const oldFrog = board.childNodes[this.row].childNodes[this.column + 1];
          oldFrog.style.backgroundColor = "white";
        }
      } else if (direction === "up") {
        if (this.row === 1) {
          return;
        } else {
          this.row -= 1;
          const oldFrog = board.childNodes[this.row + 1].childNodes[this.column];
          oldFrog.style.backgroundColor = "white";
        }
      } else if (direction === "right") {
        if (this.column === 29) {
          return;
        } else {
          this.column += 1;
          const oldFrog = board.childNodes[this.row].childNodes[this.column - 1];
          oldFrog.style.backgroundColor = "white";
        }
      } else {
        if (this.row === 15) {
          return;
        } else {
          this.row += 1;
          const oldFrog = board.childNodes[this.row - 1].childNodes[this.column];
          oldFrog.style.backgroundColor = "white";
        }
      }

      this.detectCollision();
      this.detectGem();

      const newFrog = board.childNodes[this.row].childNodes[this.column];
      newFrog.style.backgroundColor = "green";
    }

    move(e) {
      switch(e.keyCode) {
        case 37:
          this.update("left");
          break;

        case 38:
          this.update("up");
          break;

        case 39:
          this.update("right");
          break;

        case 40:
          this.update("down");
          break;
      }
    }

    detectCollision() {
      for (let i = 0; i < traffic.cars.length; i++) {
        if (this.row === traffic.cars[i].row && this.column === traffic.cars[i].column) {
          alert("Game over. Points: " + points);
          window.location.reload();
        }
      }
    }

    detectGem() {
      if (this.row === gem.row && this.column === gem.column) {
        gem.acquired = true;
      }
    }

    reset() {
      this.row = 15;
      this.column = 15;

      const board = document.getElementById("board");
      const frog = board.childNodes[this.row].childNodes[this.column];
      
      frog.style.backgroundColor = "green";
    }
  }

  class Gem {
    constructor() {
      this.row = null;
      this.column = null;
      this.acquired = false;
    }

    create() {
      const board = document.getElementById("board");
      this.row = Math.floor(Math.random() * 15) + 1;
      this.column = Math.floor(Math.random() * 29) + 1;
      const gemDiv = board.childNodes[this.row].childNodes[this.column];
      

      gemDiv.style.backgroundColor = "blue";
    }

    update() {
      if (gameStarted = true) {
        const scoreBoard = document.getElementById("scoreBoard");
        scoreBoard.innerText = ("Points: " + points);

      }

      if (gem.acquired === true) {
        gem.acquired = false;
        points += 10;
        const scoreBoard = document.getElementById("scoreBoard");
        scoreBoard.innerText = ("Points: " + points);
        this.create();
      }
    }
  }

  class Car {
    constructor(row, column) {
      this.row = row;
      this.column = column;
    }

    create() {
      const board = document.getElementById("board");
      const car = board.childNodes[this.row].childNodes[this.column];
      if (this.row > 0) {
        car.style.backgroundColor = "orange";
      }
    }

    update() {
      this.detectCollision();

      const board = document.getElementById("board");
      const oldCar = board.childNodes[this.row].childNodes[this.column + 1];
      const newCar = board.childNodes[this.row].childNodes[this.column];

      if (oldCar !== undefined) {
        if (this.row === gem.row && this.column + 1 === gem.column) {
          oldCar.style.backgroundColor = "blue";
        } else {
          oldCar.style.backgroundColor = "white";
        }
      }  
      
      if (newCar !== undefined) {
        newCar.style.backgroundColor = "orange";
      }
    }

    detectCollision() {
      if (this.column === frog.column && this.row === frog.row) {
        alert("Game over. Points: " + points);
        window.location.reload();
      }
    }
  }

  class Traffic {
    constructor() {
      this.cars = [];
    }

    create() {
      const cars = [];
      for (let i = 0; i < 15; i++) {
        const carNumber = Math.floor(Math.random() * 40);
        if (carNumber > 35) {
          cars.push(true)
        } else {
          cars.push(false)
        }
      }

      for (let i = 0; i < 15; i++) {
        if (cars[i]) {
          const car = new Car(i, 29);
          car.create();
          this.cars.push(car);
        }
      }
    }

    update() {
      for (let i = 0; i < this.cars.length; i++) {
        this.cars[i].column -= 1;
        this.cars[i].update();
      }
    }

    clearBoard() {
      const board = document.getElementById("board");
      for (let i = 0; i < board.childNodes.length; i++) {
        const row = board.childNodes[i];
        for (let j = 0; j < row.childNodes.length; j++) {
          const node = row.childNodes[j];
          node.style.backgroundColor = "white";
        }
      }
      this.cars = [];
      gem.create();
    }
  }

  const board = new Board();
  const frog = new Frog();
  let gem = new Gem();
  let points = 0;
  const traffic = new Traffic();
  const updateGame = function() {
    traffic.update();
    traffic.create();
    gem.update();
  }
  const handleEasyButtonClick = function() {
    points = 0;
    gem.update();
    gameStarted = false;
    clearInterval(intervalId);
    traffic.clearBoard();
    frog.reset();
    traffic.create();
    intervalId = setInterval(updateGame, 650);
  }
  const handleHardButtonClick = function() {
    points = 0;
    gem.update();
    gameStarted = false;
    clearInterval(intervalId);
    traffic.clearBoard();
    frog.reset();
    traffic.create();
    intervalId = setInterval(updateGame, 200);
  }

  board.create();
  frog.create();
  
  let intervalId;
  let gameStarted = false;
  const easyButton = document.getElementById("easyButton");
  const hardButton = document.getElementById("hardButton");
  easyButton.addEventListener("click", handleEasyButtonClick);
  hardButton.addEventListener("click", handleHardButtonClick);
  document.addEventListener("keydown", frog.move.bind(frog));
})