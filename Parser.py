import csv
import json
import sys
import datetime
from pathlib import Path

dirPath = Path.cwd().parents[0] / "Rocksteady" / "Data"
JSON_PATH = "JSON/JSON.json"

# Get JSON data from CSV file
def csvToJSON(filename):
    #Create filepath to csv
    filepath = dirPath / filename
    # Open the CSV
    file = Path.open(filepath, 'r' )
    # Give appropriate fieldnames to dictionary
    reader = csv.DictReader( file, fieldnames = ( "title", "date", "noArticles", "terms", "positive", "negative",\
                                                "active", "passive", "strong", "weak", "Econ@", "Polit", "Milit"))
    # Parse the CSV into JSON
    # the first element need not be transferred over after the original file has been created
    out = json.dumps( [ row for row in reader ], sort_keys=True, indent=4, )
    print("JSON parsed!")
    print(out)
    # Save the JSON ---> create filepath to where we want json stored, if we want the json stored
    writeToFile(out, JSON_PATH)
    return out

# Input[0]: datetime object
# Input[1]: time object indicating tolerance
# Output: json of valid sentiment values
def filterJSON(dateT, tolerance):
    input_dict = json.loads(JSON_PATH)
    output_dict = [x for x in input_dict if compareDateTime(parseDateTime(x['date']), dateT, tolerance) == 1]
    output_json = json.dumps(output_dict)
    return output_json

# Description: compares two datetime object with a certain tolerance and returns a boolean
# Input[0]: datetime object
# Input[1]: datetime object
# Input[2]: time object indicating tolerance
def compareDateTime(dateTime1, dateTime2, tolerance):
    return result

def parseHeadlines(data, time, tolerance):
    return

# Add new sentiment values to JSON file taking care not to overwright old ones
def addToFile():
    return

# JSON date: "year-mo-dyT24:60:60.000Z"
def parseDateTime(string):
    year = int(string[0:4])
    month = int(string[5:7])
    day = int(string[8:10])
    hour = int(string[11:13])
    minute = int(string[14:16])
    second = int(string[17:19])

    #create datetime object of given values
    dateT = datetime.datetime(year, month, day, hour, minute, second)
    return dateT

def writeToFile(content, filename):
    file = open(filename, "w")
    file.write(content)
    return

def main():
    csvToJSON(sys.argv[1])
    print("done")

if __name__ == '__main__':
  main()
