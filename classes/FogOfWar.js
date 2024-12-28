var FogOfWarManager = function (p) {
  var FogOfWar = (function () {
    FogOfWar = {
      memory: [],
      unitMemory: [],
      unitsList: [],
      unitCount: 0,
      buildingsList: [],
      buildingCount: 0,
      grid: [],
      gridSize: 30,
      refreshTimer: 0,
      refreshRate: 30,

      fog: [],
      visited: [],
      cols: 0,
      rows: 0,
      bufferCols: 0,
      bufferRows: 0,
    };

    FogOfWar.setupFog = function () {
      this.cols = p.floor(MAPS[0].mapSize / this.gridSize) + 1;
      this.rows = p.floor(MAPS[0].mapSize / this.gridSize) + 1;
      this.bufferCols = p.floor(
        (MAPS[0].mapSize - p.width) / 2 / this.gridSize
      );
      this.bufferRows = p.floor(
        (MAPS[0].mapSize - p.height) / 2 / this.gridSize
      );
      for (var i = -this.bufferCols; i < this.cols - this.bufferCols; i++) {
        this.fog[i] = [];
        this.visited[i] = [];
        for (var j = -this.bufferRows; j < this.rows - this.bufferRows; j++) {
          this.fog[i][j] = false;
          this.visited[i][j] = false;
        }
      }
    };
    FogOfWar.display = function () {
      p.noStroke();
      for (var i = -this.bufferCols; i < this.cols - this.bufferCols; i++) {
        for (var j = -this.bufferRows; j < this.rows - this.bufferRows; j++) {
          if (
            i * this.gridSize + cam.position.x >= -this.gridSize &&
            i * this.gridSize + cam.position.x <= p.width + this.gridSize &&
            j * this.gridSize + cam.position.y > -this.gridSize &&
            j * this.gridSize + cam.position.y <= p.height + this.gridSize
          ) {
            if (!this.fog[i][j]) {
              if (!this.visited[i][j]) {
                p.fill(0);
              } else {
                p.fill(0, 150);
              }
              p.rect(
                i * this.gridSize,
                j * this.gridSize,
                this.gridSize,
                this.gridSize
              );
            }
          }
        }
      }
    };
    FogOfWar.update = function () {
      for (var i = -this.bufferCols; i < this.cols - this.bufferCols; i++) {
        for (var j = -this.bufferRows; j < this.rows - this.bufferRows; j++) {
          this.fog[i][j] = false;
        }
      }

      for (var i = 0; i < Units.units.length; i++) {
        var u = Units.units[i];

        if (u.stats.team !== 1 || u.dead) {
          continue;
        }

        var xCenter = p.floor(u.position.x / this.gridSize);
        var yCenter = p.floor(u.position.y / this.gridSize);
        var vision = p.floor(u.stats.visionRange / this.gridSize);

        for (var dx = -vision; dx <= vision; dx++) {
          for (var dy = -vision; dy <= vision; dy++) {
            var x = xCenter + dx;
            var y = yCenter + dy;
            if (
              x >= -this.bufferCols &&
              x < this.cols - this.bufferCols &&
              y >= -this.bufferRows &&
              y < this.rows - this.bufferRows
            ) {
              if (
                p.dist(xCenter, yCenter, x, y) * this.gridSize <=
                u.stats.visionRange
              ) {
                this.fog[x][y] = true;
                this.visited[x][y] = true;
              }
            }
          }
        }
      }
      for (var i = 0; i < Buildings.buildings.length; i++) {
        var b = Buildings.buildings[i];
        var visionRange = b.stats.visionRange;
        var isEnemy = false;

        if (b.stats.team !== 1) {
          if (!b.visible) {
            continue;
          }
          isEnemy = true;
          visionRange = b.stats.size / 1.25;
        }

        var xCenter = p.floor((b.position.x + this.gridSize) / this.gridSize);
        var yCenter = p.floor((b.position.y + this.gridSize) / this.gridSize);
        var vision = p.floor(visionRange / this.gridSize);

        for (var dx = -vision; dx <= vision; dx++) {
          for (var dy = -vision; dy <= vision; dy++) {
            var x = xCenter + dx;
            var y = yCenter + dy;
            if (
              x >= -this.bufferCols &&
              x < this.cols - this.bufferCols &&
              y >= -this.bufferRows &&
              y < this.rows - this.bufferRows
            ) {
              if (
                p.dist(xCenter, yCenter, x, y) * this.gridSize <=
                visionRange
              ) {
                if (!this.fog[x][y]) {
                  this.fog[x][y] = !isEnemy;
                }
                this.visited[x][y] = true;
              }
            }
          }
        }
      }
    };

    return FogOfWar;
  })();

  return FogOfWar;
};
