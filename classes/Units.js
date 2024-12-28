var UnitsManager = function (p) {
  var Units = (function () {
    Units = {
      units: [],
      unitId: 0,
    };

    Units.createNew = function (c) {
      var menu, size, priority, typeColor;
      switch (c.unitType) {
        case "Worker":
          menu = [
            {
              title: "Move",
              description: "Command your unit to Move",
              price: 0,
              icon: "Move",
              shortcut: keybinds.Move,
              action: function () {
                CursorHandler.setCursor("move");
              },
            },
            {
              title: "Stop",
              description: "Command your unit to Stop",
              price: 0,
              icon: "Stop",
              shortcut: keybinds.Stop,
              action: function () {
                Units.stopCommand();
              },
            },
            {
              title: "Attack",
              description: "Command your unit to Attack",
              price: 0,
              icon: "Attack",
              shortcut: keybinds.Attack,
              action: function () {
                CursorHandler.setCursor("attack");
              },
            },
            {
              title: "Buildings",
              description: "Opens the buildings menu",
              price: 0,
              icon: "Building",
              shortcut: keybinds.Menu1,
              action: function () {
                println("Open Building menu");
              },
            },
            {},
            {
              title: "Gather",
              description: "Select a resource to\nstart gathering it",
              price: 0,
              icon: "Gather",
              shortcut: keybinds.Gather,
              action: function () {
                CursorHandler.setCursor("gather");
              },
            },
          ];
          size = 1;
          priority = 1;
          if (c.team) {
            switch (c.team) {
              case 1:
                typeColor = "Troop_blue";
                break;
              case 2:
                typeColor = "Troop_red";
                break;
            }
          } else {
            typeColor = "Troop_blue";
          }
          break;
        case "Troop":
          menu = [
            {
              title: "Move",
              description: "Command your unit to Move",
              price: 0,
              icon: "Move",
              shortcut: keybinds.Move,
              action: function () {
                CursorHandler.setCursor("move");
              },
            },
            {
              title: "Stop",
              description: "Command your unit to Stop",
              price: 0,
              icon: "Stop",
              shortcut: keybinds.Stop,
              action: function () {
                Units.stopCommand();
              },
            },
            {
              title: "Attack",
              description: "Command your unit to Attack",
              price: 0,
              icon: "Attack",
              shortcut: keybinds.Attack,
              action: function () {
                CursorHandler.setCursor("attack");
              },
            },
            {},
            {},
            {},
          ];
          size = 2;
          priority = 2;
          if (c.team) {
            switch (c.team) {
              case 1:
                typeColor = "Troop_blue";
                break;
              case 2:
                typeColor = "Troop_red";
                break;
            }
          } else {
            typeColor = "Troop_blue";
          }
          break;
        default:
          menu = [
            {
              title: "Move",
              description: "Command your unit to Move",
              price: 0,
              icon: "Move",
              shortcut: keybinds.Move,
              action: function () {
                CursorHandler.setCursor("move");
              },
            },
            {
              title: "Stop",
              description: "Command your unit to Stop",
              price: 0,
              icon: "Stop",
              shortcut: keybinds.Stop,
              action: function () {
                Units.stopCommand();
              },
            },
            {
              title: "Attack",
              description: "Command your unit to Attack",
              price: 0,
              icon: "Attack",
              shortcut: keybinds.Attack,
              action: function () {
                CursorHandler.setCursor("attack");
              },
            },
            {},
            {},
            {},
          ];
          size = 1;
          priority = 1;
          if (c.team) {
            switch (c.team) {
              case 1:
                typeColor = "Troop_blue";
                break;
              case 2:
                typeColor = "Troop_red";
                break;
            }
          } else {
            typeColor = "Troop_blue";
          }
          break;
      }
      this.units.push({
        id: this.unitId,
        position: new PVector(c.x, c.y),
        velocity: new PVector(0, 0),
        destination: c.rallyPoint || new PVector(c.x, c.y),
        hasReachedDestination: false,
        waypoints: [],
        unitSize: size,
        typeColor: typeColor,
        unitType: c.unitType || "Troop",
        isVisible: false,
        canMove: true,
        priority: priority,
        threatPriority: size,
        attackTimer: 0,
        attackPriority: 0,
        target: null,
        lockedTarget: false,
        inAttackMode: false,
        chaseBuffer: 60,
        chaseTimer: 0,
        tempStopped: false,
        isAttackMoving: false,

        stats: {
          health: 40 * size,
          maxHealth: 40 * size,
          damage: size === 1 ? 5 : 8,
          attackSpeed: (0.6 + 0.2 * size) * 60,
          armor: size - 1,
          movementSpeed: 0,
          maxMovementSpeed: 2,
          acceleration: 0.05,
          hasAcceleration: false,
          size: (size * PathFinder.gridSize) / 4 + 20,
          visionRange: 250 + 100 * (size / 2),
          followRange: 250 + 100 * (size / 2), // 225 + (75*(c.size/2)),
          attackRange: 200 + 50 * (size / 2),
          team: c.team || 1,
        },

        menu: menu,
        dead: false,

        moving: false,
        facing: 0,
        flipped: false,
        currentState: 0,
        currentFrame: 0,
        animationTimer: 0,
        animationBuffer: 30,
        sprites: {
          still: sprites[typeColor].still,
          walking: sprites[typeColor].animations.walking,
          attacking: sprites[typeColor].animations.attacking,
          walkingSpeed: 6,
          attackingSpeed: 4,
        },
      });
      this.unitId++;
    };
    Units.display = function () {
      for (var i = 0; i < SelectionHandler.selectedUnits.length; i++) {
        var s = SelectionHandler.selectedUnits[i];

        if (!s.canMove) {
          continue;
        }

        if (s.stats.team === 1 && s.waypoints.length > 0) {
          p.noFill();
          p.strokeWeight(2);
          p.stroke(s.isAttackMoving ? p.color(200, 0, 0) : p.color(0, 200, 0));
          var x = s.waypoints[s.waypoints.length - 1].x * PathFinder.gridSize;
          var y = s.waypoints[s.waypoints.length - 1].y * PathFinder.gridSize;
          p.ellipse(x, y, 25, 25);
          p.line(x - 5, y - 5, x + 5, y + 5);
          p.line(x + 5, y - 5, x - 5, y + 5);
        }
      }
      for (var i = 0; i < this.units.length; i++) {
        if (this.units[i].dead) {
          this.units.splice(i, 1);
          continue;
        }

        var u = this.units[i];

        this.update(u);
        this.handleAttack(u);

        u.isVisible = false;

        if (!FogOfWar.unitMemory.includes(u.id) && u.stats.team !== 1) {
          continue;
        }

        u.isVisible = true;

        // #region Facing setup

        // -!-- For angelMode = degrees --!-

        // var degTotal = (180 / 17) * 15;
        // var degApart = degTotal / 15;
        // var angle = p.ceil(u.velocity.heading() / degApart);

        // u.flipped = false;
        // var finalDir = angle;
        // if (angle >= 10 && angle <= 24) {
        //   finalDir -= 26;
        //   finalDir *= -1;
        //   u.flipped = true;
        // }
        // if (angle >= 26) {
        //   finalDir -= 25;
        // }
        // if (angle <= 9) {
        //   finalDir += 8;
        // }
        // if (angle === 0) {
        //   finalDir = 9;
        // } else if (angle === -8) {
        //   finalDir = 1;
        // }
        // if (angle < -8) {
        //   finalDir -= 1;
        //   finalDir *= -1;
        //   u.flipped = true;
        // }

        // u.facing = finalDir - 1;

        // -!-- For angelMode = Radians --!-

        var totalRadians = Math.PI;
        var degApart = totalRadians / 16;
        var heading = u.velocity.heading();

        u.flipped = false;
        if (heading < 0) {
          heading += 2 * Math.PI;
        }

        var normalizedAngle = (heading + Math.PI / 2) % (2 * Math.PI);

        var spriteIndex = Math.floor(normalizedAngle / degApart);

        if (spriteIndex > 16) {
          spriteIndex -= 17;
        }

        var isFlipped = normalizedAngle > Math.PI;

        if (isFlipped) {
          if (spriteIndex !== 16) {
            u.flipped = true;
            spriteIndex = 16 - spriteIndex;
          }
        }
        u.facing = spriteIndex;
        // #endregion

        if (u.unitSize === 1) {
          p.strokeWeight(3);
          p.stroke(50);
          p.fill(u.stats.team === 1 ? p.color(0, 200, 0) : p.color(175, 0, 0));
          p.ellipse(u.position.x, u.position.y, u.stats.size, u.stats.size);
          p.noStroke();
          p.fill(150);
          p.ellipse(
            u.position.x,
            u.position.y,
            u.stats.size - 8,
            u.stats.size - 8
          );
        } else {
          p.noStroke();
          p.fill(0, 50);
          p.ellipse(
            u.position.x,
            u.position.y + u.stats.size / 2,
            u.stats.size,
            u.stats.size / 2
          );
          p.pushMatrix();
          p.translate(u.position.x, u.position.y);
          p.scale(0.75);
          if (u.flipped) {
            p.scale(-1, 1);
          }

          if (u.currentState === 0) {
            p.image(
              u.sprites.walking[u.facing][u.currentFrame],
              -p.width / 2,
              -p.height / 2
            );

            if (u.moving) {
              u.animationTimer++;
              if (u.animationTimer >= u.sprites.walkingSpeed) {
                u.animationTimer = 0;
                u.currentFrame++;
                if (u.currentFrame >= u.sprites.walking[0].length) {
                  u.currentFrame = 0;
                }
              }
            }
          } else {
            p.image(
              u.sprites.attacking[u.facing][u.currentFrame],
              -p.width / 2,
              -p.height / 2
            );

            u.animationTimer++;
            if (u.animationTimer >= u.sprites.attackingSpeed) {
              if (u.currentFrame < u.sprites.attacking[u.facing].length - 1) {
                u.animationTimer = 0;
                u.currentFrame++;
              }
            }
          }
          p.popMatrix();
        }
      }
    };
    Units.displayHealth = function () {
      for (var i = 0; i < this.units.length; i++) {
        var u = this.units[i];

        if (!u.isVisible) {
          continue;
        }

        var squares = 0;
        switch (u.unitSize) {
          case 1:
            squares = 4;
            break;
          case 2:
            squares = 5;
            break;
        }

        p.strokeWeight(2);
        p.stroke(25);
        p.fill(50);
        p.rect(u.position.x, u.position.y - u.stats.size, 8 * squares, 8);

        var low = p.color(255, 0, 0);
        var mid = p.color(255, 255, 0);
        var high = p.color(0, 255, 0);
        var healthRatio = p.constrain(u.stats.health / u.stats.maxHealth, 0, 1);
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
            u.position.x - 8 * (squares / 2) + 8 * j + 4,
            u.position.y - u.stats.size,
            8,
            8
          );
        }
        p.noStroke();
        p.fill(0, 100);
        p.rect(u.position.x, u.position.y - u.stats.size + 3, 8 * squares, 4);
      }
    };
    Units.update = function (u) {
      if (u.waypoints.length > 0) {
        if (
          p.dist(
            u.waypoints[0].x * PathFinder.gridSize,
            u.waypoints[0].y * PathFinder.gridSize,
            u.position.x,
            u.position.y
          ) <=
          PathFinder.gridSize / 2
        ) {
          u.waypoints.splice(0, 1);
          if (u.waypoints.length > 0) {
            u.destination = new PVector(
              u.waypoints[0].x * PathFinder.gridSize,
              u.waypoints[0].y * PathFinder.gridSize
            );
          }
        }
      } else {
        u.waypoints = [];
      }

      u.moving = false;
      if (!u.hasReachedDestination && !u.tempStopped) {
        if (u.currentState === 1) {
          if (u.currentFrame >= u.sprites.attacking[u.facing].length - 1) {
            u.moving = true;
            u.currentState = 0;
          }
        } else {
          u.moving = true;
          u.currentState = 0;
        }
      }
      var direction = PVector.sub(u.destination, u.position);
      direction.normalize();
      if (u.stats.hasAcceleration) {
        direction.mult(1 + u.stats.movementSpeed / u.stats.maxMovementSpeed);
      } else {
        u.stats.movementSpeed = u.stats.maxMovementSpeed;
        direction.mult(u.stats.movementSpeed * 2);
      }

      if (
        p.dist(u.destination.x, u.destination.y, u.position.x, u.position.y) >
          u.stats.movementSpeed &&
        !u.hasReachedDestination &&
        u.moving
      ) {
        u.velocity.add(direction);
        u.velocity.limit(u.stats.movementSpeed);
        if (u.stats.hasAcceleration) {
          u.stats.movementSpeed += u.stats.acceleration;
          u.stats.movementSpeed = p.constrain(
            u.stats.movementSpeed,
            0,
            u.stats.maxMovementSpeed
          );
        }
      } else {
        if (!u.hasReachedDestination && u.waypoints.length <= 0) {
          u.hasReachedDestination = true;
          u.inAttackMode = true;

          if (u.stats.hasAcceleration) {
            u.velocity.mult(0.9 - 0.01 * u.stats.maxMovementSpeed);
            u.stats.movementSpeed *= 0.9 - 0.01 * u.stats.maxMovementSpeed;
            if (u.velocity.mag() < 0.25) {
              u.velocity.set(0, 0);
            }
            if (u.stats.movementSpeed < 0.25) {
              u.stats.movementSpeed = 0;
            }
          }
        }
      }
      if (!u.hasReachedDestination && !u.tempStopped && u.moving) {
        u.position.add(u.velocity);
      }

      for (var i = 0; i < this.units.length; i++) {
        var U = this.units[i];

        var distance = p.PVector.dist(U.position, u.position);
        var minDist = U.stats.size / 2 + u.stats.size / 2;

        if (distance < minDist) {
          var repelForce = PVector.sub(U.position, u.position);
          repelForce.normalize();
          var overlap = minDist - distance;
          repelForce.mult(overlap * 0.5);
          if (!U.tempStopped) {
            U.position.add(repelForce);
          }
        }

        if (!FogOfWar.unitMemory.includes(u.id)) {
          if (U.stats.team !== 1) {
            continue;
          }

          if (
            p.dist(u.position.x, u.position.y, U.position.x, U.position.y) <=
            U.stats.visionRange + u.stats.size / 2
          ) {
            FogOfWar.unitMemory.push(u.id);
          }
        }
      }
      if (!FogOfWar.unitMemory.includes(u.id)) {
        for (var i = 0; i < Buildings.buildings.length; i++) {
          var b = Buildings.buildings[i];

          if (b.stats.team !== 1) {
            continue;
          }

          if (
            p.dist(b.position.x, b.position.y, u.position.x, u.position.y) <=
            b.stats.visionRange + u.stats.size / 2
          ) {
            FogOfWar.unitMemory.push(u.id);
          }
        }
      }
    };
    Units.handleAttack = function (u) {
      if (u.dead) {
        return;
      }

      if (u.chaseTimer > 0) {
        u.chaseTimer--;
      }
      if (u.attackTimer > 0) {
        u.attackTimer--;
      }

      if (!u.inAttackMode) {
        return;
      }

      // Set target
      for (var i = 0; i < this.units.length; i++) {
        var U = this.units[i];

        if (u === U || u.stats.team === U.stats.team || U.dead) {
          continue;
        }

        if (
          distSquared(u.position.x, u.position.y, U.position.x, U.position.y) <
          u.stats.followRange * u.stats.followRange
        ) {
          if (!u.target) {
            u.target = U;
          } else {
            if (
              U.threatPriority > u.target.threatPriority ||
              (U.threatPriority === u.target.threatPriority &&
                distSquared(
                  U.position.x,
                  U.position.y,
                  u.position.x,
                  u.position.y
                ) <
                  distSquared(
                    u.target.position.x,
                    u.target.position.y,
                    u.position.x,
                    u.position.y
                  ))
            ) {
              u.target = U;
            }
          }
        }
      }
      for (var i = 0; i < Buildings.buildings.length; i++) {
        var b = Buildings.buildings[i];

        if (u.stats.team === b.stats.team || b.dead) {
          continue;
        }

        if (
          distSquared(u.position.x, u.position.y, b.position.x, b.position.y) <
          (u.stats.followRange + b.stats.size / 2) *
            (u.stats.followRange + b.stats.size / 2)
        ) {
          if (!u.target) {
            u.target = b;
          } else {
            if (
              b.threatPriority > u.target.threatPriority ||
              (b.threatPriority === u.target.threatPriority &&
                distSquared(
                  b.position.x,
                  b.position.y,
                  u.position.x,
                  u.position.y
                ) +
                  b.stats.size / 2 <
                  distSquared(
                    u.target.position.x,
                    u.target.position.y,
                    u.position.x,
                    u.position.y
                  ) +
                    u.target.stats.size / 2)
            ) {
              u.target = b;
            }
          }
        }
      }

      // Check if exists
      if (!u.target) {
        u.tempStopped = false;
        return;
      }

      // Check if dead
      if (u.target) {
        if (u.target.dead || !u.target.isVisible) {
          u.tempStopped = false;
          u.target = null;
          return;
        }
      }

      // Check if out of follow range
      if (u.target) {
        //if (!u.lockedTarget) {
        var targetSize = u.target.canMove ? 0 : u.target.stats.size / 2;
        if (
          distSquared(
            u.position.x,
            u.position.y,
            u.target.position.x,
            u.target.position.y
          ) >
          (u.stats.followRange + targetSize) *
            (u.stats.followRange + targetSize)
        ) {
          u.tempStopped = false;
          u.target = null;
          return;
        }
        //}
      }

      // Chase until in range, and then stop/attack
      if (u.target) {
        if (!u.moving) {
          var direction = PVector.sub(u.target.position, u.position);
          direction.normalize();
          direction.mult(2);

          u.velocity.add(direction);
          u.velocity.limit(1);
        }

        var targetSize = u.target.canMove ? 0 : u.target.stats.size / 2;
        if (u.chaseTimer <= 0) {
          if (
            distSquared(
              u.position.x,
              u.position.y,
              u.target.position.x,
              u.target.position.y
            ) >
            (u.stats.attackRange + targetSize) *
              (u.stats.attackRange + targetSize)
          ) {
            if (u.waypoints.length > 0) {
              u.waypoints.unshift(
                new PVector(
                  p.floor(
                    (u.target.position.x - PathFinder.gridSize / 2) /
                      PathFinder.gridSize
                  ) + 1,
                  p.floor(
                    (u.target.position.y - PathFinder.gridSize / 2) /
                      PathFinder.gridSize
                  ) + 1
                )
              );
              u.destination = new PVector(
                u.waypoints[0].x * PathFinder.gridSize,
                u.waypoints[0].y * PathFinder.gridSize
              );
            } else {
              Units.moveToCommand(
                u,
                [
                  new PVector(
                    p.floor(
                      (u.target.position.x - PathFinder.gridSize / 2) /
                        PathFinder.gridSize
                    ) + 1,
                    p.floor(
                      (u.target.position.y - PathFinder.gridSize / 2) /
                        PathFinder.gridSize
                    ) + 1
                  ),
                ],
                false,
                true,
                false
              );
            }
            u.tempStopped = false;
            u.chaseTimer = u.chaseBuffer;
          }
        }

        // If in range, stop/attack
        if (
          distSquared(
            u.position.x,
            u.position.y,
            u.target.position.x,
            u.target.position.y
          ) <=
          (u.stats.attackRange + targetSize) *
            (u.stats.attackRange + targetSize)
        ) {
          if (u.waypoints.length > 0) {
            this.tempStop(u);
            if (!u.isAttackMoving) {
              u.hasReachedDestination = true;
            }
          }

          // Attack after duration
          if (u.attackTimer <= 0) {
            u.attackTimer = u.stats.attackSpeed;
            u.currentState = 1;
            u.animationTimer = 0;
            u.currentFrame = 0;

            if (u.target.canMove) {
              this.takeDamage(u.target, u.stats.damage);
            } else {
              Buildings.takeDamage(u.target, u.stats.damage);
            }

            if (u.target.health <= 0) {
              u.tempStopped = false;
              u.target = null;
            }
          }
        }
      }
    };
    Units.moveToCommand = function (
      u,
      path,
      removeMouse,
      isAttacking,
      inAttackMove
    ) {
      u.inAttackMode = isAttacking || false;
      u.isAttackMoving = inAttackMove || false;
      u.tempStopped = isAttacking || false;
      if (!isAttacking) {
        u.target = null;
      }
      u.hasReachedDestination = false;
      u.waypoints = path;
      if (!removeMouse && PathFinder.isReachable) {
        u.waypoints.push(
          new PVector(
            (mouse.x - cam.position.x) / PathFinder.gridSize,
            (mouse.y - cam.position.y) / PathFinder.gridSize
          )
        );
      }
      u.destination = new PVector(
        u.waypoints[0].x * PathFinder.gridSize,
        u.waypoints[0].y * PathFinder.gridSize
      );
    };
    Units.stopCommand = function () {
      for (var i = 0; i < SelectionHandler.selectedUnits.length; i++) {
        var s = SelectionHandler.selectedUnits[i];

        s.hasReachedDestination = true;
        s.waypoints = [];
        s.inAttackMode = true;
      }
    };
    Units.tempStop = function (u) {
      u.inAttackMode = true;
      u.tempStopped = true;
    };
    Units.takeDamage = function (u, dmg) {
      var totalDamage = dmg - u.stats.armor;
      if (totalDamage <= 0) {
        totalDamage = 0.5;
      }
      u.stats.health -= totalDamage;

      if (u.stats.health <= 0) {
        u.dead = true;
      }
    };

    return Units;
  })();

  return Units;
};
