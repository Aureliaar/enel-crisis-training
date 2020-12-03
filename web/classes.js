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
        this.modpersec = -1;
        this.status = squadStatus.DEPLOYING;

    }
    destroy() {
        globalMod += this.mod;
        const index = squadInstances.indexOf(this);
        if (index > -1) {
            squadInstances.splice(index, 1);
        }
        clearInterval(this.timer);
    }

    update(delta_time) {
        this.time += delta_time;

        if (this.time >= this.activationDelay && this.time < this.activationDelay + this.maxDuration) {
            this.status = squadStatus.DEPLOYED;
        }
        if (this.time >= (this.activationDelay + this.maxDuration)) {
            this.status = squadStatus.RESTING;
        }

        if (this.time >= (this.activationDelay + this.maxDuration + this.restingDuration)) {
            this.destroy()
        }
        if (this.status == squadStatus.DEPLOYED) {
            this.mod += this.modpersec * delta_time * calcSquadOvercrowdMod();
        }

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