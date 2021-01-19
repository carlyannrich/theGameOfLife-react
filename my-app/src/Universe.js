export default class Universe {
  constructor(generation = 0, liveCells = new Map()) {
    this.generation = generation;
    this.liveCells = liveCells;
    this.nextGeneration = new Map();
    this.deadCells = new Map();
  }

  getGeneration() {
    return this.generation;
  }

  getLiveCells() {
    return this.liveCells;
  }

  addCell(position) {
    this.liveCells.set(position.x + " , " + position.y, {
      x: position.x,
      y: position.y,
    });
  }

  removeCell(position) {
    this.liveCells.delete(position);
  }

  isCellAlive(position) {
    return this.liveCells.has(position);
  }

  storeCell(position) {
    if (this.isCellAlive(position.x + " , " + position.y)) {
      this.removeCell(position.x + " , " + position.y);
    } else {
      this.addCell(position);
    }

    return new Universe(this.generation, this.liveCells);
  }

  addGeneration() {
    this.liveCells.forEach((item) => {
      this.calculateLiveCellsNeighbors(item);
    });

    this.deadCells.forEach((item) => {
      this.calculateDeadCellsNeighbors(item);
    });

    this.generation++;

    return new Universe(this.generation, this.nextGeneration);
  }

  calculateLiveCellsNeighbors(position) {
    var liveNeighbors = 0; //This is because initially we don't know how many live neighbors are there

    //Here we are going to check the state of all the cells neighbours. This will allow us to apply the rules
    for (var i = position.x - 1; i <= position.x + 1; i++) {
      for (var j = position.y - 1; j <= position.y + 1; j++) {
        //This is to make sure that we don't check if the cell we are currently analysing is counted has a live cell
        if (i === position.x && j === position.y) continue;

        //if the neighbour is alive we add to the liveNeighbors counter else it goes to the deadCell Map we defined in the constructor
        if (this.isCellAlive(i + " , " + j)) {
          liveNeighbors++;
        } else {
          this.deadCells.set(i + " , " + j, { x: i, y: j });
        }
      }
    }

    //Here we are applying the rules of the game. 2 or 3 live neighbours means that the cell remains alive and lives on to the next generation.
    if (liveNeighbors === 2 || liveNeighbors === 3)
      this.nextGeneration.set(position.x + " , " + position.y, {
        x: position.x,
        y: position.y,
      });
  }

  calculateDeadCellsNeighbors(position) {
    var liveNeighbors = 0;

    for (var i = position.x - 1; i <= position.x + 1; i++) {
      for (var j = position.y - 1; j <= position.y + 1; j++) {
        if (i === position.x && j === position.y) continue;

        if (this.isCellAlive(i + " , " + j)) {
          liveNeighbors++;
        }
      }
    }

    //Applying the game rule that says when a dead cell has 3 neighboors it's reborn.
    if (liveNeighbors === 3)
      this.nextGeneration.set(position.x + " , " + position.y, {
        x: position.x,
        y: position.y,
      });
  }
}
