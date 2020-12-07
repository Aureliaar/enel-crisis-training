var maxSquads = 100; 
const maxGenerators = 30; 
const maxTaskForces = 30;
var level1Crisis = false;
var level2Crisis = false;
var squadInstances = [];
var generatorInstances = [];
var taskForceInstances = [];
var hardcodedModInstances = [];


var globalMod = 0;

const squadStatus = {
    DEPLOYING: "deploying",
    DEPLOYED: "deployed",
    RESTING: "resting",
}

const weather = {
    CATASTROPHIC: "catastrophic",
    BAD: "bad",
    ACCEPTABLE: "acceptable",
    PERFECT: "perfect",
}

class Weather extends Modifier {
    constructor() {
        super(0);
        this.status = weather.CATASTROPHIC;
        this.setWithDelay(weather.ACCEPTABLE, 1.4);
        this.setWithDelay(weather.PERFECT, 4.1);
        this.setWithDelay(weather.CATASTROPHIC, 6.1);
        this.setWithDelay(weather.BAD, 8.1);
        this.setWithDelay(weather.ACCEPTABLE, 9.7);
        this.setWithDelay(weather.PERFECT, 12);
        this.setWithDelay(weather.CATASTROPHIC, 13);
        this.setWithDelay(weather.BAD, 14.6);
        this.setWithDelay(weather.PERFECT, 16.6);
        this.setWithDelay(weather.ACCEPTABLE, 19.1);
        this.setWithDelay(weather.PERFECT, 22.1);
        this.setWithDelay(weather.BAD, 24);

    }
    setWithDelay(status, delay_in_minutes) {
        setTimeout(() => {
            this.status = status;
            console.log(this.status);
        }, delay_in_minutes * 60 * 1000 )
    }
    getCurrentMod() {
        switch (this.status) {
            case weather.CATASTROPHIC: return 0;
            case weather.BAD: return 0.3;
            case weather.ACCEPTABLE: return 1;
            case weather.PERFECT: return 1.5;
        }
    }
    update(delta_time){
        let mult = 0;
        switch (this.status) {
            case weather.CATASTROPHIC: 
                mult = 100;
                break;
            case weather.BAD:
                mult = 20;
                break;
            case weather.ACCEPTABLE:
                mult = 5;
                break;                
        }
        this.mod += delta_time * mult;
    }

}

function calcModFor(array){
    var tempMod = 0;
    for (i=0; i<array.length; i++){
        tempMod += array[i].mod;
    }
    return tempMod;
}
function calcSquadOvercrowdMod(){
    var activeSquadsPerc = squadInstances.filter(squad => squad.status == squadStatus.DEPLOYED).length / maxSquads;
    return 1 - activeSquadsPerc;

}
function calcTotalMod(){
    var totalMod = 0;
    var squadMod = calcModFor(squadInstances);
    var genMod = calcModFor(generatorInstances.filter(generator => generator.status == squadStatus.DEPLOYED));
    var taskMod = calcModFor(taskForceInstances);
    var hardcodedMod = calcModFor(hardcodedModInstances);
    return squadMod + genMod + taskMod + hardcodedMod + globalMod + WeatherInstance.mod;
}

function calcLineeGuaste(){
    let totalMod = calcTotalMod() / 1000;
    if (totalMod > 110 ){
        return 110 + (totalMod - 110 ) / 7; 
    }
    if (totalMod > 100){
        return 100 + (totalMod - 100);
    }
    return (totalMod - 50 )  * (65 / 50);
}



function initButton(buttonId){
    console.log(document.getElementById(buttonId));
    clickable = new Squad( 1000, document.getElementById(buttonId));
    console.log(clickable.isClickable());
}

function sendSquad(buttonId){
    clickable = new Squad( 0, document.getElementById(buttonId));
    squadInstances.push(clickable);
}

function sendTaskForce(buttonId){
    clickable = new TaskForce( 0, document.getElementById(buttonId));
    taskForceInstances.push(clickable);
}

function sendGenerator(buttonId){
    clickable = new GruppoElettrogeno( -100, document.getElementById(buttonId));
    generatorInstances.push(clickable);
    maxSquads-=1
}

function initGruppoElettrogeno(buttonId){
    console.log(document.getElementById(buttonId));
    clickable = new GruppoElettrogeno( 0, document.getElementById(buttonId));
    console.log(clickable.isClickable());
}

function initTaskForce(buttonId){
    console.log(document.getElementById(buttonId));
    clickable = new TaskForce( 0, document.getElementById(buttonId));
}

function declareLvl1Crisis(){
    level1Crisis = true;
    document.getElementById("crisisLevel").innerHTML = "Emergency level 2";
}

function declareLvl2Crisis(){
    level2Crisis = true;
    document.getElementById("crisisLevel").innerHTML = "Critical Emergency";
}


new SelfStoppingModifier(0, 5800, 30000);
setTimeout(() => {
    new SelfStoppingModifier(0, -2900, 30000);
}, 30000)

setTimeout(() => {
    new SelfStoppingModifier(0, 1000, 20000);
}, 420 * 1000)

function createNewsItem(timer, message){
    let li = document.createElement('li');
    let date = document.createElement('span');
    date.className = "activity-text";
    if (timer != ""){
        date.textContent = timer;
    } else {
        date.textContent = document.getElementById("timer").innerHTML.valueOf();
    }
    let news = document.createElement('span');
    news.className = "activity-text";
    news.textContent = ' - ' + message;
    li.className = "feed-item";
    li.appendChild(date);
    li.appendChild(news);
    return li;
}

function addNews(timer, message){
    const newsList = document.querySelector('#newsFeed');
    newsList.appendChild(createNewsItem(timer, message));
}