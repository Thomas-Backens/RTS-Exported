var SelectionManager = function (p) {
  var SelectionHandler = (function () {
    SelectionHandler = {
      startPosition: new PVector(0, 0),
      selectedUnits: [],
    };

    SelectionHandler.displaySelection = function () {
      for (var i = 0; i < this.selectedUnits.length; i++) {
        var s = this.selectedUnits[i];

        p.noFill();
        p.strokeWeight(1);
        p.stroke(s.stats.team === 1 ? p.color(0, 200, 0) : p.color(200, 0, 0));
        p.ellipse(
          s.position.x,
          s.position.y + s.stats.size / 2,
          s.stats.size * 1.25,
          s.stats.size * 0.75
        );
      }
    };
    SelectionHandler.selectUnits = function (isBox) {
      if (CursorHandler.isActionCursor) {
        return;
      }

      if (isBox) {
        this.selectedUnits = [];
        var myUnitHovered = false;
        for (var i = 0; i < Units.units.length; i++) {
          var u = Units.units[i];

          if (!u.isVisible) {
            continue;
          }

          if (mouse.x > this.startPosition.x) {
            if (mouse.y > this.startPosition.y) {
              if (
                u.position.x + u.stats.size / 2 >=
                  this.startPosition.x - cam.position.x &&
                u.position.x - u.stats.size / 2 <= mouse.x - cam.position.x &&
                u.position.y + u.stats.size / 2 >=
                  this.startPosition.y - cam.position.y &&
                u.position.y - u.stats.size / 2 <= mouse.y - cam.position.y
              ) {
                if (u.stats.team === 1) {
                  myUnitHovered = true;
                }
                if (u.stats.team === 1 || !myUnitHovered) {
                  if (
                    u.stats.team === 1 ||
                    (u.stats.team !== 1 && this.selectedUnits.length <= 0)
                  ) {
                    if (
                      this.selectedUnits.length > 0 &&
                      u.priority > this.selectedUnits[0].priority
                    ) {
                      this.selectedUnits.unshift(u);
                    } else {
                      this.selectedUnits.push(u);
                    }
                  }
                }
              }
            } else {
              if (
                u.position.x + u.stats.size / 2 >=
                  this.startPosition.x - cam.position.x &&
                u.position.x - u.stats.size / 2 <= mouse.x - cam.position.x &&
                u.position.y + u.stats.size / 2 >= mouse.y - cam.position.y &&
                u.position.y - u.stats.size / 2 <=
                  this.startPosition.y - cam.position.y
              ) {
                if (u.stats.team === 1) {
                  myUnitHovered = true;
                }
                if (u.stats.team === 1 || !myUnitHovered) {
                  if (
                    u.stats.team === 1 ||
                    (u.stats.team !== 1 && this.selectedUnits.length <= 0)
                  ) {
                    if (
                      this.selectedUnits.length > 0 &&
                      u.priority > this.selectedUnits[0].priority
                    ) {
                      this.selectedUnits.unshift(u);
                    } else {
                      this.selectedUnits.push(u);
                    }
                  }
                }
              }
            }
          } else {
            if (mouse.y > this.startPosition.y) {
              if (
                u.position.x + u.stats.size / 2 >= mouse.x - cam.position.x &&
                u.position.x - u.stats.size / 2 <=
                  this.startPosition.x - cam.position.x &&
                u.position.y + u.stats.size / 2 >=
                  this.startPosition.y - cam.position.y &&
                u.position.y - u.stats.size / 2 <= mouse.y - cam.position.y
              ) {
                if (u.stats.team === 1) {
                  myUnitHovered = true;
                }
                if (u.stats.team === 1 || !myUnitHovered) {
                  if (
                    u.stats.team === 1 ||
                    (u.stats.team !== 1 && this.selectedUnits.length <= 0)
                  ) {
                    if (
                      this.selectedUnits.length > 0 &&
                      u.priority > this.selectedUnits[0].priority
                    ) {
                      this.selectedUnits.unshift(u);
                    } else {
                      this.selectedUnits.push(u);
                    }
                  }
                }
              }
            } else {
              if (
                u.position.x + u.stats.size / 2 >= mouse.x - cam.position.x &&
                u.position.x - u.stats.size / 2 <=
                  this.startPosition.x - cam.position.x &&
                u.position.y + u.stats.size / 2 >= mouse.y - cam.position.y &&
                u.position.y - u.stats.size / 2 <=
                  this.startPosition.y - cam.position.y
              ) {
                if (u.stats.team === 1) {
                  myUnitHovered = true;
                }
                if (u.stats.team === 1 || !myUnitHovered) {
                  if (
                    u.stats.team === 1 ||
                    (u.stats.team !== 1 && this.selectedUnits.length <= 0)
                  ) {
                    if (
                      this.selectedUnits.length > 0 &&
                      u.priority > this.selectedUnits[0].priority
                    ) {
                      this.selectedUnits.unshift(u);
                    } else {
                      this.selectedUnits.push(u);
                    }
                  }
                }
              }
            }
          }
        }
        if (
          this.selectedUnits.length <= 0 ||
          (this.selectedUnits.length === 1 &&
            this.selectedUnits[0].stats.team !== 1)
        ) {
          for (var i = 0; i < Buildings.buildings.length; i++) {
            var b = Buildings.buildings[i];

            if (!FogOfWar.memory.includes(b.id) && b.stats.team !== 1) {
              continue;
            }

            if (mouse.x > this.startPosition.x) {
              if (mouse.y > this.startPosition.y) {
                if (
                  b.position.x + b.stats.size / 2 >=
                    this.startPosition.x - cam.position.x &&
                  b.position.x - b.stats.size / 2 <= mouse.x - cam.position.x &&
                  b.position.y + b.stats.size / 2 >=
                    this.startPosition.y - cam.position.y &&
                  b.position.y - b.stats.size / 2 <= mouse.y - cam.position.y
                ) {
                  if (b.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (b.stats.team === 1 || this.selectedUnits.length <= 0) {
                    this.selectedUnits.push(b);
                  }
                }
              } else {
                if (
                  b.position.x + b.stats.size / 2 >=
                    this.startPosition.x - cam.position.x &&
                  b.position.x - b.stats.size / 2 <= mouse.x - cam.position.x &&
                  b.position.y + b.stats.size / 2 >= mouse.y - cam.position.y &&
                  b.position.y - b.stats.size / 2 <=
                    this.startPosition.y - cam.position.y
                ) {
                  if (b.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (b.stats.team === 1 || this.selectedUnits.length <= 0) {
                    this.selectedUnits.push(b);
                  }
                }
              }
            } else {
              if (mouse.y > this.startPosition.y) {
                if (
                  b.position.x + b.stats.size / 2 >= mouse.x - cam.position.x &&
                  b.position.x - b.stats.size / 2 <=
                    this.startPosition.x - cam.position.x &&
                  b.position.y + b.stats.size / 2 >=
                    this.startPosition.y - cam.position.y &&
                  b.position.y - b.stats.size / 2 <= mouse.y - cam.position.y
                ) {
                  if (b.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (b.stats.team === 1 || this.selectedUnits.length <= 0) {
                    this.selectedUnits.push(b);
                  }
                }
              } else {
                if (
                  b.position.x + b.stats.size / 2 >= mouse.x - cam.position.x &&
                  b.position.x - b.stats.size / 2 <=
                    this.startPosition.x - cam.position.x &&
                  b.position.y + b.stats.size / 2 >= mouse.y - cam.position.y &&
                  b.position.y - b.stats.size / 2 <=
                    this.startPosition.y - cam.position.y
                ) {
                  if (b.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (b.stats.team === 1 || this.selectedUnits.length <= 0) {
                    this.selectedUnits.push(b);
                  }
                }
              }
            }
          }
          if (this.selectedUnits.length > 0) {
            var highestPriorityBuilding = this.selectedUnits[0];
            for (var i = 0; i < this.selectedUnits.length; i++) {
              var s = this.selectedUnits[i];
              if (s.priority > highestPriorityBuilding.priority) {
                highestPriorityBuilding = s;
              }
            }
            this.selectedUnits = [highestPriorityBuilding];
          }
        }
      } else {
        this.selectedUnits = [];
        for (var i = 0; i < Units.units.length; i++) {
          var u = Units.units[i];

          if (!u.isVisible) {
            continue;
          }

          if (
            p.dist(
              mouse.x - cam.position.x,
              mouse.y - cam.position.y,
              u.position.x,
              u.position.y
            ) < u.stats.size
          ) {
            if (this.selectedUnits.length > 0) {
              if (
                p.dist(
                  mouse.x - cam.position.x,
                  mouse.y - cam.position.y,
                  u.position.x,
                  u.position.y
                ) <
                p.dist(
                  mouse.x - cam.position.x,
                  mouse.y - cam.position.y,
                  this.selectedUnits[0].position.x,
                  this.selectedUnits[0].position.y
                )
              ) {
                this.selectedUnits = [];
                this.selectedUnits.push(u);
              }
            } else {
              this.selectedUnits.push(u);
            }
          }
        }
        if (this.selectedUnits.length === 0) {
          for (var i = 0; i < Buildings.buildings.length; i++) {
            var b = Buildings.buildings[i];

            if (
              p.dist(
                mouse.x - cam.position.x,
                mouse.y - cam.position.y,
                b.position.x,
                b.position.y
              ) <
              b.stats.size / 1.5
            ) {
              if (this.selectedUnits.length > 0) {
                if (
                  p.dist(
                    mouse.x - cam.position.x,
                    mouse.y - cam.position.y,
                    b.position.x,
                    b.position.y
                  ) <
                  p.dist(
                    mouse.x - cam.position.x,
                    mouse.y - cam.position.y,
                    this.selectedUnits[0].position.x,
                    this.selectedUnits[0].position.y
                  )
                ) {
                  this.selectedUnits = [];
                  this.selectedUnits.push(b);
                }
              } else {
                this.selectedUnits.push(b);
              }
            }
          }
        }
      }
      MenuHandler.currentGroup = 0;

      if (this.selectedUnits.length > 0) {
        var highestPriority = null;
        for (var i = 0; i < this.selectedUnits.length; i++) {
          var s = this.selectedUnits[i];

          if (!highestPriority) {
            highestPriority = s;
          } else {
            if (s.priority > highestPriority) {
              highestPriority = s;
            }
          }
        }
        if (highestPriority.stats.team === 1) {
          MenuHandler.setMenu(highestPriority.menu);
        } else {
          MenuHandler.resetMenu();
        }
      } else {
        MenuHandler.resetMenu();
      }
    };
    SelectionHandler.update = function () {
      if (dragging) {
        if (!Minimap.isMovingMinimap && !CursorHandler.isActionCursor) {
          p.strokeWeight(3);
          p.stroke(0, 200, 0, 200);
          p.fill(0, 200, 0, 50);
          p.quad(
            this.startPosition.x,
            this.startPosition.y,
            mouse.x,
            this.startPosition.y,
            mouse.x,
            mouse.y,
            this.startPosition.x,
            mouse.y
          );
          p.pushMatrix();
          p.translate(cam.position.x, cam.position.y);
          var myUnitHovered = false;
          var selectedUnits = [];
          for (var i = 0; i < Units.units.length; i++) {
            var u = Units.units[i];

            if (!u.isVisible) {
              continue;
            }

            if (mouse.x > this.startPosition.x) {
              if (mouse.y > this.startPosition.y) {
                if (
                  u.position.x + u.stats.size / 2 >=
                    this.startPosition.x - cam.position.x &&
                  u.position.x - u.stats.size / 2 <= mouse.x - cam.position.x &&
                  u.position.y + u.stats.size / 2 >=
                    this.startPosition.y - cam.position.y &&
                  u.position.y - u.stats.size / 2 <= mouse.y - cam.position.y
                ) {
                  if (u.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (u.stats.team === 1 || !myUnitHovered) {
                    if (u.stats.team === 1 || selectedUnits.length <= 0) {
                      selectedUnits.push(u);
                    }
                  }
                }
              } else {
                if (
                  u.position.x + u.stats.size / 2 >=
                    this.startPosition.x - cam.position.x &&
                  u.position.x - u.stats.size / 2 <= mouse.x - cam.position.x &&
                  u.position.y + u.stats.size / 2 >= mouse.y - cam.position.y &&
                  u.position.y - u.stats.size / 2 <=
                    this.startPosition.y - cam.position.y
                ) {
                  if (u.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (u.stats.team === 1 || !myUnitHovered) {
                    if (u.stats.team === 1 || selectedUnits.length <= 0) {
                      selectedUnits.push(u);
                    }
                  }
                }
              }
            } else {
              if (mouse.y > this.startPosition.y) {
                if (
                  u.position.x + u.stats.size / 2 >= mouse.x - cam.position.x &&
                  u.position.x - u.stats.size / 2 <=
                    this.startPosition.x - cam.position.x &&
                  u.position.y + u.stats.size / 2 >=
                    this.startPosition.y - cam.position.y &&
                  u.position.y - u.stats.size / 2 <= mouse.y - cam.position.y
                ) {
                  if (u.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (u.stats.team === 1 || !myUnitHovered) {
                    if (u.stats.team === 1 || selectedUnits.length <= 0) {
                      selectedUnits.push(u);
                    }
                  }
                }
              } else {
                if (
                  u.position.x + u.stats.size / 2 >= mouse.x - cam.position.x &&
                  u.position.x - u.stats.size / 2 <=
                    this.startPosition.x - cam.position.x &&
                  u.position.y + u.stats.size / 2 >= mouse.y - cam.position.y &&
                  u.position.y - u.stats.size / 2 <=
                    this.startPosition.y - cam.position.y
                ) {
                  if (u.stats.team === 1) {
                    myUnitHovered = true;
                  }
                  if (u.stats.team === 1 || !myUnitHovered) {
                    if (u.stats.team === 1 || selectedUnits.length <= 0) {
                      selectedUnits.push(u);
                    }
                  }
                }
              }
            }
          }
          if (selectedUnits.length <= 0 || !myUnitHovered) {
            for (var i = 0; i < Buildings.buildings.length; i++) {
              var b = Buildings.buildings[i];

              if (!b.isVisible) {
                continue;
              }

              if (mouse.x > this.startPosition.x) {
                if (mouse.y > this.startPosition.y) {
                  if (
                    b.position.x + b.stats.size / 2 >=
                      this.startPosition.x - cam.position.x &&
                    b.position.x - b.stats.size / 2 <=
                      mouse.x - cam.position.x &&
                    b.position.y + b.stats.size / 2 >=
                      this.startPosition.y - cam.position.y &&
                    b.position.y - b.stats.size / 2 <= mouse.y - cam.position.y
                  ) {
                    if (b.stats.team === 1) {
                      myUnitHovered = true;
                    }
                    if (b.stats.team === 1 || selectedUnits.length <= 0) {
                      if (selectedUnits.length > 0) {
                        if (b.priority > selectedUnits[0].priority) {
                          selectedUnits = [b];
                        }
                      } else {
                        selectedUnits = [b];
                      }
                    }
                  }
                } else {
                  if (
                    b.position.x + b.stats.size / 2 >=
                      this.startPosition.x - cam.position.x &&
                    b.position.x - b.stats.size / 2 <=
                      mouse.x - cam.position.x &&
                    b.position.y + b.stats.size / 2 >=
                      mouse.y - cam.position.y &&
                    b.position.y - b.stats.size / 2 <=
                      this.startPosition.y - cam.position.y
                  ) {
                    if (b.stats.team === 1) {
                      myUnitHovered = true;
                    }
                    if (b.stats.team === 1 || selectedUnits.length <= 0) {
                      if (selectedUnits.length > 0) {
                        if (b.priority > selectedUnits[0].priority) {
                          selectedUnits = [b];
                        }
                      } else {
                        selectedUnits = [b];
                      }
                    }
                  }
                }
              } else {
                if (mouse.y > this.startPosition.y) {
                  if (
                    b.position.x + b.stats.size / 2 >=
                      mouse.x - cam.position.x &&
                    b.position.x - b.stats.size / 2 <=
                      this.startPosition.x - cam.position.x &&
                    b.position.y + b.stats.size / 2 >=
                      this.startPosition.y - cam.position.y &&
                    b.position.y - b.stats.size / 2 <= mouse.y - cam.position.y
                  ) {
                    if (b.stats.team === 1) {
                      myUnitHovered = true;
                    }
                    if (b.stats.team === 1 || selectedUnits.length <= 0) {
                      if (selectedUnits.length > 0) {
                        if (b.priority > selectedUnits[0].priority) {
                          selectedUnits = [b];
                        }
                      } else {
                        selectedUnits = [b];
                      }
                    }
                  }
                } else {
                  if (
                    b.position.x + b.stats.size / 2 >=
                      mouse.x - cam.position.x &&
                    b.position.x - b.stats.size / 2 <=
                      this.startPosition.x - cam.position.x &&
                    b.position.y + b.stats.size / 2 >=
                      mouse.y - cam.position.y &&
                    b.position.y - b.stats.size / 2 <=
                      this.startPosition.y - cam.position.y
                  ) {
                    if (b.stats.team === 1) {
                      myUnitHovered = true;
                    }
                    if (b.stats.team === 1 || selectedUnits.length <= 0) {
                      if (selectedUnits.length > 0) {
                        if (b.priority > selectedUnits[0].priority) {
                          selectedUnits = [b];
                        }
                      } else {
                        selectedUnits = [b];
                      }
                    }
                  }
                }
              }
            }
          }

          for (var i = 0; i < selectedUnits.length; i++) {
            var s = selectedUnits[i];

            p.noFill();
            p.strokeWeight(1);
            p.stroke(
              s.stats.team === 1 ? p.color(0, 200, 0) : p.color(200, 0, 0)
            );
            p.ellipse(
              s.position.x,
              s.position.y + s.stats.size / 2,
              s.stats.size * 1.25,
              s.stats.size * 0.75
            );
          }
          p.popMatrix();
        }
      } else {
        if (
          !(mouse.x <= 205 && mouse.y >= p.height - 205) &&
          mouse.y < p.height - 125
        ) {
          p.pushMatrix();
          p.translate(cam.position.x, cam.position.y);
          var unitIsBeingHovered = false;
          for (var i = 0; i < Units.units.length; i++) {
            var u = Units.units[i];

            if (!u.isVisible) {
              continue;
            }

            if (
              p.dist(
                mouse.x - cam.position.x,
                mouse.y - cam.position.y,
                u.position.x,
                u.position.y
              ) <
              u.stats.size / 2
            ) {
              p.noFill();
              p.strokeWeight(1);
              p.stroke(
                u.stats.team === 1 ? p.color(0, 200, 0) : p.color(200, 0, 0)
              );
              p.ellipse(
                u.position.x,
                u.position.y + u.stats.size / 2,
                u.stats.size * 1.25,
                u.stats.size * 0.75
              );
              unitIsBeingHovered = true;
              if (
                CursorHandler.cursorType !== "select" &&
                CursorHandler.cursorType !== "attack"
              ) {
                CursorHandler.setCursor("select", u.stats.team === 1);
              }
            }
          }
          if (!unitIsBeingHovered) {
            for (var i = 0; i < Buildings.buildings.length; i++) {
              var b = Buildings.buildings[i];

              if (!b.isVisible) {
                continue;
              }

              if (
                mouse.x - cam.position.x >= b.position.x - b.stats.size / 2 &&
                mouse.x - cam.position.x <= b.position.x + b.stats.size / 2 &&
                mouse.y - cam.position.y >= b.position.y - b.stats.size / 2 &&
                mouse.y - cam.position.y <= b.position.y + b.stats.size / 2
              ) {
                p.noFill();
                p.strokeWeight(1);
                p.stroke(
                  b.stats.team === 1 ? p.color(0, 200, 0) : p.color(200, 0, 0)
                );
                p.ellipse(
                  b.position.x,
                  b.position.y,
                  b.stats.size * 1.5,
                  b.stats.size * 1.5
                );
                if (
                  CursorHandler.cursorType !== "select" &&
                  CursorHandler.cursorType !== "attack"
                ) {
                  CursorHandler.setCursor("select", b.stats.team === 1);
                }
              }
            }
          }
          p.popMatrix();
        }
      }

      for (var i = 0; i < this.selectedUnits.length; i++) {
        if (this.selectedUnits[i].dead || !this.selectedUnits[i].isVisible) {
          this.selectedUnits.splice(i, 1);
          i--;

          if (this.selectedUnits.length <= 0) {
            MenuHandler.resetMenu();
          }
        }
      }
    };

    return SelectionHandler;
  })();

  return SelectionHandler;
};
