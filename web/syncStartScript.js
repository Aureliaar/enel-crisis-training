
// test: /index.html?h=11&m=3&s=0

const params = new URLSearchParams(document.location.search);
const paramUtcDate = params.get("utcDate");
// const hParam = params.get("h");
// const mParam = params.get("m");
// const sParam = params.get("s");

var intervalId = window.setInterval(checkTime, 500);
var username

function checkTime() {

    var date = new Date();
    console.log(date);
    var utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    // var h = d.getHours();
    // var m = d.getMinutes();
    // var s = d.getSeconds();

    //if(h == hParam && m == mParam && s == sParam) return window.location='game.html';
    //var utcDateToDate = new Date;
    document.getElementById("missingMinutes").innerHTML =  Math.floor((paramUtcDate - utcDate) / 60000);
    document.getElementById("missingSeconds").innerHTML =  (((paramUtcDate - utcDate) % 60000) / 1000).toFixed(0);
    
    if(paramUtcDate<= utcDate ){return window.location='game.html?timestamp=' + paramUtcDate + "&username=" + username}; 
}

function setUsername(){
    username = document.getElementById("inputUsername").value;
}
