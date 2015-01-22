(function() {
    "use strict";

    var inputs = ["INP", "OUT", "HLT"];

    var LMC = {
        accumulator: 0
      , program_counter: 0
      , instruction: 0
      , ram: new Array(100)
      , input: 0
      , output: 0
    };

    var reset = function() {
      LMC.accumulator = 0;
      LMC.program_counter = 0;
      LMC.instruction = 0;
      LMC.ram = new Array(100);
      LMC.input = 0;
      LMC.output = 0;
    };

    var getDump = function() {
        var lines = [];

        lines.push("ACCUMULATOR: " + LMC.accumulator);
        lines.push("PROGRAM COUNTER: " + LMC.program_counter);
        lines.push("LAST INPUT: " + LMC.input);
        lines.push("LAST OUTPUT: " + LMC.output);

        return lines;
    };

    var dump = getDump();
    console.log(dump);

})();
