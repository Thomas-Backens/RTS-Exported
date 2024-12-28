var BuildingsManager = function (p) {
  var Buildings = (function () {
    Buildings = {
      buildings: [],
      buildingId: 0,
    };

    Buildings.createNew = function (c) {
      var menu,
        canTrain = false;
      switch (c.size) {
        case 1:
          menu = [{}, {}, {}, {}, {}, {}];
          break;
        case 2:
          menu = [
            {
              title: "Build Troop",
              description: "Start producing a troop\nto fight for you",
              price: 25,
              icon: "Troop",
              shortcut: keybinds.Training.Troop,
              action: function (b) {
                if (b.queue.length < 5) {
                  b.queue.push("Troop");
                }
              },
            },
            {},
            {},
            {},
            {},
            {
              title: "Rally",
              description:
                "Set the rally point\nof the units spawned\nfrom this building",
              price: 0,
              icon: "Rally",
              shortcut: keybinds.Rally,
              action: function () {
                CursorHandler.setCursor("rally");
              },
            },
          ];
          canTrain = true;
          break;
        case 3:
          menu = [
            {
              title: "Build Worker",
              description:
                "Start producing a worker\nto mine gold, or to\nconstruct new structures",
              price: 25,
              icon: null,
              shortcut: keybinds.Training.Worker,
              action: function (b) {
                if (b.queue.length < 5) {
                  b.queue.push("Worker");
                }
              },
            },
            {},
            {},
            {},
            {},
            {
              title: "Rally",
              description:
                "Set the rally point\nof the units spawned\nfrom this building",
              price: 0,
              icon: "Rally",
              shortcut: keybinds.Rally,
              action: function () {
                CursorHandler.setCursor("rally");
              },
            },
          ];
          canTrain = true;
          break;
      }
      this.buildings.push({
        id: this.buildingId,
        position: new PVector(c.x, c.y),
        buildingSize: c.size,
        canMove: false,
        canTrain: canTrain,
        rallyPointDist: 0,
        rallyPoint: null,
        priority: c.size,
        threatPriority: 0,
        visible: false,
        isVisible: false,

        stats: {
          health: 100,
          maxHealth: 100,
          damage: 0,
          armor: 2,
          size: c.size * PathFinder.gridSize,
          visionRange: 350 + 50 * c.size,
          team: c.team || 1,
        },
        menu: menu,

        queue: [],
        queueTimer: Infinity,
        queueTime: Infinity,
        unitToSpawn: null,

        dead: false,
      });
      this.buildingId++;
    };
    Buildings.display = function () {
      for (var i = 0; i < this.buildings.length; i++) {
        if (this.buildings[i].dead) {
          this.buildings.splice(i, 1);
          continue;
        }

        var b = this.buildings[i];

        this.update(b);

        if (b.stats.team !== 1) {
          b.isVisible = false;
        }

        if (!FogOfWar.memory.includes(b.id) && b.stats.team !== 1) {
          continue;
        }

        b.isVisible = true;

        p.strokeWeight(3);
        p.stroke(50);
        p.fill(b.stats.team === 1 ? p.color(0, 200, 0) : p.color(175, 0, 0));
        p.rect(
          b.position.x,
          b.position.y,
          b.stats.size - 5,
          b.stats.size - 5,
          4
        );
        p.noStroke();
        p.fill(150);
        p.rect(
          b.position.x,
          b.position.y,
          b.stats.size - 15,
          b.stats.size - 15,
          4
        );

        if (SelectionHandler.selectedUnits.length > 0) {
          if (SelectionHandler.selectedUnits[0] === b && b.rallyPoint) {
            p.pushMatrix();
            p.translate(b.position.x, b.position.y);
            p.stroke(50);
            var a = p.atan2(
              b.rallyPoint.y - b.position.y,
              b.rallyPoint.x - b.position.x
            );
            for (var j = 0; j < b.rallyPointDist; j += 30) {
              var x = (b.rallyPointDist - j) * p.cos(a);
              var y = (b.rallyPointDist - j) * p.sin(a);
              var x2 = (b.rallyPointDist - j - 15) * p.cos(a);
              var y2 = (b.rallyPointDist - j - 15) * p.sin(a);
              p.line(x, y, x2, y2);
            }
            p.pushMatrix();
            p.translate(
              b.rallyPoint.x - b.position.x,
              b.rallyPoint.y - b.position.y
            );
            p.rotate(a - 90);
            p.line(0, 0, -5, -5);
            p.line(0, 0, 5, -5);
            p.popMatrix();
            p.popMatrix();
          }
        }
      }
    };
    Buildings.displayHealth = function () {
      for (var i = 0; i < this.buildings.length; i++) {
        var b = this.buildings[i];

        b.visible = false;
        for (var j = 0; j < Units.units.length; j++) {
          var u = Units.units[j];

          if (u.stats.team !== 1) {
            continue;
          }

          if (
            p.dist(b.position.x, b.position.y, u.position.x, u.position.y) <
            u.stats.visionRange + b.stats.size / 2
          ) {
            b.visible = true;
          }
        }
        for (var j = 0; j < Buildings.buildings.length; j++) {
          var B = Buildings.buildings[j];

          if (b === B || B.stats.team !== 1) {
            continue;
          }

          if (
            p.dist(b.position.x, b.position.y, B.position.x, B.position.y) <
            B.stats.visionRange + b.stats.size / 2
          ) {
            b.visible = true;
          }
        }
        if (b.stats.team === 1) {
          b.visible = true;
        }

        if (!b.visible) {
          continue;
        }

        var squares = 0;
        switch (b.buildingSize) {
          case 1:
            squares = 8;
            break;
          case 2:
            squares = 14;
            break;
          case 3:
            squares = 20;
            break;
        }

        p.strokeWeight(2);
        p.stroke(25);
        p.fill(50);
        p.rect(
          b.position.x,
          b.position.y - b.stats.size / 2 - 10,
          8 * squares,
          8
        );

        var low = p.color(255, 0, 0);
        var mid = p.color(255, 255, 0);
        var high = p.color(0, 255, 0);
        var healthRatio = p.constrain(b.stats.health / b.stats.maxHealth, 0, 1);
        var lowThreshold = 0.1;
        var midThreshold = 0.5;
        var barColor;
        if (healthRatio < midThreshold) {
          if (healthRatio < lowThreshold) {
            barColor = low;
          } else {
            var t =
              (healthRatio - lowThreshold) / (midThreshold - lowThreshold);
            barColor = p.lerpColor(low, mid, t);
          }
        } else {
          var t = (healthRatio - midThreshold) / (1 - midThreshold);
          barColor = p.lerpColor(mid, high, t);
        }
        for (var j = 0; j < squares; j++) {
          p.fill(
            barColor,
            p.map(
              healthRatio,
              (1 / squares) * j,
              1 / squares + (1 / squares) * j,
              0,
              255
            )
          );
          p.rect(
            b.position.x - 8 * (squares / 2) + 8 * j + 4,
            b.position.y - b.stats.size / 2 - 10,
            8,
            8
          );
        }
        p.noStroke();
        p.fill(0, 100);
        p.rect(
          b.position.x,
          b.position.y - b.stats.size / 2 - 7,
          8 * squares,
          4
        );
      }
    };
    Buildings.update = function (b) {
      for (var i = 0; i < Units.units.length; i++) {
        var u = Units.units[i];

        var distance = p.PVector.dist(u.position, b.position);
        var minDist = u.stats.size / 2 + b.stats.size / 2;

        if (distance < minDist) {
          var repelForce = PVector.sub(u.position, b.position);
          repelForce.normalize();
          var overlap = minDist - distance;
          repelForce.mult(overlap * 0.5);
          u.position.add(repelForce);
        }

        if (!FogOfWar.memory.includes(b.id)) {
          if (u.stats.team === 1) {
            if (
              p.dist(u.position.x, u.position.y, b.position.x, b.position.y) <=
              u.stats.visionRange + b.stats.size / 2
            ) {
              FogOfWar.memory.push(b.id);
            }
          }
        }
      }

      if (!FogOfWar.memory.includes(b.id)) {
        for (var i = 0; i < Buildings.buildings.length; i++) {
          var B = Buildings.buildings[i];

          if (B.stats.team !== 1) {
            continue;
          }

          if (
            p.dist(B.position.x, B.position.y, b.position.x, b.position.y) <=
            B.stats.visionRange + b.stats.size / 2
          ) {
            FogOfWar.memory.push(b.id);
          }
        }
      }

      if (b.queue.length > 0) {
        if (b.queueTimer === Infinity) {
          this.getUnitTrainInfo(b, b.queue[0]);
        }
        if (b.queueTimer <= 0) {
          Units.createNew({
            x: b.position.x,
            y:
              b.position.y +
              (b.buildingSize * PathFinder.gridSize) / 2 +
              (PathFinder.gridSize * (2 / 3)) / 2,
            unitType: b.unitToSpawn,
            rallyPoint: b.rallyPoint || false,
          });
          b.queue.splice(0, 1);
          b.queueTimer = Infinity;
          if (b.queue > 0) {
            this.getUnitTrainInfo(b, b.queue[0]);
          }
        }
        b.queueTimer--;
      } else {
        b.queueTimer = Infinity;
        b.unitToSpawn = null;
      }
    };
    Buildings.getUnitTrainInfo = function (b, unitType) {
      switch (unitType) {
        case "Worker":
          b.queueTimer = 3 * 60;
          b.queueTime = 3 * 60;
          b.unitToSpawn = unitType;
          break;
        case "Troop":
          b.queueTimer = 5 * 60;
          b.queueTime = 5 * 60;
          b.unitToSpawn = unitType;
          break;
      }
    };
    Buildings.setRallyPoint = function () {
      if (SelectionHandler.selectedUnits.length !== 1) {
        return;
      }

      var s = SelectionHandler.selectedUnits[0];
      for (var i = 0; i < s.menu.length; i++) {
        if (s.menu[i].title === "Rally") {
          if (mouse.x <= 205 && mouse.y >= p.height - 205) {
            s.rallyPoint = new PVector(
              p.map(
                mouse.x,
                5,
                205,
                -(MAPS[0].mapSize - p.width) / 2,
                p.width + (MAPS[0].mapSize - p.width) / 2
              ),
              p.map(
                mouse.y,
                p.height - 205,
                p.height - 5,
                -(MAPS[0].mapSize - p.height) / 2,
                p.height + (MAPS[0].mapSize - p.height) / 2
              )
            );
          } else {
            s.rallyPoint = new PVector(
              mouse.x - cam.position.x,
              mouse.y - cam.position.y
            );
          }
          s.rallyPointDist = p.dist(
            s.position.x,
            s.position.y,
            s.rallyPoint.x,
            s.rallyPoint.y
          );
          break;
        }
      }
    };
    Buildings.takeDamage = function (b, dmg) {
      var totalDamage = dmg - b.stats.armor;
      if (totalDamage <= 0) {
        totalDamage = 0.5;
      }
      b.stats.health -= totalDamage;

      if (b.stats.health <= 0) {
        b.dead = true;
      }
    };

    return Buildings;
  })();

  return Buildings;
};
