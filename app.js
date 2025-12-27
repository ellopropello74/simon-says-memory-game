let highScore = localStorage.getItem("highScore") || 0;
document.querySelector(".highscore h1").innerText = `High Score: ${highScore}`;


let gameSeq = [] ;
let userSeq = [] ;

let btns = ["yellow" , "red" , "purple" , "green"] ;

let started = false ;
let level =  0 ;

let h2 = document.querySelector("h2") ;

// Funktion zur Erkennung von Touch-Geräten
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// Anpassen der Startanweisung für Touch-Geräte
if (isTouchDevice()) {
    h2.innerText = "Tap anywhere to start the game";
}

document.addEventListener("keypress" , function () {
    if(started == false){
        console.log("game started") ;
        started = true ;
        levelUp();
    }
});

// Touch-Unterstützung für mobile Geräte
document.addEventListener("touchstart" , function (e) {
    if(started == false){
        console.log("game started via touch") ;
        started = true ;
        levelUp();
        e.preventDefault(); // Verhindere das Standardverhalten
    }
}, { passive: false });

function gameFlash(btn){
    btn.classList.add("flash") ; 
    setTimeout(function () {
        btn.classList.remove("flash") ;
    }, 250)
}
function userFlash(btn){
    btn.classList.add("userflash") ; 
    setTimeout(function () {
        btn.classList.remove("userflash") ;
    }, 250)
}

function levelUp(){
    userSeq = [] ;
    level++ ;
    h2.innerText = `Level ${level}` ;
    let randIdx = Math.floor(Math.random()*3) ;
    let randColor = btns[randIdx] ;
    let randBtn = document.querySelector(`.${randColor}`) ;
    gameSeq.push(randColor) ;
    console.log(gameSeq) ;
    
    // Wiederhole die gesamte Sequenz
    let delay = 0;
    for (let i = 0; i < gameSeq.length; i++) {
        let color = gameSeq[i];
        let btn = document.querySelector(`.${color}`);
        setTimeout(() => {
            gameFlash(btn);
            // Sound abspielen
            if (sounds[color]) {
                sounds[color].currentTime = 0;
                sounds[color].play().catch(e => console.log("Sound konnte nicht abgespielt werden:", e));
            }
        }, delay);
        delay += 600; // Wartezeit zwischen den Farben
    }
}

function checkAns(idx){
    // console.log("curr lvl : ", level) ; 

    if(userSeq[idx] === gameSeq[idx]){
        if(userSeq.length == gameSeq.length){
            setTimeout(levelUp , 1000) ; 
        }
    }else {
    if (level > highScore) {
        highScore = level;
        localStorage.setItem("highScore", highScore);
    }

    document.querySelector(".highscore h1").innerText =
        `Highest Score: ${highScore}`;

    h2.innerHTML = `Game Over! SCORE:<b>${level}</b> <br> Press any key to start.`;

    reset();

    document.body.style.backgroundColor = "red";
    setTimeout(() => {
        document.body.style.backgroundColor = "white";
    }, 150);
    }
}

function btnPress(){
    let btn = this;
    userFlash(btn) ;

    userColor = btn.getAttribute("id") ;
    userSeq.push(userColor) ;

    // Sound abspielen, wenn die Sound-Datei vorhanden ist
    if (sounds[userColor]) {
        sounds[userColor].currentTime = 0; // Zurück zum Anfang setzen, falls der Sound bereits abgespielt wird
        sounds[userColor].play().catch(e => console.log("Sound konnte nicht abgespielt werden:", e));
    }

    checkAns(userSeq.length-1) ;
}

let allBtns = document.querySelectorAll(".btn") ;
for(btn of allBtns){
    btn.addEventListener("click" , btnPress);
    btn.addEventListener("touchstart" , function(e) {
        e.preventDefault(); // Verhindere das Standardverhalten
        btnPress.call(this, e); // Rufe btnPress mit dem richtigen Kontext auf
    }, { passive: false });
}

// Sound-Elemente erstellen
let sounds = {
    red: new Audio("sounds/red.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    green: new Audio("sounds/green.mp3"),
    purple: new Audio("sounds/purple.mp3")
};

function reset(){
    started = false; 
    gameSeq = [] ; 
    userSeq = [] ; 
    level = 0 ; 
}

// additional feature

document.querySelector(".how-to-play").addEventListener("click", function () {
    alert(
        "How to Play:\n\n" +
        "1. Press any key to start\n" +
        "2. Watch the color sequence\n" +
        "3. Repeat the sequence by clicking the colors\n" +
        "4. Each level adds one more color\n\n" +
        "Try to beat your high score!"
    );
});
