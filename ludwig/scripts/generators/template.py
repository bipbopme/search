#!/usr/bin/env python3
# This is a template for generating training data
# shuf -n 1000 giant.csv > tame.csv
import csv
from string import Template
import re

statements = [
  Template("weather in $city,weather,O O $city_slots"),
  Template("weather in $city $state,weather,O O $city_slots $state_slots"),
  Template("weather in $city today,weather,O O $city_slots B-When"),
  Template("weather in $city $state today,weather,O O $city_slots $state_slots B-When"),
  Template("weather in $city tomorrow,weather,O O $city_slots B-When"),
  Template("weather in $city $state tomorrow,weather,O O $city_slots $state_slots B-When"),
  Template("weather in $city next week,weather,O O $city_slots B-When B-When"),
  Template("weather in $city $state next week,weather,O O $city_slots $state_slots B-When B-When"),
  Template("weather in $city this weekend,weather,O O $city_slots B-When B-When"),
  Template("weather in $city $state this weekend,weather,O O $city_slots $state_slots B-When B-When"),
  Template("$city weather,weather,$city_slots O"),
  Template("$city $state weather,weather,$city_slots $state_slots O"),
  Template("$city weather today,weather,$city_slots O B-When"),
  Template("$city $state weather today,weather,$city_slots $state_slots O B-When"),
  Template("$city weather tomorrow,weather,$city_slots O B-When"),
  Template("$city $state weather tomorrow,weather,$city_slots $state_slots O B-When"),
  Template("$city weather next week,weather,$city_slots O B-When B-When"),
  Template("$city $state weather next week,weather,$city_slots $state_slots O B-When B-When"),
  Template("$city weather this weekend,weather,$city_slots O B-When B-When"),
  Template("$city $state weather this weekend,weather,$city_slots $state_slots O B-When B-When"),
]

with open('cities_tame.csv') as input_csv:
  reader = csv.reader(input_csv, delimiter=',')
  
  with open('intents.csv', 'w', newline='') as output_csv:
    words_regex = re.compile(r'Hilltop', re.IGNORECASE)

    for row in reader:
      for statement in statements:
        city = re.sub(r'[^A-Za-z0-9 ]', '', row[0])
        state = row[2]
        city_slots = re.sub(r'\w+', 'B-Place', city)
        state_slots = re.sub(r'\w+', 'B-Place', state)

        output_csv.write(statement.substitute(city=city, state=state, city_slots=city_slots, state_slots=state_slots) + "\n")