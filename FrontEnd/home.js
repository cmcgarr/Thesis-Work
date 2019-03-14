
const SENTIMENT_ADDRESS = "http://localhost:5000/sentiment/"
const HEADLINES_ADDRESS = "http://localhost:5000/headlines/"
const STEP_SIZE = 85
const TOLERANCE = 30
const INTERVAL = 3000 //Miliseconds between hour progression

var dateTime = new Date(2019, 02, 05, 0, 20, 0, 0)

//Desription:
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
//input[0]: array of [year, month, day]
//input[1]: array of [hour, minute, second]
function createDateTimeString(date, time){
    var result = ""

    result = date[0] + ":" + date[1] + ":" + date[2] + "T" + time[0] + ":" + time[1] + ":" + time[2] + ".000Z"

    return result
}

function updateStorage(new){
    var previous = sessionStorage.getItem('current')
    sessionStorage.setItem('previous', previous)
    sessionStorage.setItem('current', new)
}

function getColourValue(sentimentVal){
    var red = 255
    var green = 0
    //TODO -- UNDERFLOW AND OVERFLOW
    //normalise to result is always positive
    //assuming an upper and lower bound of +3/-3 for z-score
    //outside this bound just take the highesst/lowest value
    sentimentVal = sentimentVal + 3
    green = sentimentVal * STEP_SIZE
    if (green > 255){
        red = red - (green - 255)
        green = green - 255
    }
    if (green < 0){
        green = 0
    }
    return "rgb(" + red + "," + green + ",0)"
}

function updateArticles(noArticles){
    var previousValue = sessionStorage.getItem('previous')
    previousValue = previousValue[1].noArticles
    var change = noArticles - previousValue
    if (change >= 0) {
      change = `+${change}`
    }

    $("article-value").text(noArticles.toLocaleString())
    $("article-change").text(change)
}

function updateSentiment(sentimentVal){
    var colour = getColourValue(sentimentVal)
    $('.sentiment').css('background-color', colour);

    var previousValue = sessionStorage.getItem('previous')
    previousValue = previousValue[1].positive
    var change = sentimentVal - previousValue
    if (change >= 0) {
      change = `+${change}`
    }

    $("sentiment-value").text(sentimentVal.toLocaleString())
    $("sentiment-change").text(change)
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
        updateStorage(data)
        updateArticles(data[1].noArticles)
        updateSentiment(data[1].positive)
    })
 }

$(function(){
    //code to executed when the DOM has loaded
    execute("sentiment", [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay], [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()], TOLERANCE)
})

//execute this function every interval
window.setInterval(function(){
    var hours = dateTime.getHours() + 1
    dateTime.setHours(hours)
    execute("sentiment", [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay], [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()], TOLERANCE)
}, INTERVAL);
