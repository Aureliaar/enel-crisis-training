var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];
var xAxis = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45']
var graphValues = [639, 465, 493, 478, 589, 632, 674]
var curveMaxVal = 600

var chartData = {
    labels: xAxis,
    datasets: [
    {
        label: '# Clients disconnected (thousands)',
        data: graphValues,
        backgroundColor: 'transparent',
        borderColor: colors[0],
        borderWidth: 4,
        pointBackgroundColor: colors[0]
    }]
};
var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
setInterval(function(){
    if (graphValues.length == xAxis.length){
        graphValues.shift(); //removes the first element of the array
    }

    graphValues.push(Math.floor((Math.random() * curveMaxVal) + 1)) //add elem at the end of the array
    for (i=0; i<graphValues.length; i++){
        myChart.data.datasets[0].data[i] = graphValues[i];
    }

    myChart.update();
}, 600)

function buttonClick(){
    curveMaxVal = curveMaxVal-200
}