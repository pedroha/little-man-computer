(function() {
    "use strict";

    var USE_UNDEF = false;
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

        for (var i = 0; i < LMC.ram.length; i++) {
            if (i % codesPerLine === 0) {
                var address = padZero(i) + '-' + padZero((i+codesPerLine-1));
                ramLine = address + " : ";
            }
            ramLine = ramLine + " " + mailbox(LMC.ram[i]);

            if (i % codesPerLine === codesPerLine-1) {
                lines.push(ramLine);
            }
        }
        return lines;
    };

    var dump = function(header) {
        var lines = createDump();
        var str = lines.join('\n');

        console.log("============ CORE DUMP ==========");
        if (header) {
            console.log(header);
        }
        console.log(str);
        console.log("==================================");
    };

    /*
     *  load(mnemonics, memory):
     *
     *  - Converts mnemonics into 3-digit opcode instructions
     */
    var load = function(mnemonics, memory) {
        for (var i = 0; i < mnemonics.length; i++) {
            var mnemonic = mnemonics[i];

            if (mnemonic === "INP") {
                memory[i] = 901;
            }
            else
            if (mnemonic === "OUT") {
                memory[i] = 902;
            }
            else
            if (mnemonic === "HLT" || mnemonic === "COB") { // Halt or Coffee break
                memory[i] = 0;
            }
            else
            if (mnemonic.indexOf('ADD') === 0) {
                memory[i] = 100 + Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf('SUB') === 0) {
                memory[i] = 200 + Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf("STA") === 0) {
                memory[i] = 300 + Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf("LDA") === 0) {
                memory[i] = 400 + Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf("DAT") === 0) {
                memory[i] = Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf("BRA") === 0) {
                memory[i] = 600 + Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf("BRZ") === 0) {
                memory[i] = 700 + Number(mnemonic.substr(3));
            }
            else
            if (mnemonic.indexOf("BRP") === 0) {
                memory[i] = 800 + Number(mnemonic.substr(3));
            }
        }
    };

    var input = {
        idx: 0
      , buffer: ["23"]
      , get: function() {
            if (this.idx < this.buffer.length) {
                LMC.input = this.buffer[this.idx];
                this.idx++;
                return LMC.input;                
            }
            else {
                console.error("No Input left! Input Buffer has been depleted");
            }
        }
    };

    var step = function() {
        var data;

        LMC.instruction = LMC.ram[LMC.program_counter];

        var opcode = Math.floor(LMC.instruction / 100);
        var data = LMC.instruction % 100;

        if (LMC.instruction === 901) {
            LMC.accumulator = Number(input.get());
        }
        else
        if (LMC.instruction === 902) {
            LMC.output = LMC.accumulator;
        }
        else
        if (LMC.instruction === 0) {
            return true;
        }
        else
        if (opcode === 1) { // ADD
            LMC.accumulator = LMC.accumulator + LMC.ram[data];
        }
        else
        if (opcode === 2) { // SUBSTRACT
            LMC.accumulator = LMC.accumulator - LMC.ram[data];
        }
        else
        if (opcode === 3) { // STORE from accumulator
            LMC.ram[data] = LMC.accumulator;
        }
        else
        if (opcode === 4) { // LOAD into accumulator
            LMC.accumulator = LMC.ram[data];
        }
        else
        if (opcode === 6) { // BRANCH unconditional
            LMC.program_counter = data;
        }
        else
        if (opcode === 7) { // BRANCH zero
            if (LMC.accumulator === 0) {
                LMC.program_counter = data;            
            }
            else {
                LMC.program_counter++;
            }
        }
        else
        if (opcode === 8) { // BRANCH positive
            if (LMC.accumulator >= 0) {
                LMC.program_counter = data;            
            }
            else {
                LMC.program_counter++;
            }
        }

        var isBranchOpcode = (5 < opcode && opcode < 9);
        if (!isBranchOpcode) { 
            // Advance to next instruction
            LMC.program_counter++;
        }
        return false;
    };

    var run = function() {
        var i = 0;

        while (true) {
            var stop = step();
            //dump("=== " + i + " ===");
            if (stop) {
                break;
            }
            i++;
        }
        console.log("\nProgram halted!\n\n");
    };

    var main = function() {
        reset();
        dump();

        // var mnemonics = ["INP", "OUT", "HLT"];
        // var mnemonics = ["INP", "STA 8", "ADD 8", "OUT", "HLT"];
        // var mnemonics = ["INP", "STA 16", "ADD 16", "ADD 8", "OUT", "HLT", "DAT 1", "DAT 2", "DAT 3"];

        var mnemonics = ["INP", "STA 16", "ADD 16", "ADD 8", "OUT", "HLT", "DAT 1", "DAT 2", "DAT 3"];

        load(mnemonics, LMC.ram);
        dump();

        run();
        dump();

        // Idea for assert and testing:

        // assert(LMC, {
        //     accumulator: 46
        //   , program_counter: 4
        //   , input: 23
        //   , output: 46
        // })
    };

    main();

    // input.get();
    // input.get();

})();
