var IndicatorsManager = function (p) {
  var Indicators = (function () {
    Indicators = {
      indicators: [],
    };

    Indicators.createNew = function (x, y, type) {
      this.indicators.push({
        position: new PVector(x, y),
        type: type,
      });
    };
    Indicators.display = function () {
      for (var j = 0; j < this.indicators.length; j++) {
        var i = this.indicators[i];

        switch (i.type) {
          case "default":
            break;
        }
      }
    };

    return Indicators;
  })();

  return Indicators;
};
