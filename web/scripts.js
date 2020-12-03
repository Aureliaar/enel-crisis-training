class Modifier {
    constructor(mod) {
        let that = this;
        this.mod = mod;
        this.time = 0;
        this.lastUpdateStamp = Date.now();
        this.timer = setInterval(() => {
            this.tick()
        }, 330)
    }
    tick(){
        let now = Date.now();
        let delta =  now - this.lastUpdateStamp;
        this.update(delta / 1000);
        this.lastUpdateStamp = now;
    }
    update(delta_time){
        this.time = this.time + delta_time;

    }

} 

class SelfStoppingModifier extends Modifier{
    constructor(base_mod, mod_per_sec, duration) {
        super(base_mod);
        this.mod_per_sec = mod_per_sec;
        hardcodedModInstances.push(this);
        
        setTimeout(() => {
            clearInterval(this.timer);

        }, duration)
    }
    update(delta_time){
        console.log(this.mod_per_sec);
        this.mod += this.mod_per_sec * delta_time;
    }
}

class ClickableModifier extends Modifier {
    
constructor(mod, buttonref) {
    super(mod);
    let that = this;

    this.mod = mod;
    this.buttonref = buttonref
    this.time = 0;
    this.clicked = false;
    buttonref.addEventListener('click', ()=>{ 
        this.click();
    })
        
    }
    click(){
        console.log("click event");

        //if(this.isClickable){
            this.clicked = true;
        //}
    };
    isClickable() {return true;}
}

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
class Squad extends ClickableModifier {
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.mod = mod;
        this.time = 0;
        this.activationDelay = Math.random() * (30 - 15) + 15;  //Random integer between 15 and 30
        this.maxCooldown = 120;
        // this.maxDuration = 60;
        this.maxDuration = 120;
        this.restingDuration = 150;
        this.modpersec = -1;
        this.status = squadStatus.DEPLOYING;

    }
    update(delta_time){
        this.time += delta_time;

        if (this.time >= this.activationDelay){
            this.status = squadStatus.DEPLOYED;
        }
        
        // if (!this.isInCooldown()){
        if (this.status == squadStatus.DEPLOYED){
            this.mod += this.modpersec * delta_time * calcSquadOvercrowdMod();
        }
        if (this.time >= (this.activationDelay+this.maxDuration)){
            globalMod += this.mod;
            this.status = squadStatus.RESTING;
        }
        if (this.time >= (this.activationDelay+this.maxDuration+this.restingDuration) ){
            
            const index = squadInstances.indexOf(this);
            if (index > -1) {
                squadInstances.splice(index, 1);
            }
            clearInterval(this.timer);
        }

    }
    isInCooldown(){
        let total = this.maxCooldown + this.maxDuration;
        let t = this.time%total;
        if (t<=this.maxDuration){
            return false;
        }        
        return true;
    }
    isClickable(){
        console.log(this.isInCooldown());
        return this.isInCooldown();
    }
}

class GruppoElettrogeno extends ClickableModifier{
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.activationDelay = Math.random() * (60 - 30) + 30;  //Random integer between 30 and 60
        this.modpersec = -100;
        this.status = squadStatus.DEPLOYING;
        setInterval(() => {
            this.update(0.066);
        }, 66)
    }
    update(delta_time){
        this.time += delta_time;

        if (this.time >= this.activationDelay){
            this.status = squadStatus.DEPLOYED;
        }
        
        if (this.status == squadStatus.DEPLOYED){
            console.log("am doing stuff");
            this.mod += this.modpersec * delta_time  * calcSquadOvercrowdMod();;
        }
    }
}

class TaskForce extends Squad{
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.activationDelay = 120;
    }
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