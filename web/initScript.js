function initChart(){
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];
    var xAxis = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45']
    var graphValues = [639, 465, 493, 478, 589, 632, 674]
    var curveMaxVal = 600

    var chartData = {
        labels: xAxis,
        datasets: [
        {
            label: '# Clients disconnected',
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
            elements: {
                point:{
                  radius: 0
                }
              },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 180000,
                        min: 0,
                    }
                }]
            }
        }
    });
    setInterval(function(){
        if (graphValues.length == xAxis.length){
            graphValues.shift(); //removes the first element of the array
        }
    
        //graphValues.push(Math.floor((Math.random() * curveMaxVal) + 1)) //add elem at the end of the array
        graphValues.push(globalMod)
        for (i=0; i<graphValues.length; i++){
            myChart.data.datasets[0].data[i] = graphValues[i];
        }
    
        myChart.update();
    }, 600)
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
}

function updateButtonStatus(){
    document.getElementById("taskForce").disabled = true;
    if(level2Crisis== true && squadInstances.length > 50 && taskForceInstances.length < maxTaskForces){
        document.getElementById("taskForce").disabled = false;
    };
    if( squadInstances.length == maxSquads){
        document.getElementById("squad").disabled = true;
    };
    if(generatorInstances.length == maxGenerators){
        document.getElementById("generator").disabled = true;
    }
    
}

function initButtonsAndChart(){
    initChart();
    setInterval(function(){
        updateCounters();
        updateButtonStatus();
    }, 66);
}