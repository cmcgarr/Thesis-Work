const { ipcRenderer } = require('electron')

let lineChart
const LABELS = ["-11days", "-10days", "-9days", "-8days", "-7days", "-6days", "-5days", "-4days", "-3days", "-2days", "-1days", "Today"]

let datasets = [{
    label: "Positive",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Green'
},
{
    label: "Political",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Brown'
},
{
    label: "Negative",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Red'
},
{
    label: "Garda",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Blue'
},
{
    label: "Crime",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Black'
},
{
    label: "Strong",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Yellow'
},
{
    label: "Weak",
    data:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fill: false,
    borderColor: 'Grey'
}
]

$(document).ready(function($){
    drawChart()
})

function drawChart(){
    lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: LABELS,
            datasets: datasets
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
}

// get data sets w/ configurations
function updateData(sentJSON){
    datasets[0].data = getDataset(sentJSON, "Positiv")
    datasets[1].data = getDataset(sentJSON, "POLIT")
    datasets[2].data = getDataset(sentJSON, "Negativ")
    datasets[3].data = getDataset(sentJSON, "Garda")
    datasets[4].data = getDataset(sentJSON, "Crime")
    datasets[5].data = getDataset(sentJSON, "Strong")
    datasets[6].data = getDataset(sentJSON, "Weak")

    lineChart.data.datasets = datasets
    lineChart.update()
    return
}

function getDataset(sentJSON, category){
    var result = []
    for(var i = 0; i < 12; i++){
        result.push(sentJSON[i][category])
    }
    //we want to reverse the array so that current is last as the y axis moves from -12 to present
    return result.reverse()
}

// Hides line relating to clicked legend item
var toggleVisibleHandler = function(_, legendItem){
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    var meta = ci.getDatasetMeta(index);

    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

    // We hid a dataset ... rerender the chart
    ci.update();
}

//receives JSON object of 12 sentiment value dictionaries
//sends data on to chart updating functions
ipcRenderer.on('Datasets', (_, dataPkg) => {
    updateData(dataPkg);
})
