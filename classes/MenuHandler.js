var MenuManager = function (p) {
  var MenuHandler = (function () {
    MenuHandler = {
      Menu: [],
      currentGroup: 0,
    };

    MenuHandler.setMenu = function (menu) {
      this.Menu = menu;

      for (var i = 0; i < this.Menu.length; i++) {
        var m = this.Menu[i];

        m.position = new PVector(
          p.width - 145 + 55 * i - 165 * p.floor(i / 3),
          p.height - 90 + 55 * p.floor(i / 3)
        );
        m.isHovering = false;
      }
    };
    MenuHandler.resetMenu = function (menu) {
      this.Menu = [{}, {}, {}, {}, {}, {}];
    };
    MenuHandler.display = function () {
      p.strokeWeight(3);
      p.stroke(100);

      //{
      p.fill(75);
      p.beginShape();
      p.vertex(-5, p.height - 215);
      p.vertex(205, p.height - 215);
      p.vertex(212.5, p.height - 212.5);
      p.vertex(215, p.height - 205);
      p.vertex(215, p.height - 140);
      p.vertex(220, p.height - 130);
      p.vertex(230, p.height - 125);
      p.vertex(p.width + 5, p.height - 125);
      p.vertex(p.width + 5, p.height + 5);
      p.vertex(-5, p.height + 5);
      p.endShape();

      p.fill(0);
      p.beginShape();
      p.vertex(230, p.height - 10);
      p.vertex(220, p.height - 15);
      p.vertex(215, p.height - 25);
      p.vertex(215, p.height - 100);
      p.vertex(220, p.height - 110);
      p.vertex(230, p.height - 115);
      p.vertex(p.width - 195, p.height - 115);
      p.vertex(p.width - 185, p.height - 110);
      p.vertex(p.width - 180, p.height - 100);
      p.vertex(p.width - 180, p.height - 25);
      p.vertex(p.width - 185, p.height - 15);
      p.vertex(p.width - 195, p.height - 10);
      p.vertex(230, p.height - 10);
      p.endShape();
      //} Middle graphic

      for (var i = 0; i < this.Menu.length; i++) {
        var m = this.Menu[i];

        if (m.title) {
          var btnX = m.position.x;
          var btnY = m.position.y;

          p.fill(25);
          p.rect(btnX, btnY, 50, 50, 4);
          p.fill(255);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(10);
          p.text(String.fromCharCode(m.shortcut), btnX - 17, btnY - 17);

          if (m.icon) {
            if (sprites[m.icon] !== undefined) {
              p.pushMatrix();
              p.translate(btnX, btnY);
              p.scale(0.4);
              p.image(sprites[m.icon].still, -p.width / 2, -p.height / 2);
              p.popMatrix();
            }
          }

          if (m.isHovering && !dragging) {
            p.fill(25);
            p.rect(p.constrain(btnX, 80, p.width - 80), btnY - 80, 150, 100, 4);
            p.fill(255);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(10);
            p.text(
              m.title + " (" + String.fromCharCode(m.shortcut) + ")",
              p.constrain(btnX, 80, p.width - 80) - 65,
              btnY - 115
            );
            p.textAlign(p.LEFT, p.TOP);
            p.textSize(10);
            p.text(
              m.description,
              p.constrain(btnX, 80, p.width - 80) - 65,
              btnY - 105
            );

            if (m.price > 0) {
              p.textAlign(p.RIGHT, p.CENTER);
              p.textSize(20);
              p.text(
                "$" + m.price,
                p.constrain(btnX, 80, p.width - 80) + 65,
                btnY - 115
              );
            }

            if (leftClick) {
              m.action(SelectionHandler.selectedUnits[0]);
            }
          }

          if (
            mouse.x >= btnX - 25 &&
            mouse.x <= btnX + 25 &&
            mouse.y >= btnY - 25 &&
            mouse.y <= btnY + 25
          ) {
            m.isHovering = true;
          } else {
            m.isHovering = false;
          }

          if (keysUp[m.shortcut]) {
            m.action(SelectionHandler.selectedUnits[0]);
          }
        } else {
          p.fill(50, 100);
          p.rect(
            p.width - 145 + 55 * i - 165 * p.floor(i / 3),
            p.height - 90 + 55 * p.floor(i / 3),
            50,
            50,
            4
          );
        }
      }

      if (SelectionHandler.selectedUnits.length === 1) {
        var s = SelectionHandler.selectedUnits[0];
        if (s.queue && s.stats.team === 1 && s.canTrain) {
          p.noFill();
          p.strokeWeight(3);
          p.stroke(100, 150);
          p.rect(240, p.height - 82.5, 35, 35, 4);
          p.rect(240, p.height - 42.5, 35, 35, 4);
          p.rect(280, p.height - 42.5, 35, 35, 4);
          p.rect(320, p.height - 42.5, 35, 35, 4);
          p.rect(360, p.height - 42.5, 35, 35, 4);

          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(25);
          p.fill(100, 150);
          p.text("1", 240, p.height - 85);
          p.text("2", 240, p.height - 45);
          p.text("3", 280, p.height - 45);
          p.text("4", 320, p.height - 45);
          p.text("5", 360, p.height - 45);

          p.textSize(10);
          p.stroke(200);
          for (var i = 0; i < s.queue.length; i++) {
            p.fill(0);
            p.rect(
              240 + (i > 1 ? 40 * (i - 1) : 0),
              p.height - 82.5 + (i > 0 ? 40 : 0),
              35,
              35,
              5
            );
            p.fill(255);
            p.text(
              s.queue[i],
              240 + (i > 1 ? 40 * (i - 1) : 0),
              p.height - 82.5 + (i > 0 ? 40 : 0)
            );
          }

          if (s.queue.length > 0) {
            p.noFill();
            p.rect(320, p.height - 75, 100, 8, 2);
            p.noStroke();
            p.fill(200);
            p.rect(
              p.map(s.queueTimer, s.queueTime, 0, 270, 320),
              p.height - 75,
              p.map(s.queueTimer, s.queueTime, 0, 0, 100),
              8,
              2
            );
          }
        }

        p.noFill();
        p.strokeWeight(3);
        p.stroke(100);
        p.rect(p.width - 206.5, p.height - 82.5, 35, 35, 4);
        p.rect(p.width - 206.5, p.height - 42.5, 35, 35, 4);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(25);
        p.fill(200);
        p.text(s.stats.damage, p.width - 206.5, p.height - 85);
        p.text(s.stats.armor, p.width - 206.5, p.height - 45);
        p.textSize(12);
        p.textLeading(10);
        p.text("D\nM\nG", p.width - 232, p.height - 82.5);
        p.text("D\nE\nF", p.width - 232, p.height - 42.5);
      } else if (SelectionHandler.selectedUnits.length > 1) {
        for (
          var i = this.currentGroup * 24;
          i <
          p.min(
            SelectionHandler.selectedUnits.length,
            (this.currentGroup + 1) * 24
          );
          i++
        ) {
          var s = SelectionHandler.selectedUnits[i];

          p.noFill();
          p.strokeWeight(3);
          p.stroke(100);
          var y = 0;
          if (i - this.currentGroup * 24 > 11) {
            y = 1;
          }
          p.rect(
            270 + 40 * (i - this.currentGroup * 24) - 40 * 12 * y,
            p.height - 85 + 40 * y,
            35,
            35,
            4
          );
          if (sprites[s.unitType] !== undefined) {
            p.pushMatrix();
            p.translate(
              270 + 40 * (i - this.currentGroup * 24) - 40 * 12 * y,
              p.height - 85 + 40 * y
            );
            p.scale(0.3);
            p.image(sprites[s.unitType].still, -p.width / 2, -p.height / 2);
            p.popMatrix();
          }
        }
        for (
          var i = 0;
          i < p.ceil(SelectionHandler.selectedUnits.length / 24);
          i++
        ) {
          p.noFill();
          p.strokeWeight(3);
          p.stroke(100, i === this.currentGroup ? 255 : 150);

          if (
            mouse.x >= 235 - 15 &&
            mouse.x <= 235 + 15 &&
            mouse.y >= p.height - 95 + 20 * i - 8 &&
            mouse.y <= p.height - 95 + 20 * i + 10
          ) {
            p.stroke(150);

            if (leftClick) {
              this.currentGroup = i;
            }
          }
          p.rect(235, p.height - 95 + 20 * i, 25, 15, 4);
          p.fill(200);
          p.textSize(10);
          p.text(i + 1, 235, p.height - 95 + 20 * i);
        }
      }
    };

    return MenuHandler;
  })();

  return MenuHandler;
};
