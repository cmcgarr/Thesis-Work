import csv
import json
import os.path

def csvToJSON(filename):
    # Open the CSV
    f = open(filename, 'rU' )
    # Change each fieldname to the appropriate field name. I know, so difficult.
    reader = csv.DictReader( f, fieldnames = ( "title", "date", "noArticles", "terms", "positive", "negative",\
                                                "active", "passive", "strong", "weak", "Econ@", "Polit", "Milit"))
    # Parse the CSV into JSON
    out = json.dumps( [ row for row in reader ] )
    print "JSON parsed!"
    # Save the JSON
    f = open( filename, 'w')
    f.write(out)
    return out

def main(filename):
    csvToJSON(filename)
    print "done"
