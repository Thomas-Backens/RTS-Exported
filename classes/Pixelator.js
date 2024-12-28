var Renderer = function (p) {
  var spriteSheets = SPRITES;

  var renderer = (function () {
    renderer = {
      pixelSize: 2,
      hasFinishedRendering: false,
      currentFrame: 0,
      currentDirection: 0,
      currentAnimation: 0,
      currentSpriteSheet: 0,
      totalRenderedSprites: 0,
      encoder: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      sprites: {
        Troop_red: {
          still: null,
          animations: {
            walking: [
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ],
            attacking: [
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ],
          },
        },
        Troop_blue: {
          still: null,
          animations: {
            walking: [
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ],
            attacking: [
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ],
          },
        },
      },
    };

    renderer.renderStills = function () {
      var currentSprite = Object.keys(spriteSheets)[this.currentSpriteSheet];

      p.pushMatrix();
      p.translate(
        p.width / 2 -
          (spriteSheets[currentSprite].still.length / 2) * this.pixelSize,
        p.height / 2 -
          (spriteSheets[currentSprite].still.length / 2) * this.pixelSize
      );
      p.background(255, 0);
      p.noStroke();

      for (var i = 0; i < spriteSheets[currentSprite].still.length; i++) {
        for (var j = 0; j < spriteSheets[currentSprite].still[i].length; j++) {
          if (spriteSheets[currentSprite].still[i][j] === ".") {
            p.fill(0, 0);
          } else {
            var clr =
              spriteSheets[currentSprite].palettes.still[
                this.encoder.indexOf(spriteSheets[currentSprite].still[i][j])
              ];
            p.fill(clr[0], clr[1], clr[2]);
          }
          p.rect(
            j * this.pixelSize,
            i * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }

      var img = p.get();
      p.popMatrix();
      var finishedSprite = Object.keys(this.sprites)[this.currentSpriteSheet];
      this.sprites[finishedSprite].still = img;
      this.totalRenderedSprites++;
    };
    renderer.renderAnimations = function () {
      var currentSprite = Object.keys(spriteSheets)[this.currentSpriteSheet];
      var currentAnimation = Object.keys(
        spriteSheets[currentSprite].animations
      )[this.currentAnimation - 1];
      var currentDirection =
        spriteSheets[currentSprite].animations[currentAnimation][
          this.currentDirection
        ];

      p.pushMatrix();
      p.translate(
        p.width / 2 -
          (currentDirection[this.currentFrame][0].length / 2) * this.pixelSize,
        p.height / 2 -
          (currentDirection[this.currentFrame][0].length / 2) * this.pixelSize
      );
      p.background(255, 0);
      p.noStroke();

      for (var i = 0; i < currentDirection[this.currentFrame].length; i++) {
        for (
          var j = 0;
          j < currentDirection[this.currentFrame][i].length;
          j++
        ) {
          if (currentDirection[this.currentFrame][i][j] === ".") {
            p.fill(0, 0);
          } else {
            var clr =
              spriteSheets[currentSprite].palettes[currentAnimation][
                this.encoder.indexOf(currentDirection[this.currentFrame][i][j])
              ];
            p.fill(clr[0], clr[1], clr[2]);
          }
          p.rect(
            j * this.pixelSize - 0.5,
            i * this.pixelSize - 0.5,
            this.pixelSize + 0.5,
            this.pixelSize + 0.5
          );
        }
      }

      var img = p.get();
      p.popMatrix();
      var finishedSpriteKey = Object.keys(this.sprites)[
        this.currentSpriteSheet
      ];
      this.sprites[finishedSpriteKey].animations[currentAnimation][
        this.currentDirection
      ].push(img);
      this.totalRenderedSprites++;
    };
    renderer.renderAll = function () {
      var currentSprite = Object.keys(spriteSheets)[this.currentSpriteSheet];
      if (this.currentAnimation === 0) {
        this.renderStills();

        this.currentFrame = 0;
        this.currentSpriteSheet++;
      } else {
        this.renderAnimations();
        this.currentFrame++;
        var currentAnimation = Object.keys(
          spriteSheets[currentSprite].animations
        )[this.currentAnimation - 1];

        if (
          this.currentFrame >=
          spriteSheets[currentSprite].animations[currentAnimation][
            this.currentDirection
          ].length
        ) {
          this.currentFrame = 0;
          this.currentDirection++;
          if (
            this.currentDirection >=
            spriteSheets[currentSprite].animations[currentAnimation].length
          ) {
            this.currentDirection = 0;
            this.currentAnimation++;
          }
        }

        if (this.currentAnimation === 3) {
          this.currentAnimation = 1;
          this.currentSpriteSheet++;
          if (this.currentSpriteSheet >= Object.keys(spriteSheets).length) {
            this.currentAnimation = 3;
          }
        }
      }

      if (
        this.currentSpriteSheet >= Object.keys(spriteSheets).length &&
        this.currentAnimation < 1
      ) {
        this.currentSpriteSheet = 0;
        this.currentAnimation++;
      }

      if (
        this.currentSpriteSheet >= Object.keys(spriteSheets).length &&
        this.currentAnimation === 3
      ) {
        this.hasFinishedRendering = true;
      }
    };
    renderer.displayProgressBar = function () {
      var totalCount = 0;
      for (var i = 0; i < Object.keys(spriteSheets).length; i++) {
        var thisSheet = spriteSheets[Object.keys(spriteSheets)[i]];
        if (thisSheet.still) {
          totalCount++;
        }
        for (
          var j = 0;
          j < thisSheet.animations[Object.keys(thisSheet.animations)[0]].length;
          j++
        ) {
          totalCount +=
            thisSheet.animations[Object.keys(thisSheet.animations)[0]][j]
              .length;
        }
        for (
          var j = 0;
          j < thisSheet.animations[Object.keys(thisSheet.animations)[1]].length;
          j++
        ) {
          totalCount +=
            thisSheet.animations[Object.keys(thisSheet.animations)[1]][j]
              .length;
        }
      }

      p.background(25);
      p.noFill();
      p.strokeWeight(4);
      p.stroke(255);
      p.rect(p.width / 2, p.height / 2, p.width / 2, 50);
      p.noStroke();
      p.fill(255);
      p.rect(
        p.width / 2 -
          p.width / 4 +
          p.map(this.totalRenderedSprites, 0, totalCount, 0, p.width / 2) / 2,
        p.height / 2,
        p.map(this.totalRenderedSprites, 0, totalCount, 0, p.width / 2),
        50
      );

      var currentSpriteName = "";
      var currentSprite = Object.keys(spriteSheets)[this.currentSpriteSheet];
      if (currentSprite) {
        if (this.currentAnimation === 0) {
          currentSpriteName = currentSprite + ".still.0";
        } else {
          var currentAnimation = Object.keys(
            spriteSheets[currentSprite].animations
          )[this.currentAnimation - 1];
          currentSpriteName =
            currentSprite +
            "." +
            currentAnimation +
            "." +
            this.currentDirection +
            "." +
            this.currentFrame;
        }
      }
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(30);
      p.text(currentSpriteName, p.width / 2, p.height / 2 - 100);
      p.text(
        p.round(p.map(this.totalRenderedSprites, 0, totalCount, 0, 100)) + "%",
        p.width / 2,
        p.height / 2 + 50
      );
    };

    return renderer;
  })();

  return renderer;
};
