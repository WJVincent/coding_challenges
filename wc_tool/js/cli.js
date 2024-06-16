#!/usr/bin/env node
const { readFileSync } = require("node:fs");
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
  console.log("");
  console.log('combine flags under a single "-"');
  console.log(
    'eg: "node_wc -wl filename.txt" will output lines and words from filename.txt',
  );
  console.log("");
  console.log("omit filename to read stdin");
  console.log('eg: "node_wc -wl" will output lines and words from stdin');
};

const countBytes = (fileName, isBuf) => {
  let file;

  if (isBuf) {
    file = fileName;
  } else {
    file = readFileSync(fileName);
  }

  out[3] = Buffer.byteLength(file);
};

const countLines = async (fileName, isBuf) => {
  let file;
  if (isBuf) {
    file = fileName.toString();
  } else {
    file = readFileSync(fileName, "utf8");
  }

  let count = 0;
  for (let i = 0; i < file.length; i++) {
    let char = file[i];
    if (char === "\n") {
      count++;
    }
  }
  out[1] = count;
};

const countWords = (fileName, isBuf) => {
  let file;
  if (isBuf) {
    file = fileName.toString();
  } else {
    file = readFileSync(fileName, "utf8");
  }
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

const countChars = (fileName, isBuf) => {
  if (isBuf) {
    out[0] = fileName.toString().length;
  } else {
    const file = readFileSync(fileName, "utf8");
    let count = file.length;
    out[0] = count;
  }
};

const FLAGS = {
  c: countBytes,
  l: countLines,
  w: countWords,
  m: countChars,
};

const noArgs = () => {
  const flags = ["l", "w", "c"];
  const buff = readFileSync("/dev/stdin");

  flags.forEach((flag) => {
    FLAGS[flag](buff, true);
  });

  console.log(`${out.join(" ")}`.trim());
};

const oneArg = () => {
    let arg = args[0];

    if (arg.startsWith("-")) {
      let flags = arg.split("").filter((el) => el !== "-");

      if (flags.includes("h")) {
        help();
      } else {
        flags.forEach((flag) => {
          FLAGS[flag]("/dev/stdin");
        });
        console.log(`${out.join(" ")}`.trim());
      }
    } else {
      const flags = ["l", "w", "c"];

      flags.forEach((flag) => {
        FLAGS[flag](arg);
      });

      console.log(`${out.join(" ")} ${arg}`.trim());
    }
}

const twoArgs = () => {
    let file = args.find((el) => !el.startsWith("-"));
    let flags = args
      .find((el) => el.startsWith("-"))
      .split("")
      .filter((el) => el !== "-");

    flags.forEach((flag) => {
      FLAGS[flag](file);
    });

    console.log(`${out.join(" ")} ${file}`.trim());
}

const main = () => {
  if (args.length === 0) {
    noArgs();
  } else if (args.length === 1) {
    oneArg();
  } else if (args.length === 2) {
    twoArgs();
  } else {
    throw Error("malformed command");
  }
};

main();
