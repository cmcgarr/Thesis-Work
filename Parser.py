import csv
import json
import sys
import datetime
from pathlib import Path

DIR_PATH = Path.cwd().parents[0] / "Rocksteady" / "Data"
JSON_PATH = "JSON/JSON.json"

# Get JSON data from CSV file
def csvToJSON(filename):
    #Create filepath to csv
    filepath = DIR_PATH / filename
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
# Input[1]: datetime.timedelta object indicating tolerance
# Output: json of valid sentiment values
def filterJSON(dateT, tolerance):
    file = open(JSON_PATH)
    input_dict = json.loads(file)
    output_dict = [x for x in input_dict if compareDateTime(parseDateTime(x['date']), dateT, tolerance) == 1]
    output_json = json.dumps(output_dict)
    return output_json

# Description: compares two datetime.datetime object with a certain datetime.timedelta tolerance and returns a boolean
# Input[0]: datetime object
# Input[1]: datetime object
# Input[2]: time object indicating tolerance
def compareDateTime(dateTime1, dateTime2, tolerance):
    result = False
    if (datetime1 - datetime2) <= tolerance:
        result = True
    return result

# TODO
def parseHeadlines(data, time, tolerance):
    return

# Add new sentiment values to JSON file taking care not to duplicate
# Input[0]: single sentValue element of form found in JSON doc
# Input[1]: path of the tile to be loaded/altered
def addToFile(sentValue, filename):
    file = open(filename)
    content = json.loads(file)

    if(not contains(sentValue,file)):
        content.append(sentValue)

    writeToFile(content, filename)
    return


# Check whether a sentiment element is contained in the content of a json doc. Returning True if element is contained in content
# Input[0]: sentiment value of form found in JSON doc
# Input[1]: content to be searched through
# Output: boolean value of True if element is found, and false otherwise
def contains(sentValue, content):
    i = 0
    length = len(content)
    result = false

    while(i < length && result == false):
        if(sentValue['date'] == content[i]['date']):
            result = true
        i++

    return result

# Description: Parse string of a specific format to a datetime.datetime object
# Input[0]: Date and time as string of form "YYYY-MM-DDTHH:MM:SS.000Z"
# Output: datetime.datetime value created from given string
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

# Description: writes given content to a given filepath location
# Input[0]: content to be written
# Input[0]: location to be written to
def writeToFile(content, filename):
    file = open(filename, "w")
    file.write(content)
    return

def main():
    csvToJSON(sys.argv[1])
    print("done")

if __name__ == '__main__':
  main()
