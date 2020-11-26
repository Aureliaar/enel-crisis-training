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
var squadInstances = []
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
        console.log(this.time + " " + this.activationDelay);

        if (this.time >= this.activationDelay){
            this.status = squadStatus.DEPLOYED
        }
        
        // if (!this.isInCooldown()){
        if (this.status == squadStatus.DEPLOYED){
            console.log("am doing stuff");
            this.mod += this.modpersec * delta_time;
        }
        if (this.time >= this.activationDelay+this.maxDuration){
            console.log("going to bed");
            this.status = squadStatus.RESTING
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
      //so this thing activates, remains active for a while and then gets disabled (after 1 sec atm)
    constructor(mod, buttonref) {
        super(mod, buttonref);
    }
    click(){
        super.click();
        this.buttonref.disabled=true
    }
}

class TaskForce extends Squad{
    constructor(mod, buttonref) {
        super(mod, buttonref);
        this.buttonref.disabled=true
        setTimeout(() => {
            this.buttonref.disabled=false
        }, 5000)
    }
}

function initChart(){
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];
    var xAxis = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45']
    var graphValues = [639, 465, 493, 478, 589, 632, 674]
    var curveMaxVal = 600

    var chartData = {
        labels: xAxis,
        datasets: [
        {
            label: '# Clients disconnected (thousands)',
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
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    setInterval(function(){
        if (graphValues.length == xAxis.length){
            graphValues.shift(); //removes the first element of the array
        }
    
        graphValues.push(Math.floor((Math.random() * curveMaxVal) + 1)) //add elem at the end of the array
        for (i=0; i<graphValues.length; i++){
            myChart.data.datasets[0].data[i] = graphValues[i];
        }
    
        myChart.update();
    }, 600)
}

function initButtonsAndChart(){
    initChart();
    //initButton("button1");
    //initGruppoElettrogeno("button2");
    initTaskForce("button3");
}

function initButton(buttonId){
    console.log(document.getElementById(buttonId));
    clickable = new Squad( 0, document.getElementById(buttonId));
    console.log(clickable.isClickable());
}

function sendSquad(buttonId){
    clickable = new Squad( 0, document.getElementById(buttonId));
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


