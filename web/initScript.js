function initChart(){
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];
    var xAxis = ['0','3', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33','36', '39', '42', '45', '48', "", "", "", ""]
    var graphValues = [639, 465, 493, 478, 589, 632, 674]//639, 465, 493, 478, 589, 632, 674
    var graphScatterValues =  [];
    var curveMaxVal = 600

    var chartData = {
            labels: xAxis,
            datasets: [
            {
                data: graphScatterValues,
                backgroundColor: 'transparent',
                
                borderColor: colors[0],
                showLine: true,
                //borderWidth: 4,
                pointBackgroundColor: colors[0],
                lineTension: 0.5,
            }]
        };
    var ctx = document.getElementById('myChart');

    var myChart = new Chart(ctx, {
        type: 'scatter',
        data: chartData,
        options: {
            elements: {
                point:{
                    radius: 0,
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 0,
                        beginAtZero: true,
                        max: 180000,
                        min: 0,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 0,
                        beginAtZero: true,
                        max: 60,
                        min: 0,
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
           }
        }
    });
    var currentX= 0
    var lastTimestamp = Date.now();
    setInterval(function(){
        if (graphValues.length == xAxis.length){
            graphValues.shift(); //removes the first element of the array
        };
        
        graphScatterValues.push({x: currentX, y: calcTotalMod()});
        let delta = (Date.now() - lastTimestamp) / 1000.0;
        lastTimestamp = Date.now();
        let totalSeconds = 15 * 60;
        currentX += delta * 50.0 / totalSeconds ; 
        //console.log(calcTotalMod());
        for (i=0; i<graphScatterValues.length; i++){
            myChart.data.datasets[0].data[i] = graphScatterValues[i];
        }
    
        myChart.update();
    }, 50)
}

function updateCounters(){
    document.getElementById("readySquads").innerHTML = maxSquads - squadInstances.length;
    document.getElementById("deployingSquads").innerHTML = (squadInstances.filter(squad => squad.status == squadStatus.DEPLOYING)).length;
    document.getElementById("deployedSquads").innerHTML = (squadInstances.filter(squad => squad.status == squadStatus.DEPLOYED)).length;
    document.getElementById("restingSquads").innerHTML = (squadInstances.filter(squad => squad.status == squadStatus.RESTING)).length;
    document.getElementById("readyTaskForces").innerHTML = maxTaskForces - taskForceInstances.length;
    document.getElementById("deployingTaskForces").innerHTML = (taskForceInstances.filter(taskForce => taskForce.status == squadStatus.DEPLOYING)).length;
    document.getElementById("deployedTaskForces").innerHTML = (taskForceInstances.filter(taskForce => taskForce.status == squadStatus.DEPLOYED)).length;
    document.getElementById("restingTaskForces").innerHTML = (taskForceInstances.filter(taskForce => taskForce.status == squadStatus.RESTING)).length;
    document.getElementById("readyGenerators").innerHTML = maxGenerators - generatorInstances.length;
    document.getElementById("deployingGenerators").innerHTML = (generatorInstances.filter(generator => generator.status == squadStatus.DEPLOYING)).length;
    document.getElementById("deployedGenerators").innerHTML = (generatorInstances.filter(generator => generator.status == squadStatus.DEPLOYED)).length;

    //document.getElementById("currentMod").innerHTML = calcTotalMod();
    document.getElementById("weatherStatus").innerHTML = WeatherInstance.status;
    document.getElementById("timer").innerHTML = Math.floor((SecondsOnPage/60)) + 'm ' + (SecondsOnPage % 60) + 's ';
}

function updateButtonStatus(){
    document.getElementById("level2Crisis").disabled = !level1Crisis;
    
    if(level2Crisis== true && squadInstances.length > 50 && taskForceInstances.length < maxTaskForces){
        document.getElementById("taskForce").disabled = false;
    };
    document.getElementById("squad").disabled = squadInstances.length == maxSquads;
    document.getElementById("generator").disabled = generatorInstances.length == maxGenerators;
    
}
function disableUnitButtons(){
    document.getElementById("generator").disabled = true;
    document.getElementById("squad").disabled = true;
    document.getElementById("taskForce").disabled = true;
};
function enableUnitButtons(){
    document.getElementById("generator").disabled = false;
    document.getElementById("squad").disabled = false;
};
var WeatherInstance;
var SecondsOnPage = 0;
function initButtonsAndChart(){
    initChart();
    disableUnitButtons();
    WeatherInstance = new Weather();
    setInterval(function(){
        updateCounters();
        updateButtonStatus();
    }, 66);
    setInterval(function(){
        SecondsOnPage += 1
    }, 1000);
    setTimeout(function(){
        enableUnitButtons();
    }, 60000);
}