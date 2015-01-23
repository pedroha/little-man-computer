(function() {
    "use strict";

    var USE_UNDEF = true;
    var MAILBOX_UNDEFINED = (USE_UNDEF) ? '---' : '000';

    // Based on: http://matt.krutar.org/LMC4/
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
        LMC.ram[i] = MAILBOX_UNDEFINED;
      }
    };

    var padZero = function(val) {
        var str = "" + val;
        var extras = 3 - str.length;

        for (var i = 0; i < extras; i++) {
            str = "0" + str;
        }
        return str;
    };

    var mailbox = function(val) {
        return "[" + padZero(val) + "]";
    };

    var createDump = function() {
        var lines = [];

        lines.push("ACCUMULATOR: " + padZero(LMC.accumulator));
        lines.push("PROGRAM COUNTER: " + padZero(LMC.program_counter));
        lines.push("LAST INPUT: " + padZero(LMC.input));
        lines.push("LAST OUTPUT: " + padZero(LMC.output));

        var codesPerLine = 4;

        var ramLine = "";

        lines.push("RAM:");

        var ram = LMC.ram;
        for (var i = 0; i < ram.length; i++) {
            if (i % codesPerLine === 0) {
                var address = padZero(i) + '-' + padZero((i+codesPerLine-1));
                ramLine = address + " : ";
            }
            ramLine = ramLine + " " + mailbox(ram[i]);

            if (i % codesPerLine === codesPerLine-1) {
                lines.push(ramLine);
            }
        }
        return lines;
    };

    var dump = function() {
        var lines = createDump();
        var str = lines.join('\n');
        console.log(str);
    }

    var load = function(mnemonics, memory) {
        for (var i = 0; i < mnemonics.length; i++) {
            var mnemonic = mnemonics[i];

            if (mnemonic === "INP") {
                memory[i] = "901";
            }
            else
            if (mnemonic === "OUT") {
                memory[i] = "902";
            }
            else
            if (mnemonic === "HLT") {
                memory[i] = "000";
            }
        }
    };

    var main = function() {
        reset();
        dump();

        var mnemonics = ["INP", "OUT", "HLT"];
        load(mnemonics, LMC.ram);

        dump();
    };

    main();

})();
