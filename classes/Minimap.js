var MinimapManager = function (p) {
  var Minimap = (function () {
    Minimap = {
      data: [],
      fowData: [],
      fowVData: [],
      refreshRate: 60,
      refreshTimer: 0,
      mapPos: new PVector(105, p.height - 105),
      mapSize: 200,
      isMovingMinimap: false,
    };

    Minimap.display = function () {
      this.update();

      p.noStroke();
      p.fill(100);
      p.rect(this.mapPos.x, this.mapPos.y, this.mapSize, this.mapSize, 4);

      p.noStroke();
      var cellSize = 200 / (MAPS[0].mapSize / FogOfWar.gridSize);
      for (var i = 0; i < this.fowVData.length; i++) {
        p.fill(50);
        p.rect(this.fowVData[i].x, this.fowVData[i].y, cellSize, cellSize);
      }

      for (var i = 0; i < this.data.length; i++) {
        var d = this.data[i];

        p.noStroke();
        p.strokeWeight(1);
        p.stroke(0);
        if (d.team === 1) {
          p.fill(0, 200, 0);
        } else {
          p.fill(200, 0, 0);
        }
        if (d.isResource) {
          p.fill(0, 200, 200);
        }
        p.rect(
          p.map(
            d.position.x,
            -(MAPS[0].mapSize - p.width) / 2,
            p.width + (MAPS[0].mapSize - p.width) / 2,
            5,
            205
          ),
          p.map(
            d.position.y,
            -(MAPS[0].mapSize - p.height) / 2,
            p.height + (MAPS[0].mapSize - p.height) / 2,
            p.height - 205,
            p.height - 5
          ),
          p.map(d.size, 0, MAPS[0].mapSize, 0, 200),
          p.map(d.size, 0, MAPS[0].mapSize, 0, 200)
        );
      }

      p.noStroke();
      for (var i = 0; i < this.fowData.length; i++) {
        p.fill(0);
        p.rect(this.fowData[i].x, this.fowData[i].y, cellSize, cellSize);
      }

      p.noFill();
      p.strokeWeight(1);
      p.stroke(255);
      p.rect(
        p.map(
          cam.position.x,
          (MAPS[0].mapSize - p.width) / 2,
          -(MAPS[0].mapSize - p.width) / 2,
          5 + 200 / (MAPS[0].mapSize / p.width) / 2,
          205 - 200 / (MAPS[0].mapSize / p.width) / 2
        ),
        p.map(
          cam.position.y,
          (MAPS[0].mapSize - p.height) / 2,
          -(MAPS[0].mapSize - p.height) / 2,
          p.height - 205 + 200 / (MAPS[0].mapSize / p.height) / 2,
          p.height - 5 - 200 / (MAPS[0].mapSize / p.height) / 2
        ),
        200 / (MAPS[0].mapSize / p.width),
        200 / (MAPS[0].mapSize / p.height)
      );

      p.strokeWeight(3);
      p.stroke(100);
      p.rect(105, p.height - 105, 202, 202, 4);

      if (this.refreshTimer <= 0) {
        this.refresh();
        this.refreshTimer = this.refreshRate;
      } else {
        this.refreshTimer--;
      }
    };
    Minimap.refresh = function () {
      this.data = [];
      this.fowData = [];
      this.fowVData = [];
      for (var i = 0; i < Buildings.buildings.length; i++) {
        var b = Buildings.buildings[i];

        if (!FogOfWar.memory.includes(b.id)) {
          continue;
        }

        this.data.push({
          position: new PVector(b.position.x, b.position.y),
          size: b.stats.size,
          team: b.stats.team,
        });
      }

      for (var i = 0; i < Units.units.length; i++) {
        var u = Units.units[i];

        if (!FogOfWar.unitMemory.includes(u.id)) {
          continue;
        }

        this.data.push({
          position: new PVector(u.position.x, u.position.y),
          size: u.stats.size,
          team: u.stats.team,
        });
      }

      for (var i = 0; i < Resources.resources.length; i++) {
        var r = Resources.resources[i];

        this.data.push({
          position: new PVector(r.position.x, r.position.y),
          size: r.size,
          isResource: true,
          team: 0,
        });
      }

      for (
        var i = -FogOfWar.bufferCols;
        i < FogOfWar.cols - FogOfWar.bufferCols;
        i++
      ) {
        var mappedX = p.map(
          i * FogOfWar.gridSize,
          -(MAPS[0].mapSize - p.width) / 2,
          p.width + (MAPS[0].mapSize - p.width) / 2,
          this.mapPos.x - this.mapSize / 2,
          this.mapPos.x + this.mapSize / 2
        );
        for (
          var j = -FogOfWar.bufferRows;
          j < FogOfWar.rows - FogOfWar.bufferRows;
          j++
        ) {
          var mappedY = p.map(
            j * FogOfWar.gridSize,
            -(MAPS[0].mapSize - p.height) / 2,
            p.height + (MAPS[0].mapSize - p.height) / 2,
            this.mapPos.y - this.mapSize / 2,
            this.mapPos.y + this.mapSize / 2
          );
          if (!FogOfWar.fog[i][j] && !FogOfWar.visited[i][j]) {
            this.fowData.push({
              x: mappedX,
              y: mappedY,
            });
          }
          if (!FogOfWar.fog[i][j] && FogOfWar.visited[i][j]) {
            this.fowVData.push({
              x: mappedX,
              y: mappedY,
            });
          }
        }
      }

      FogOfWar.unitMemory = [];
    };
    Minimap.update = function () {
      if (
        mouse.x >= 5 &&
        mouse.x <= 205 &&
        mouse.y >= p.height - 205 &&
        mouse.y <= p.height - 5 &&
        leftStarted &&
        !dragging
      ) {
        this.isMovingMinimap = true;
      }
      if (this.isMovingMinimap) {
        cam.position.x = p.map(
          mouse.x,
          5 + 200 / (MAPS[0].mapSize / p.width) / 2,
          205 - 200 / (MAPS[0].mapSize / p.width) / 2,
          (MAPS[0].mapSize - p.width) / 2,
          -(MAPS[0].mapSize - p.width) / 2
        );
        cam.position.y = p.map(
          mouse.y,
          p.height - 205 + 200 / (MAPS[0].mapSize / p.height) / 2,
          p.height - 5 - 200 / (MAPS[0].mapSize / p.height) / 2,
          (MAPS[0].mapSize - p.height) / 2,
          -(MAPS[0].mapSize - p.height) / 2
        );

        cam.position.x = p.constrain(
          cam.position.x,
          -(MAPS[0].mapSize - p.width) / 2,
          (MAPS[0].mapSize - p.width) / 2
        );
        cam.position.y = p.constrain(
          cam.position.y,
          -(MAPS[0].mapSize - p.height) / 2,
          (MAPS[0].mapSize - p.height) / 2
        );
      }
    };

    return Minimap;
  })();

  return Minimap;
};
