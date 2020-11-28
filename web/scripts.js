class Modifier {
    constructor(mod) {
        let that = this;
        this.mod = mod;
        this.time = 0;
    }
    update(delta_time){
        this.time = this.time + delta_time;

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

const maxSquads = 100; 
var level1Crisis = false;
var level2Crisis = false;
var squadInstances = []
var generatorInstances = []
var taskForceInstances = []


var globalMod = 0;

const squadStatus = {
    DEPLOYING: "deploying",
    DEPLOYED: "deployed",
    RESTING: "resting",
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
        squadInstances.push(this);
        setInterval(() => {
            this.update(0.066);
        }, 66)
    }
    update(delta_time){
        if (!this.clicked) return;
        this.time += delta_time;

        if (this.time >= this.activationDelay){
            this.status = squadStatus.DEPLOYED;
        }
        
        // if (!this.isInCooldown()){
        if (this.status == squadStatus.DEPLOYED){
            console.log("am doing stuff");
            this.mod += this.modpersec * delta_time;
        }
        if (this.time >= (this.activationDelay+this.maxDuration)){
            console.log("going to bed");
            this.status = squadStatus.RESTING;
        }
        if (this.time >= (this.activationDelay+this.maxDuration+this.restingDuration) ){
            console.log("Back to ready");
            globalMod += this.mod;
            
            const index = squadInstances.indexOf(this);
            if (index > -1) {
                squadInstances.splice(index, 1);
            }
            // TODO: actually delete this object, somehow, since in this shitty lang you can't
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
    }
    click(){
        super.click();
        this.buttonref.disabled=true
    }
}

class TaskForce extends Squad{
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.activationDelay = 120;
    }
}

function calcModFor(array){
    var tempMod = 0;
    for (var squad in array){
        tempMod += squad.mod;
    }
    return tempMod;
}

function calcTotalMod(){
    var totalMod = 0;
    var squadMod = calcModFor(squadInstances);
    var genMod = calcModFor(generatorInstances);
    var taskMod = calcModFor(taskForceInstances);
    return squadMod + genMod + taskMod + globalMod;
}

function initButton(buttonId){
    console.log(document.getElementById(buttonId));
    clickable = new Squad( 0, document.getElementById(buttonId));
    console.log(clickable.isClickable());
}

function sendSquad(buttonId){
    clickable = new Squad( 100, document.getElementById(buttonId));
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

// initButtons(function(){
//     //curveMaxVal = curveMaxVal-200;
//     console.log(document.getElementById("button1"));
//     clickable = new ClickableModifier( 0, document.getElementById("button1"));
//     //document.getElementById("button2").classList.add('Squad');
// })
function declareLvl1Crisis(){
    level1Crisis = true;
}

function declareLvl2Crisis(){
    level2Crisis = true;
}
