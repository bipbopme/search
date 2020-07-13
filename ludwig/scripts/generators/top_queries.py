import csv
from string import Template
import re

statements = [
  Template("$query,websearch,$query_slots")
]

with open('queries.txt') as input_csv:
  reader = csv.reader(input_csv, delimiter=',')
  
  with open('intents.csv', 'w') as output_csv:
    words_regex = re.compile(r'Hilltop', re.IGNORECASE)

    for row in reader:
      for statement in statements:
        query = row[0]
        query_slots = re.sub(r'[^ ]+', 'O', query)

        print(query)
        print(query_slots)

        output_csv.write(statement.substitute(query=query, query_slots=query_slots) + '\n')