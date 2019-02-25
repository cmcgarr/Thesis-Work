from flask import Flask
from flask import jsonify
import Parser
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return 'Home'

# Description: Should return headlines of articles published within the given date and time
@app.route('/headlines/', defaults={'tolerance': None, 'datetime': None})
@app.route('/headlines/<datetime>', defaults={'tolerance': None})
@app.route('/headlines/<datetime>/<tolerance>')
def headlinesDT(datetime, tolerance):
    if (tolerance == None or datetime == None):
        result = "Invalid parameters provided"
    else:
        result = 'Not yet implemented for params: ' + datetime + " " + tolerance
    return result

# Description: Take variables datetime and tolerance from URL and return JSON of sentiment values within that timeframe
# Input[0]: datetime - of the form YYYY-MM-DDTHH:MM:SS.000Z
# Input[1]: tolerance - timedelta value of number of minutes away from given datetime a value can be
# Output[0]: returns JSON of all valid sentiment values
@app.route('/sentiment/<dateT>/<int:tolerance>')
def sentiment(dateT, tolerance):
    tol = datetime.timedelta(minutes = tolerance)
    dateT = Parser.parseDateTime(dateT)
    result = Parser.filterJSON(dateT, tol)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug = True)
