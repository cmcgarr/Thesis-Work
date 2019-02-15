import csv
import json
import sys
from pathlib import Path

dirPath = Path.cwd().parents[0] / "Rocksteady" / "Data"

def csvToJSON(filename):
    # Create filepath to csv
    filepath = dirPath / filename
    # Open the CSV
    file = Path.open(filepath, 'r' )
    # Give appropriate fieldnames to dictionary
    reader = csv.DictReader( file, fieldnames = ( "title", "date", "noArticles", "terms", "positive", "negative",\
                                                "active", "passive", "strong", "weak", "Econ@", "Polit", "Milit"))
    # Parse the CSV into JSON
    out = json.dumps( [ row for row in reader ], sort_keys=True, indent=4, )
    print("JSON parsed!")
    print(out)
    # Save the JSON ---> create filepath to where we want json stored, if we want the json stored
    # f = open( filename, 'w')
    # f.write(out)
    return out

def main():
    csvToJSON(sys.argv[1])
    print("done")

if __name__ == '__main__':
  main()
