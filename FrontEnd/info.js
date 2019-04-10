const { ipcRenderer } = require('electron')

const LABELS = ["-11hr", "-10hr", "-9hr", "-8hr", "-7hr", "-6hr", "-5hr", "-4hr", "-4hr", "-2hr", "-1hr", "Now"]
const INTERVAL = 3000
let datasets = []
//12hrs worth of sentiment values
//to access: JSON_DATA[targetHR].relevantInfo
var JSON_DATA = [{
}]

$(document).ready(function($){
    drawChart()
})

function drawChart(){
    console.log(document.getElementById('lineChart'))

    var lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: LABELS,
            datasets: getDataSets()
        },
        options: {
        },
        legend: {
            display: true,
            labels: {
                fontSize: 12,
                onClick: toggleVisibleHandler,
            }
        },
    });
    //setInterval(updateDatasets, INTERVAL)
}

// get data sets w/ configurations
function getDataSets(){
    var sampleDataSets = [{
        label: "Positive",
        data:  [1, 2, 1.8, 3, 2.2, 2, -2, -1.5, -1, 3, -.5, .5],
        fill: false,
        borderColor: 'Green'
    },
    {
        label: "Political",
        data:  [1, 1.5, 1.3, 3, 2, 1.8, -2.2, 1.5, -.5, 2, -.2, -.8],
        fill: false,
        borderColor: 'Brown'
    },
    {
        label: "Negative",
        data:  [-1, -1.4, -2, -2.5, -1.8, 0, 1.8, 1.3, 1, -3, 1, 0],
        fill: false,
        borderColor: 'Red'
    },
    {
        label: "Garda",
        data:  [.5, 1, 0, .2, 1, -.6, -2, -1, 1, 3, -.5, .5],
        fill: false,
        borderColor: 'Blue'
    },
    {
        label: "Crime",
        data:  [.3, 1.1, 0, .2, .9, -.7, -2.2, -1.3, 1.1, 3.2, -.4, .7],
        fill: false,
        borderColor: 'Black'
    },
    {
        label: "Strong",
        data:  [.6, 1.5, -.1, -.5, 1, -.5, -1.8, -1, 1, 3, -.7, 1],
        fill: false,
        borderColor: 'Yellow'
    },
    {
        label: "Weak",
        data:  [-.6, -1, .5, .7, -1, 1, 2.2, 1, -1, -3.3, .7, 1],
        fill: false,
        borderColor: 'Grey'
    }
]
    return sampleDataSets
}

function parseDataSets(string){
    return
}

var toggleVisibleHandler = function(e, legendItem){
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    var meta = ci.getDatasetMeta(index);

    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

    // We hid a dataset ... rerender the chart
    ci.update();
}

ipcRenderer.on('Datasets', (event, dataPkg) => {
    console.log(dataPkg)
})
