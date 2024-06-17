#!/usr/bin/env python
import sys
import fileinput
args = sys.argv[1:]
out = [0,0,0,0]

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


def count_lines(file):
  count = 0
  for char in file.decode():
    if char == '\n':
      count += 1
  out[1] = count

def count_bytes(file):
  out[3] = len(file)

def count_words(file):
  is_whitespace = True 
  count = 0
  for char in file.decode():
    if char == ' ' or char == '\n' or char == '\r' or ord(char) == 9:
      is_whitespace = True
    elif char != ' ' and is_whitespace and char != '\n':
      is_whitespace = False
      count += 1
  out[2] = count


def count_chars(file):
  out[0] = len(file.decode())

FLAGS = {
  'c': count_bytes,
  'l': count_lines,
  'w': count_words,
  'm': count_chars,
}

def no_args():
  file = sys.stdin.buffer.read() # byte object 
  flags = ['l', 'w', 'c']
  for flag in flags:
    FLAGS[flag](file)

  lines = out[1]
  words = out[2]
  byte_num = out[3]
  print(f'{lines} {words} {byte_num}')


def one_arg():
  arg = args[0]
  if arg.startswith('-'):
    flags = list(filter(lambda x: x != '-', [*arg]))
    if 'h' in flags:
      help()
      return
    else:
      file = sys.stdin.buffer.read() # byte object 
      for flag in flags:
        FLAGS[flag](file)

      outStr = " ".join(str(x) for x in out if x != 0)
      print(f"{outStr}")
  else:
    file = open(arg, 'rb').read()
    for flag in ['l', 'w', 'c']:
      FLAGS[flag](file)
    outStr = " ".join(str(x) for x in out if x != 0)
    print(f"{outStr} {arg}")

def two_args():
  flags = next((x for x in args if x.startswith('-')), None)
  fileName = next((x for x in args if not x.startswith('-')), None) 
  file = None
  if fileName: 
    file = open(fileName, 'rb').read()
  
  if flags:
    split_flags = [*flags]
    flags = list(filter(lambda x: x != '-', split_flags))
    if file: 
      for flag in flags:
        FLAGS[flag](file)

    outStr = " ".join(str(x) for x in out if x != 0)
    print(f"{outStr} {fileName}")


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
