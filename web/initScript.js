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
            aspectRatio: 1.38,
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
        currentX += delta * 56.5 / totalSeconds ; 
        if (currentX > 54) {return;}
        SecondsOnPage += delta;
        for (i=0; i<graphScatterValues.length; i++){
            myChart.data.datasets[0].data[i] = graphScatterValues[i];
        }
    
        myChart.update();
    }, 50)
}

function simulatedTimeString(){
    hours = Math.floor(realToSimulatedTime(SecondsOnPage)/60);
    minutes = realToSimulatedTime(SecondsOnPage)%60;
    return hours.toFixed(0) + 'h ' + minutes.toFixed(0)  + 'm ';
}
function updateCounters(){
    updateCat("Squads", squadInstances, maxSquads);
    updateCat("TaskForces", taskForceInstances, maxTaskForces);
    updateCat("Generators", generatorInstances, maxGenerators);

    //document.getElementById("currentMod").innerHTML = calcTotalMod();
    document.getElementById("weatherStatus").innerHTML = WeatherInstance.status;

    
    document.getElementById("timer").innerHTML = simulatedTimeString()
    let squads = (squadInstances.filter(squad => squad.status == squadStatus.DEPLOYED)).length;
    let tasks  = (taskForceInstances.filter(squad => squad.status == squadStatus.DEPLOYED)).length;
    let squadLoadFactor = ((squads+tasks)) / Math.ceil(calcLineeGuaste());
    document.getElementById("lineeGuaste").innerHTML = squadLoadFactor.toFixed(2) +"    ("+ calcLineeGuaste().toFixed(0) + " Lines)";
    updateBars("time", "", SecondsOnPage, 960);
    updateBars("faultyLines", "", calcLineeGuaste().toFixed(0),120);

}
function updateCrisisImage(crisis){
    console.log("assets/Enel_Illustration_crisisL{0}.png".replace("{0}", crisis));
    document.getElementById("crisisImg").src = "assets/Enel_Illustration_crisisL{0}.png".replace("{0}", crisis);

}
function updateWeatherImage(weather){
    document.getElementById("weatherImg").src = "assets/Enel_Illustration_weather_catastrophic.png".replace("catastrophic", weather);
}
function updateCat(category, instances, max){
    document.getElementById("ready"+category).innerHTML = max - instances.length;
    document.getElementById("deploying"+category).innerHTML = (instances.filter(squad => squad.status == squadStatus.DEPLOYING)).length;
    document.getElementById("deployed"+category).innerHTML = (instances.filter(squad => squad.status == squadStatus.DEPLOYED)).length;
    if(document.getElementById("resting"+category)){
        document.getElementById("resting"+category).innerHTML = (instances.filter(squad => squad.status == squadStatus.RESTING)).length;
        updateBars("resting", category, instances.filter(squad => squad.status == squadStatus.RESTING).length, max);
    }
    updateBars("ready", category, max - instances.length, max);
    updateBars("deploying", category, instances.filter(squad => squad.status == squadStatus.DEPLOYING).length, max);
    updateBars("deployed", category, instances.filter(squad => squad.status == squadStatus.DEPLOYED).length, max);
    
}

function updateBars(status, cat, value, max){
    percentVal = ((value/max)*100);
    $('#'+status+cat+'Bar').attr('aria-valuenow', value).css('width', percentVal+"%");
    if(cat == "ready"){
        $('#'+status+cat+'Bar').removeClass("bg-warning");
        $('#'+status+cat+'Bar').removeClass("bg-danger");
        if (percentVal <= 50 && percentVal > 25){
            $('#'+status+cat+'Bar').addClass("bg-warning");
        } else if (percentVal <= 25){
            $('#'+status+cat+'Bar').addClass("bg-danger");
        }
    }
}

function updateButtonStatus(){
    // document.getElementById("level1Crisis").disabled = level1Crisis ;
    // document.getElementById("level2Crisis").disabled = !level1Crisis || level2Crisis;
    // document.getElementById("level3Crisis").disabled = !level2Crisis || emergency;
    document.getElementById("level1Crisis").disabled = level2Crisis || emergency ;
    document.getElementById("level2Crisis").disabled = emergency;
    document.getElementById("level3Crisis").disabled = emergency;
    
    document.getElementById("taskForce").disabled = !((level2Crisis == true || emergency == true) && squadInstances.length > 50 && taskForceInstances.length < maxTaskForces)
    document.getElementById("squad").disabled = squadInstances.length == maxSquads || SecondsOnPage < 60;
    document.getElementById("generator").disabled = generatorInstances.length == maxGenerators || squadInstances.length == maxSquads || SecondsOnPage < 60;
    
}
var WeatherInstance;
var SecondsOnPage = 0;
function initButtonsAndChart(){
    initChart();
    WeatherInstance = new Weather();
    setInterval(function(){
        updateCounters();
        updateButtonStatus();
    }, 66);
}