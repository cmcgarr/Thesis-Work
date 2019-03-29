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
        label: "My First Dataset",
        data:  [1, 2, 1.8, 3, 2.2, 2, -2, -1.5, -1, 3, -.5, .5],
        fill: false,
        borderColor: 'Green'
    }]
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
