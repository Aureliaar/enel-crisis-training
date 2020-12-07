class Modifier {
    constructor(mod) {
        let that = this;
        this.mod = mod;
        this.time = 0;
        this.lastUpdateStamp = Date.now();
        this.timer = setInterval(() => {
            this.tick()
        }, 330)
        this.register_cost();
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
    register_cost(){}

} 

class NoiseMod extends Modifier {
    constructor(mod) {
        super(0);
        this.threshold = 10;
        this.modpersec = 1;
        this.timeToNextSwap = 1;
        this.timeScale = 1;
        hardcodedModInstances.push(this);
        setTimeout(() => {
            this.threshold = 10000;
            this.spike();
        }, 5000)
        setTimeout(() => {
            this.threshold = 2000;
            this.timeScale = 2;
            this.spike();
        }, 60000)


    }
    spike(){
        if (this.spikeCooldown > 0) {return;}
        this.modpersec = Math.sign(this.mod) * -1 * (0.5 + Math.random()/2) * this.threshold / this.timeScale;
        this.timeToNextSwap = 0.2 + Math.random() * this.timeScale;
        this.spikeCooldown = 0.5;
    }
    update(delta_time){
        if (Math.abs(this.mod) > this.threshold * this.timeToNextSwap ){
            this.spike()
        }
        this.mod += this.modpersec * delta_time;
        this.spikeCooldown -= delta_time;
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
    }
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
        this.modpersec = -2.5;
        this.status = squadStatus.DEPLOYING;
        this.name = "Squad";
        //addNews(this.name + " deployed");



    }
    register_cost(){
        squadsUsed += 1;
    }
    destroy() {
        //addNews(this.name +  "ready again");
        globalMod += this.mod;
        const index = squadInstances.indexOf(this);
        if (index > -1) {
            squadInstances.splice(index, 1);
        }   
        clearInterval(this.timer);
    }

    update(delta_time) {
        this.time += delta_time;

        if (this.status == squadStatus.DEPLOYING && this.time >= this.activationDelay && this.time < this.activationDelay + this.maxDuration) {
            //addNews(this.name + " deployed");
            this.status = squadStatus.DEPLOYED;
        }
        if (this.status == squadStatus.DEPLOYED && this.time >= (this.activationDelay + this.maxDuration)) {
            //addNews(this.name + " resting");
            this.status = squadStatus.RESTING;
        }

        if (this.time >= (this.activationDelay + this.maxDuration + this.restingDuration)) {
            this.destroy()
        }
        if (this.status == squadStatus.DEPLOYED) {
            this.mod += this.modpersec * delta_time * calcSquadOvercrowdMod() * WeatherInstance.getCurrentMod();
        }

    }

}


class GruppoElettrogeno extends ClickableModifier{
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.activationDelay = Math.random() * (60 - 30) + 30;  //Random integer between 30 and 60
        this.modpersec = 0;
        this.mod = Math.round(Math.random()) * 400 + 100;
        this.status = squadStatus.DEPLOYING;
        setInterval(() => {
            this.update(0.066);
        }, 66)
    }
    register_cost(){
        gensUsed += 1;
    }
    update(delta_time){
        this.time += delta_time;

        if (this.status == squadStatus.DEPLOYING && this.time >= this.activationDelay){
            this.status = squadStatus.DEPLOYED;
            //addNews("Generator Deployed");
        }
    }
}

class TaskForce extends Squad{
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.activationDelay = 120;
    }
    register_cost(){
        taskForcesUsed += 1;
    }
}