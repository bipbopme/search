#!/usr/bin/env python3
# This is a template for generating training data
# shuf -n 1000 giant.csv > tame.csv
import csv
from string import Template
import re

statements = [
  Template("what is the definition of $word,define,O O O O O B-Word"),
  Template("what's the definition of $word,define,O O O O B-Word"),
  Template("define $word,define,O B-Word"),
  Template("$word definition,define,B-Word O"),
  Template("what does $word mean,define,O O B-Word O")
]

with open('cities_tame.csv') as input_csv:
  reader = csv.reader(input_csv, delimiter=',')
  
  with open('intents.csv', 'w', newline='') as output_csv:
    words_regex = re.compile(r'Hilltop', re.IGNORECASE)

    for row in reader:
      for statement in statements:
        output_csv.write(statement.substitute(word=row[0] + "\n")