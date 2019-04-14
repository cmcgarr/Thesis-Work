const { ipcRenderer } = require('electron')

const SENTIMENT_ADDRESS = "http://localhost:5000/sentiment/"
const HEADLINES_ADDRESS = "http://localhost:5000/headlines/"
const STEP_SIZE = 85
const TOLERANCE = 0  //Minutes away from given datetime a sentiment element can be and still be considered relevant to query
const INTERVAL = 3000 //Miliseconds between fetching of next data element to simulate the passage of time
const FIRST_SENTIMENT_POSITION = 0

//Starting date and time for demo/testing purposes
// (year, month, day, hour, min, sec, ms)
var dateTime = new Date(2019, 01, 23, 0, 0, 0, 0)
NULL_JSON =         [{
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
    }] // For responding to queries with no results

//Description: Create URL of the form http://localhost:5000/sentiment/2019:02:05T12:00:00.000Z/720
//currently of the form: http://localhost:5000/sentiment/2019:2:2T0:20:0.000Z/30
//input[0]: the type of data to be fetched - "sentiment" or "headlines" string
//input[1]: the datetime string
//input[2]: int tolerance value in mins
function createURL(type, date, time, tolerance){
    var url = ""
    switch(type){
        case "sentiment":
            url = SENTIMENT_ADDRESS
            break;
        case "headlines":
            url = HEADLINES_ADDRESS
            break;
        default:
            break;
    }
    var datetime = createDateTimeString(date, time)
    url = url + datetime + "/" + tolerance
    return url
}

//Description: Create datetime string of the form YYYY:MM:DDT24:60:60.000Z
//currently of the form: 2019:2:2T0:20:0.000Z
//input[0]: array of [year, month, day]
//input[1]: array of [hour, minute, second]
function createDateTimeString(date, time){
    var result = ""
    result = pad(date[0]) + ":" + pad(date[1]) + ":" + pad(date[2]) + "T" + pad(time[0]) + ":" + pad(time[1]) + ":" + pad(time[2]) + ".000Z"
    console.log("DateTimeString: " + result)
    return result
}

// pads number to string with two digits, the first being a leading zero if necessary
function pad(number){
    var result
    if(number < 10){
        result = "0" + number
    }
    else{
        result = number
    }
    return result
}

function getColourValue(sentimentVal){
    var red = 255
    var green = 0
    //assuming an upper and lower bound of +3/-3 for z-score
    //outside this bound just take the highest/lowest colour value
    normalised = sentimentVal + 3
    green = normalised * STEP_SIZE

    if (green > 255){
        red = red - (green - 255)
        green = 255
    }
    if (green < 0){
        green = 0
    }
    var result = "rgb(" + red + "," + green + ",0)"
    console.log("Resulting RGB: " + result)
    return result
}

// Consider combining updateArticles and updateSentiment into one function
function updateArticles(noArticles){
    var json = sessionStorage.getItem('previous0')
    var previousValue
    console.log(json)
    //Handle case where no previous data has been stored and null is returned
    if (json !== null){
        json = JSON.parse(json)
        previousValue = parseInt(json[FIRST_SENTIMENT_POSITION].Articles)
    }
    else{
        previousValue = 0
    }
    var change = noArticles - previousValue
    console.log("change type: " + typeof change + " value: " + change)
    if (change >= 0) {
      change = `+${change}`
    }
    $("#article-value").text(noArticles)
    $("#article-change").text(change)
}

function updateSentiment(sentimentVal){
    var previousValue
    var json = sessionStorage.getItem('previous0')
    var colour = getColourValue(sentimentVal)

    $('.sentiment').css('background-color', colour);
    $('.sentiment small').css('background-color', colour);

    //Handle case where no previous data has been stored and null is returned
    if (json !== null){
        json = JSON.parse(json)
        previousValue = parseFloat(json[FIRST_SENTIMENT_POSITION].Positiv)
    }
    else{
        previousValue = 0
    }

    var change = Math.round((sentimentVal - previousValue) * 100) / 100
    sentimentVal = Math.round((sentimentVal) * 100) / 100

    if (change >= 0) {
      change = `+${change}`
    }
    $("#sentiment-value").text(sentimentVal)
    $("#sentiment-change").text(change)
  }

//Description:
//input[0]:
//input[1]:
//input[2]:
//input[3]:
function execute(type, date, time, tolerance){
    url = createURL(type, date, time, tolerance)
    $.getJSON(url, function (data){
        //update for when no articles published in that hour tf. no response
        //save values in session for access across windows
        json = JSON.parse(data)
        console.log("No. Articles: " + json[FIRST_SENTIMENT_POSITION].Articles)
        updateStorage(data)
        updateArticles(parseInt(json[FIRST_SENTIMENT_POSITION].Articles))
        updateSentiment(parseFloat(json[FIRST_SENTIMENT_POSITION].Positiv))
    })
 }

jQuery(document).ready(function($){
    //code to executed when the DOM has loaded
    initialiseSessionStorage()
    execute("sentiment", [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay()], [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()], TOLERANCE)
    $('#infoBtn').click(function(){
        ipcRenderer.send('infoClick', 'Clicked')
        //window.setInterval(function(){
        //    ipcRenderer.send('Datasets', getDatasets())
        //}, INTERVAL)
    })
})

//wait to receive ID of window to send Datasets to
ipcRenderer.on('childID', (_, winId) => {
    window.setInterval(function(){
        ipcRenderer.sendTo(winId, 'Datasets', getDataSets())
    }, INTERVAL)
})

// REVIEW -----------------------------------------------------------
//Description:
//Output[0]: Dataset of last 12 hrs worth of sentiment values
function getDataSets(){
    var datasets = JSON.parse(sessionStorage.getItem('current'))

    for(var i = 0; i <= 10; i++){
        var target = 'previous' + i
        var sentVal = sessionStorage.getItem(target)
        console.log("inital sent value: " + sentVal)
        if(sentVal == null || sentVal == 'null'){
            console.log("null sentVal detected")
            sentVal = NULL_JSON
        } else { sentVal = JSON.parse(sentVal)}
        //JSON is a list of dictionaries. Here we push the first relevant dicitionary to the datasets
        console.log("Sentiment value: " + sentVal)
        datasets.push(sentVal[FIRST_SENTIMENT_POSITION])
    }
    return datasets
}

//Holds the last 12 sentiment values as strings (as that is what they are initially received as and initial code was built around)
//previous will get a value of null for the first execution -- HANDLE
function updateStorage(next){
    var previous
    // Move each stored sentiment value back one place
    for (var i = 9; i >= 0; i--){
        var target = 'previous' + i
        previous = sessionStorage.getItem(target)
        target = 'previous' + (i+1)
        sessionStorage.setItem(target, previous)
    }
    previous = sessionStorage.getItem('current')
    sessionStorage.setItem('previous0', previous)
    sessionStorage.setItem('current', next)
}

// initialise local storage with Stringified NULL_JSON entries so no null values
  function initialiseSessionStorage(){
      var filler = JSON.stringify(NULL_JSON)
      for (var i = 10; i >= 0; i--){
          var target = 'previous' + i
          target =  'previous' + (i+1)
          sessionStorage.setItem(target, filler)
      }
      sessionStorage.setItem('current', filler)
  }


//execute this function every interval
window.setInterval(function(){
    var date = dateTime.getDate() + 1
    dateTime.setDate(date)
    execute("sentiment", [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()], [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()], TOLERANCE)
}, INTERVAL);
