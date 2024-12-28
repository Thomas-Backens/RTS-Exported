var ResourcesManager = function (p) {
  var Resources = (function () {
    Resources = {
      resources: [],
    };

    Resources.createNew = function (c) {
      var types = ["Gold"];
      this.resources.push({
        position: new PVector(c.x, c.y),
        type: types[p.round(p.random(0, types.length - 1))],
        size: PathFinder.gridSize * 2,
        currentlyMining: 0,
        maxMineCount: 8,
      });
    };
    Resources.display = function () {
      for (var i = 0; i < this.resources.length; i++) {
        var r = this.resources[i];

        switch (r.type) {
          case "Gold":
            p.strokeWeight(3);
            p.stroke(194, 146, 0);
            p.fill(255, 244, 38);
            p.ellipse(r.position.x, r.position.y, r.size, r.size);
            break;
        }
      }
    };

    return Resources;
  })();

  return Resources;
};
