
const SENTIMENT_ADDRESS = "http://localhost:5000/sentiment/"
const HEADLINES_ADDRESS = "http://localhost:5000/headlines/"

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

function getColourValue(sentimentVal){}

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
}

//Description:
//input[0]:
//input[1]:
function main(type, date, time){
    url = createURL(type, date, time)

    $.getJSON(url, function (data){
        //update for when no articles published in that hour tf. no response
        //save values in session for access across windows
        updateStorage(data)
        updateArticles(data[1].noArticles)
        updateSentiment(data[1].positive)
    })
}
