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

class Weather{
    constructor(defaultStatus) {
        this.status = defaultStatus;

    }
    setWithDelay(status, delay_in_minutes){
        setTimeout((new_status) => {
            this.status = status;
            console.log(this.status);
        }, delay_in_minutes * 60 * 1000, new_status)
    }
    getCurrentMod(){
        
    }

}

function calcModFor(array){
    var tempMod = 0;
    for (i=0; i<array.length; i++){
        console.log(tempMod + " - " + array[i].mod) ;
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
    var squadMod = calcModFor(squadInstances.filter(squad => squad.status == squadStatus.DEPLOYED));
    var genMod = calcModFor(generatorInstances.filter(generator => generator.status == squadStatus.DEPLOYED));
    var taskMod = calcModFor(taskForceInstances.filter(taskForce => taskForce.status == squadStatus.DEPLOYED));
    var hardcodedMod = calcModFor(hardcodedModInstances);
    return squadMod + genMod + taskMod + hardcodedMod + globalMod;
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


new SelfStoppingModifier(0, 6000, 30000);
setTimeout(() => {
    new SelfStoppingModifier(0, -3000, 30000);
}, 30000)

setTimeout(() => {
    new SelfStoppingModifier(0, 1000, 20000);
}, 780 * 1000)