#!/usr/bin/env python
import sys
import fileinput
args = sys.argv[1:]
out = []

def help():
  print("python wc util");
  print("---- FLAGS ----");
  print("-h: help");
  print("-c: count bytes in file");
  print("-l: count lines in file");
  print("-w: count words in file");
  print("-m: count characters in file");
  print("");
  print('combine flags under a single "-"');
  print('eg: "py_wc -wl filename.txt" will output lines and words from filename.txt');
  print("");
  print("omit filename to read stdin");
  print('eg: "py_wc -wl" will output lines and words from stdin');


def count_bytes(file):
  pass

def count_lines(file):
  pass

def count_words(file):
  pass

def count_chars(file):
  pass

FLAGS = {
  'c': count_bytes,
  'l': count_lines,
  'w': count_words,
  'm': count_chars,
}

def no_args():
  file = fileinput.input()
  flags = ['l', 'w', 'c']
  for flag in flags:
    FLAGS[flag](file)


def one_arg():
  pass

def two_args():
  pass

def main():
  if len(args) == 0:
    no_args()
  elif len(args) == 1:
    one_arg()
  elif len(args) == 2:
    two_args()
  else:
    raise Exception("malformed command")

main()
