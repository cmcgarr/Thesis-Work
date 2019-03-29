import csv
import json
import sys
import datetime
from pathlib import Path

DIR_PATH = Path.cwd().parents[0] / "Rocksteady" / "Data"
JSON_PATH = "JSON/JSON.json"
NULL_JSON =         {
        "Active": "0",
        "Articles": "0",
        "Crime": "0",
        "Date of First Article": "NO ENTRIES",
        "Econ@": "0",
        "Garda": "0",
        "Milit": "0",
        "Negativ": "0",
        "POLIT": "0",
        "Passive": "0",
        "Positiv": "0",
        "Strong": "0",
        "Terms": "0",
        "Title": "NO ENTRIES",
        "Weak": "0"
    } # For responding to queries with no results

# Get JSON data from CSV file
def csvToJSONString(filename):
    #Create filepath to csv
    filepath = DIR_PATH / filename
    # Open the CSV
    file = Path.open(filepath, 'r' )
    # Give appropriate fieldnames to dictionary
    reader = csv.DictReader(file)
    # Parse the CSV into JSON
    # the first element need not be transferred over after the original file has been created
    out = json.dumps( [ row for row in reader ], sort_keys=True, indent=4, )
    print("JSON parsed!")
    return out

# Input[0]: datetime object
# Input[1]: datetime.timedelta object indicating tolerance
# Output: json of valid sentiment values
def filterJSON(dateT, tolerance):
    print()
    file = open(JSON_PATH)
    input_dict = json.load(file)
    output_dict = [x for x in input_dict if compareDateTime(parseDateTime(x.get('Date of First Article')), dateT, tolerance) == True]

    if(len(output_dict) == 0):
        output_dict.append(NULL_JSON)

    output_json = json.dumps(output_dict, sort_keys=True, indent=4, )
    return output_json

# Description: compares two datetime.datetime object with a certain datetime.timedelta tolerance and returns a boolean
# Input[0]: datetime object
# Input[1]: datetime object
# Input[2]: time object indicating tolerance
def compareDateTime(dateTime1, dateTime2, tolerance):
    result = False
    if ((dateTime1 - dateTime2) <= tolerance and (dateTime2 - dateTime1) <= tolerance):
        result = True
    return result

# TO BE EXTENDED FOR STRETCH GOAL OF IMPLEMENTING HEADLINES
def parseHeadlines(data, time, tolerance):
    return

def createJSONPath(filename):
    return DIR_PATH / filename

# Check whether a sentiment element is contained in the content of a json doc. Returning True if element is contained in content
# Input[0]: sentiment value of form found in JSON doc
# Input[1]: content to be searched through
# Output: boolean value of True if element is found, and false otherwise
def contains(sentValue, content):
    i = 0
    length = len(content)
    result = False

    while(i < length and result == False):
        if(sentValue.get('Date of First Article') == content[i]['Date of First Article']):
            result = True
        i += 1

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

# Add new sentiment values to JSON file taking care not to duplicate
# Input[0]: single sentValue element of form found in JSON doc
# Input[1]: path of the file to be loaded/altered
def addToFile(sentValue, filepath):
    file = open(filepath)
    content = json.load(file)

    if(not contains(sentValue,content)):
        content.append(sentValue)

    out = json.dumps(content, sort_keys=True, indent=4, )
    writeToFile(out, filepath)
    return

# Description: writes given content to a given filepath location
# Input[0]: content to be written
# Input[1]: filepath to be written to
def writeToFile(content, filepath):
    file = open(filepath, "w")
    file.write(content)
    return

def appendJSON(jsonVar, filename):
    for i in range (len(jsonVar)):
        print("trying: " + jsonVar[i].get('Date of First Article'))
        addToFile(jsonVar[i], filename)
    return

def main():
    filename = sys.argv[1]
    jsonVar = csvToJSONString(filename)
    if(Path(JSON_PATH).exists()):
        jsonVar = json.loads(jsonVar)
        appendJSON(jsonVar, JSON_PATH)
    else:
        writeToFile(jsonVar, JSON_PATH)
    print("done")

if __name__ == '__main__':
  main()
