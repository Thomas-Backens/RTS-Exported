var PathFinderManager = function (p) {
  var PathFinder = (function () {
    PathFinder = {
      gridSize: 60,
      start: new PVector(0, 0),
      end: new PVector(2, 2),
      walls: [],
      path: [],
      isReachable: false,
      currentBuildingCount: 0,
    };

    PathFinder.setup = function () {
      this.walls = [];
      for (var i = 0; i < Buildings.buildings.length; i++) {
        var b = Buildings.buildings[i];

        var startX = p.round(b.position.x / this.gridSize);
        var startY = p.round(b.position.y / this.gridSize);

        switch (b.stats.size) {
          case this.gridSize:
            if (!this.isWall({ x: startX, y: startY })) {
              this.walls.push({ x: startX, y: startY });
            }
            break;
          case this.gridSize * 2:
            if (!this.isWall({ x: startX, y: startY })) {
              this.walls.push({ x: startX, y: startY });
            }
            if (!this.isWall({ x: startX + 1, y: startY })) {
              this.walls.push({ x: startX + 1, y: startY });
            }
            if (!this.isWall({ x: startX, y: startY + 1 })) {
              this.walls.push({ x: startX, y: startY + 1 });
            }
            if (!this.isWall({ x: startX + 1, y: startY + 1 })) {
              this.walls.push({ x: startX + 1, y: startY + 1 });
            }
            break;
          case this.gridSize * 3:
            for (var j = -1; j < 2; j++) {
              if (!this.isWall({ x: startX, y: startY + j })) {
                this.walls.push({ x: startX, y: startY + j });
              }
              if (!this.isWall({ x: startX - 1, y: startY + j })) {
                this.walls.push({ x: startX - 1, y: startY + j });
              }
              if (!this.isWall({ x: startX + 1, y: startY + j })) {
                this.walls.push({ x: startX + 1, y: startY + j });
              }
            }
            break;
        }
      }
      for (var i = 0; i < Resources.resources.length; i++) {
        var r = Resources.resources[i];

        var startX = p.round((r.position.x - 5) / this.gridSize);
        var startY = p.round((r.position.y - 5) / this.gridSize);

        if (!this.isWall({ x: startX, y: startY })) {
          this.walls.push({ x: startX, y: startY });
        }
        if (!this.isWall({ x: startX + 1, y: startY })) {
          this.walls.push({ x: startX + 1, y: startY });
        }
        if (!this.isWall({ x: startX, y: startY + 1 })) {
          this.walls.push({ x: startX, y: startY + 1 });
        }
        if (!this.isWall({ x: startX + 1, y: startY + 1 })) {
          this.walls.push({ x: startX + 1, y: startY + 1 });
        }
      }
    };
    PathFinder.update = function () {
      for (var i = 0; i < Buildings.buildings.length; i++) {
        var b = Buildings.buildings[i];

        if (!b.dead) {
          continue;
        }

        var startX = round(b.position.x / this.gridSize);
        var startY = round(b.position.y / this.gridSize);

        var numWalls = 0;
        switch (b.stats.size) {
          case this.gridSize:
            for (var j = 0; j < this.walls.length; j++) {
              if (this.walls.x === startX && this.walls.y === startY) {
                this.walls.splice(i, 1);
                break;
              }
            }
            break;
          case this.gridSize * 2:
            for (var j = 0; j < this.walls.length; j++) {
              if (
                (this.walls.x === startX && this.walls.y === startY) ||
                (this.walls.x === startX + 1 && this.walls.y === startY) ||
                (this.walls.x === startX && this.walls.y === startY + 1) ||
                (this.walls.x === startX + 1 && this.walls.y === startY + 1)
              ) {
                this.walls.splice(i, 1);
                numWalls++;
                if (numWalls === 4) {
                  break;
                }
              }
            }
            break;
          case this.gridSize * 3:
            for (var j = 0; j < this.walls.length; j++) {
              for (var k = -1; k < 2; k++) {
                if (
                  (this.walls.x === startX - 1 &&
                    this.walls.y === startY + k) ||
                  (this.walls.x === startX && this.walls.y === startY + k) ||
                  (this.walls.x === startX + 1 && this.walls.y === startY + k)
                ) {
                  this.walls.splice(i, 1);
                  numWalls++;
                  if (numWalls === 9) {
                    break;
                  }
                }
              }
            }
            break;
        }
      }
    };
    PathFinder.display = function () {
      if (this.path.length > 0) {
        this.drawPath(this.path);
      }
    };
    PathFinder.drawPath = function () {
      for (var i = 0; i < this.path.length; i++) {
        var cell = this.path[i];
        p.noStroke();
        p.fill(0, 0, 255); // Path p.color
        p.ellipse(
          cell.x * this.gridSize,
          cell.y * this.gridSize,
          this.gridSize / 4,
          this.gridSize / 4
        );
      }
    };
    PathFinder.bfs = function (start, end) {
      var queue = [];
      var visited = [];
      this.path = [];
      var parent = {};
      var distance = {}; // To store distance to each cell
      this.isReachable = false;

      // Initialize the queue with the start position
      queue.push(start);
      visited.push({ x: start.x, y: start.y });
      parent[start.x + "," + start.y] = null;
      distance[start.x + "," + start.y] = 0;

      // Directions for movement (up, down, left, right, and diagonals)
      var directions = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 }, // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }, // Right
        { x: -1, y: -1 }, // Up-Left
        { x: 1, y: -1 }, // Up-Right
        { x: -1, y: 1 }, // Down-Left
        { x: 1, y: 1 }, // Down-Right
      ];

      if (!this.doesLineIntersectWalls(start.x, start.y, end.x, end.y)) {
        this.path.push(end);
        this.isReachable = true;
        return;
      }

      var iterationLimit = 5000;
      while (queue.length > 0) {
        iterationLimit--;
        if (iterationLimit <= 0) {
          //println("Pathfinding aborted: Too many iterations.");
          break;
        }
        var current = queue.shift();
        // println(queue.length);

        // Check if we've reached the end
        if (current.x === end.x && current.y === end.y) {
          // Backtrack to find the path
          var pathNode = current;
          while (pathNode !== null) {
            this.path.push(pathNode);
            pathNode = parent[pathNode.x + "," + pathNode.y];
          }
          this.path.reverse();
          this.isReachable = true;
          return; // Exit the BFS once we found the path
        }

        // Explore all possible directions
        for (var i = 0; i < directions.length; i++) {
          var next = {
            x: current.x + directions[i].x,
            y: current.y + directions[i].y,
          };

          // Check if the next position is not a wall
          if (!this.isWall(next) && !this.isVisited(next, visited)) {
            // Additional check for corner-cutting when moving diagonally
            if (
              this.isDiagonalMove(current, next) &&
              this.isCornerBlocked(current, next)
            ) {
              continue; // Skip this move if it's blocked by adjacent walls
            }

            queue.push(next);
            visited.push(next);
            parent[next.x + "," + next.y] = current;
            distance[next.x + "," + next.y] =
              distance[current.x + "," + current.y] + 1;
          }
        }
      }

      // If no path is found, find the nearest reachable cell to the end
      var nearestCell = this.findNearestReachableCell(end, distance);
      if (nearestCell) {
        // Trace back from the nearest cell to the start to create a path
        var pathNode = nearestCell;
        while (pathNode !== null) {
          this.path.push(pathNode);
          pathNode = parent[pathNode.x + "," + pathNode.y];
        }
        this.path.reverse();
      }

      // If no path is found and no nearest cell is reachable, clear the path
      if (this.path.length === 0) {
        //println("No reachable path found.");
        return;
      }
    };
    PathFinder.doesLineIntersectWalls = function (x1, y1, x2, y2) {
      // Bresenham's line algorithm to trace grid cells
      var dx = p.abs(x2 - x1),
        dy = p.abs(y2 - y1);
      var sx = x1 < x2 ? 1 : -1,
        sy = y1 < y2 ? 1 : -1;
      var err = dx - dy;

      while (true) {
        // Check if the current grid cell is occupied
        // x1 >= 0 && y1 >= 0 && x1 < grid.length && y1 < grid[0].length &&
        if (
          this.isWall({ x: x1, y: y1 }) ||
          this.isWall({ x: x1 + 1, y: y1 }) ||
          this.isWall({ x: x1 - 1, y: y1 }) ||
          this.isWall({ x: x1, y: y1 + 1 }) ||
          this.isWall({ x: x1, y: y1 - 1 })
        ) {
          return true;
        }

        // If the end of the line is reached, exit the loop
        if (x1 === x2 && y1 === y2) {
          break;
        }

        var e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y1 += sy;
        }
      }

      return false;
    };
    PathFinder.isWall = function (pos) {
      for (var i = 0; i < this.walls.length; i++) {
        if (this.walls[i].x === pos.x && this.walls[i].y === pos.y) {
          return true;
        }
      }
      return false;
    };
    PathFinder.isVisited = function (pos, visited) {
      for (var i = 0; i < visited.length; i++) {
        if (visited[i].x === pos.x && visited[i].y === pos.y) {
          return true;
        }
      }
      return false;
    };
    PathFinder.isDiagonalMove = function (current, next) {
      return p.abs(current.x - next.x) === 1 && p.abs(current.y - next.y) === 1;
    };
    PathFinder.isCornerBlocked = function (current, next) {
      if (this.isDiagonalMove(current, next)) {
        var x1 = current.x;
        var y1 = current.y;
        var x2 = next.x;
        var y2 = next.y;

        /*if ((this.isWall({ x: x1, y: y2 }) && this.isWall({ x: x2, y: y1 })) || (this.isWall({ x: x2, y: y1 }) && this.isWall({ x: x1, y: y2 }))) {
                return true;
            } Use this method instead if you want to allow close corner movement*/
        if (
          this.isWall({ x: x1, y: y2 }) ||
          this.isWall({ x: x2, y: y1 }) ||
          this.isWall({ x: x2, y: y1 }) ||
          this.isWall({ x: x1, y: y2 })
        ) {
          return true;
        }
      }
      return false;
    };
    PathFinder.findNearestReachableCell = function (end, distance) {
      var minDistance = Infinity;
      var nearestCell = null;

      for (
        var x = -(MAPS[0].mapSize - p.width) / 2;
        x < (p.width + (MAPS[0].mapSize - p.width) / 2) / this.gridSize;
        x++
      ) {
        for (
          var y = -(MAPS[0].mapSize - p.height) / 2;
          y < (p.height + (MAPS[0].mapSize - p.height) / 2) / this.gridSize;
          y++
        ) {
          if (
            !this.isWall({ x: x, y: y }) &&
            distance[x + "," + y] !== undefined
          ) {
            var distToEnd = Math.p.abs(end.x - x) + Math.p.abs(end.y - y);
            if (distToEnd < minDistance) {
              minDistance = distToEnd;
              nearestCell = { x: x, y: y };
            }
          }
        }
      }
      return nearestCell;
    };
    PathFinder.moveUnits = function (isAttacking) {
      if (this.currentBuildingCount !== Buildings.buildings.length) {
        this.setup();
        this.currentBuildingCount = Buildings.buildings.length;
      }
      for (var i = 0; i < SelectionHandler.selectedUnits.length; i++) {
        var s = SelectionHandler.selectedUnits[i];

        if (!s.canMove || s.stats.team !== 1) {
          continue;
        }

        var startPos = new PVector(
          p.floor(
            (s.position.x - PathFinder.gridSize / 2) / PathFinder.gridSize
          ) + 1,
          p.floor(
            (s.position.y - PathFinder.gridSize / 2) / PathFinder.gridSize
          ) + 1
        );
        var endPos;
        var usedMap = false;
        if (mouse.x < 205 && mouse.y >= p.height - 205) {
          endPos = new PVector(
            p.floor(
              p.map(
                mouse.x,
                5,
                205,
                -(MAPS[0].mapSize - p.width) / 2,
                p.width + (MAPS[0].mapSize - p.width) / 2
              ) / PathFinder.gridSize
            ) + 1,
            p.floor(
              p.map(
                mouse.y,
                p.height - 205,
                p.height - 5,
                -(MAPS[0].mapSize - p.height) / 2,
                p.height + (MAPS[0].mapSize - p.height) / 2
              ) / PathFinder.gridSize
            ) + 1
          );
          usedMap = true;
        } else {
          endPos = new PVector(
            p.floor(
              (mouse.x - cam.position.x - PathFinder.gridSize / 2) /
                PathFinder.gridSize
            ) + 1,
            p.floor(
              (mouse.y - cam.position.y - PathFinder.gridSize / 2) /
                PathFinder.gridSize
            ) + 1
          );
        }

        if (!PathFinder.isWall({ x: startPos.x, y: startPos.y })) {
          PathFinder.start = { x: startPos.x, y: startPos.y };
        }
        //if (!PathFinder.isWall({ x: endPos.x, y: endPos.y })) {
        PathFinder.end = { x: endPos.x, y: endPos.y };
        //}

        PathFinder.bfs(PathFinder.start, PathFinder.end);
        Units.moveToCommand(
          s,
          PathFinder.path,
          usedMap,
          isAttacking || false,
          isAttacking || false
        );
      }
    };

    return PathFinder;
  })();

  return PathFinder;
};
