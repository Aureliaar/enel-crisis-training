var maxSquads = 100; 
const maxGenerators = 30; 
const maxTaskForces = 30;
var level1Crisis = false;
var level2Crisis = false;
var emergency = false;
var squadInstances = [];
var generatorInstances = [];
var taskForceInstances = [];
var hardcodedModInstances = [];

var squadsUsed = 0;
var gensUsed = 0;
var taskForcesUsed = 0;
var crisis1time;
var crisis2time;
var crisis3time;

var globalMod = 0;

var timestamp;
var username;

const squadStatus = {
    DEPLOYING: "deploying",
    DEPLOYED: "deployed",
    RESTING: "resting",
}

const weather = {
    CATASTROPHIC: "Catastrophic",
    BAD: "Adverse",
    ACCEPTABLE: "Calm",
    PERFECT: "Optimal",
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
            addNews("Weather is now "+status);
            updateWeatherImage(status);
            this.status = status;
        }, delay_in_minutes * 5 * 1000 )
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
    if (SecondsOnPage < 30) { return SecondsOnPage * 4;}
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
    crisis1time = realToSimulatedTime(SecondsOnPage);
    updateCrisisImage(1);
    document.getElementById("crisisLevel").innerHTML = "Level 1 Emergency";
}

function declareLvl2Crisis(){
    level2Crisis = true;
    updateCrisisImage(2);

    crisis2time = realToSimulatedTime(SecondsOnPage);
    document.getElementById("crisisLevel").innerHTML = "Level 2 Emergency";
}

function declareEmergency(){
    emergency = true;
    updateCrisisImage(3);

    crisis3time = realToSimulatedTime(SecondsOnPage);
    
    sendEmptyCall();
    sendDataToKVStorage(timestamp, username);
    //sendDataToKVStorage('1607431558000', 'test2');
    document.getElementById("crisisLevel").innerHTML = "Crisis Status";
}



function createNewsItem(message){
    let li = document.createElement('li');
    let date = document.createElement('span');
    date.className = "date";
    newsDate = new Date();
    newsDate.setHours(realToSimulatedTime(SecondsOnPage) / 60);
    newsDate.setMinutes(realToSimulatedTime(SecondsOnPage) % 60);
    date.textContent = newsDate.getHours() +"h, " + newsDate.getMinutes() + "m";
    let news = document.createElement('span');
    news.className = "activity-text";
    news.textContent = message;
    li.className = "feed-item";
    li.appendChild(date);
    li.appendChild(news);
    return li;
}

function addNews(message){
    const newsList = document.querySelector('#newsFeed');
    newsList.appendChild(createNewsItem(message));
}

function realToSimulatedTime(seconds){
    let first_minute = Math.min(seconds, 60);
    let other = Math.max(0, seconds-60);
    return first_minute + other * 4;

}
setTimeout(() => {
addNews("Welcome, Crisis Manager. ");
addNews("A major storm is causing damage across the continent. ");
addNews("Use the company's resources to mitigate it!");
addNews("Watch this space for further information on what is happening in the area");

}, 500)

new SelfStoppingModifier(0, 5800, 30000);
setTimeout(() => {
    new SelfStoppingModifier(0, -2900, 30000);
    addNews("AUTOMATIC RESPONSES ACTIVATING");
}, 31000)
setTimeout(() => {
    addNews("REMOTE CONTROLS ENGAGED");
    addNews("Squads and Generators are now available");
}, 61000)
setTimeout(() => {
    new SelfStoppingModifier(0, 1000, 20000);
    addNews("The supply lines are stretched, and failure is cascading throughout the system!");

}, 420 * 1000)
setTimeout(() => {
    addNews("Your shift is over. Please report to your superior with the following results: ");
    addNews("CLIENTS STILL DISCONNECTED: "+calcTotalMod());
    addNews("Squads used: " + (squadsUsed + taskForcesUsed));
    addNews("Generators used: "+ gensUsed);
    addNews("Crisis level 1 declaration time: "+crisis1time);
    addNews("Crisis level 2 declaration time: "+crisis2time);
    addNews("Emergency State declaration time: "+crisis3time);



}, 16 * 60 * 1000)
new NoiseMod(0);

function sendDataToKVStorage(timestamp, username ){
    var value = {
        timestamp: timestamp,
        username: username,
        clientsDisconnected: calcTotalMod(),
        crisis1time: crisis1time,
        crisis2time: crisis2time,
        crisis3time: crisis3time,

    };
    console.log("sending data"+value);
    
    // /waitinglist_" + value.email

    // $.post("https://kvdb.io/BNQgP2ny19BJkNZYTe1h7m/game", JSON.stringify(value))
    // $.post("https://kvdb.io/BNQgP2ny19BJkNZYTe1h7m/game_"+timestamp, JSON.stringify(value))
    $.post("https://kvdb.io/BNQgP2ny19BJkNZYTe1h7m/game_"+timestamp+"_"+username, JSON.stringify(value))
        .done(function() {
            alert('Thank you');
        });

}

function sendEmptyCall(){
    var value = {};
    $.post("https://kvdb.io/BNQgP2ny19BJkNZYTe1h7m/game_"+timestamp, JSON.stringify(value));
}