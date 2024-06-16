#!/usr/bin/env node
const { statSync, readFileSync } = require("node:fs");
const [, , ...args] = process.argv;

const out = [];

const help = () => {
  console.log("node wc util");
  console.log("---- FLAGS ----");
  console.log("-h: help");
  console.log("-c: count bytes in file");
  console.log("-l: count lines in file");
  console.log("-w: count words in file");
  console.log("-m: count characters in file");
};

const countBytes = (fileName) => {
  const stats = statSync(fileName);
  out[3] = stats.size;
};

const countLines = async (fileName) => {
  const file = readFileSync(fileName, "utf8");
  let count = 0;
  for(let i = 0; i < file.length; i++){
    let char = file[i];
    if(char === '\n'){
      count++;
    };
  }
  out[1] = count;
};

const countWords = (fileName) => {
  const file = readFileSync(fileName, "utf8");
  let whitespace = true;
  let count = 0;
  for (let i = 0; i < file.length; i++) {
    const char = file[i];

    if (
      char === " " ||
      char === "\n" ||
      char === "\r" ||
      char.charCodeAt() === 9
    ) {
      whitespace = true;
    } else if (char !== " " && whitespace === true && char !== "\n") {
      whitespace = false;
      count++;
    }
  }

  out[2] = count;
};

const countChars = (fileName) => {
  const file = readFileSync(fileName, "utf8");
  let count = file.length;
  out[0] = count;
};

const FLAGS = {
  "-h": help,
  "-c": countBytes,
  "-l": countLines,
  "-w": countWords,
  "-m": countChars,
  all: (file) => {
    countLines(file);
    countWords(file);
    countBytes(file);
  },
};

const main = () => {
  if(args[0] === '-h'){
    FLAGS['-h']();
    return;
  }

  if (args.length === 2) {
    const flag = args[0];
    const file = args[1];
    FLAGS[flag](file);
    console.log(out.join(" "), file);
    return;
  }

  const file = args[0];
  FLAGS.all(file);
  console.log(out.join(" "), file);
};

main();
