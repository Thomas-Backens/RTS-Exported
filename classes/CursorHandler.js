var CursorManager = function (p) {
  var CursorHandler = (function () {
    CursorHandler = {
      cursorType: "default",
      clr: p.color(0, 200, 0),
      isActionCursor: false,
      buffer: false,
    };

    CursorHandler.setCursor = function (newCursor, isGreen) {
      this.cursorType = newCursor;
      this.clr = isGreen ? p.color(0, 200, 0) : p.color(200, 0, 0);
      this.buffer = false;

      if (newCursor === "default" || newCursor === "select") {
        this.isActionCursor = false;
      } else {
        this.isActionCursor = true;
      }
    };
    CursorHandler.display = function () {
      p.pushMatrix();
      p.translate(mouse.x, mouse.y);

      switch (this.cursorType) {
        case "default":
          //{
          p.strokeWeight(2);
          p.stroke(this.clr);
          p.noFill();
          p.beginShape();
          p.vertex(0, 0);
          p.vertex(0, 15);
          p.vertex(4, 10);
          p.vertex(10, 10);
          p.vertex(0, 0);
          p.endShape();
          //}
          break;
        case "select":
          //{
          p.strokeWeight(2);
          p.stroke(this.clr);
          p.noFill();
          p.point(0, 0);
          p.beginShape();
          p.vertex(-7, -10);
          p.vertex(-10, -8);
          p.vertex(-10, 8);
          p.vertex(-7, 10);
          p.endShape();
          p.beginShape();
          p.vertex(7, -10);
          p.vertex(10, -8);
          p.vertex(10, 8);
          p.vertex(7, 10);
          p.endShape();
          //}
          break;
        case "rally":
          //{
          p.strokeWeight(2);
          p.stroke(0, 200, 0);
          p.noFill();
          p.point(0, 0);
          p.ellipse(0, 0, 25, 25);
          //}
          break;
        case "move":
          //{
          p.strokeWeight(2);
          p.stroke(0, 200, 0);
          p.noFill();
          p.point(0, 0);
          p.ellipse(0, 0, 25, 25);
          //}
          break;
        case "attack":
          //{
          p.strokeWeight(2);
          p.stroke(this.clr);
          p.noFill();
          p.line(-10, 0, 10, 0);
          p.line(0, -10, 0, 10);
          p.line(-10, -3, -10, 3);
          p.line(10, -3, 10, 3);
          p.line(-3, -10, 3, -10);
          p.line(-3, 10, 3, 10);
          //}
          break;
      }

      p.popMatrix();

      this.update();
    };
    CursorHandler.update = function () {
      if (leftClick && this.buffer) {
        if (this.isActionCursor) {
          switch (this.cursorType) {
            case "rally":
              if (
                !(
                  (mouse.x > p.width - 170 && mouse.y > p.height - 115) ||
                  (mouse.x <= 205 && mouse.y >= p.height - 205)
                )
              ) {
                Buildings.setRallyPoint();
              }
              break;
            case "move":
              PathFinder.moveUnits();
              break;
            case "attack":
              PathFinder.moveUnits(true);
              break;
          }
          this.isActionCursor = false;
        }
      }
      if (rightClick) {
        if (!this.isActionCursor) {
          if (!(mouse.x >= 205 && mouse.y >= p.height - 125)) {
            PathFinder.moveUnits();
            Buildings.setRallyPoint();
          }
        } else {
          this.isActionCursor = false;
        }
      }
      this.buffer = true;
    };

    return CursorHandler;
  })();

  return CursorHandler;
};
