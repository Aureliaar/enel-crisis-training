
// test: /index.html?h=11&m=3&s=0

const params = new URLSearchParams(document.location.search);
const hParam = params.get("h");
const mParam = params.get("m");
const sParam = params.get("s");

var intervalId = window.setInterval(checkTime, 500);

function checkTime() {

    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();

    if(h == hParam && m == mParam && s == sParam) return window.location='game.html';
}