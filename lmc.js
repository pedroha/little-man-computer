(function() {
    "use strict";

    var inputs = ["INP", "OUT", "HLT"];

    var LMC = {
        accumulator: 0
      , program_counter: 0
      , instruction: 0
      , ram: []
      , input: 0
      , output: 0
    };

    var reset = function() {
      LMC.accumulator = 0;
      LMC.program_counter = 0;
      LMC.instruction = 0;
      LMC.ram = [];
      LMC.input = 0;
      LMC.output = 0;

      for (var i = 0; i < 100; i++) {
        LMC.ram[i] = 0;
      }
    };

    var padZero = function(val) {
        var str = "" + val;
        var extras = 4 - str.length;

        for (var i = 0; i < extras; i++) {
            str = "0" + str;
        }
        return str;
    }

    var getDump = function() {
        var lines = [];

        lines.push("ACCUMULATOR: " + LMC.accumulator);
        lines.push("PROGRAM COUNTER: " + LMC.program_counter);
        lines.push("LAST INPUT: " + LMC.input);
        lines.push("LAST OUTPUT: " + LMC.output);

        var codesPerLine = 4;

        var ramLine = "";
        var ram = LMC.ram;

        for (var i = 0; i < ram.length; i++) {
            if (i % codesPerLine === 0) {
                var address = padZero(i);
                ramLine = address + " - " + padZero(ram[i]);
            }
            ramLine = ramLine + " " + padZero(ram[i]);

            if (i % codesPerLine === codesPerLine-1) {
                lines.push(ramLine + '\n');
            }
        }
        return lines;
    };

    reset();

    var dump = getDump();
    console.log(dump);

})();
