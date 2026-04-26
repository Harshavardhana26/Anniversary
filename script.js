/* ================= MUSIC ================= */
const music = document.getElementById("bgMusic");

/* PLAY MUSIC */
function playMusic(){
    if (music && music.paused) {
        music.volume = 0.4;
        music.play().catch(()=>{});
    }
}

/* STOP MUSIC */
function stopMusic(){
    if (music) {
        music.pause();
    }
}

/* ================= SCRATCH ================= */
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#FFD700";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.globalCompositeOperation = "destination-out";

let isDraw=false,count=0,done=false;

/* 🎵 START MUSIC WHEN USER TOUCHES SCRATCH */
canvas.onmousedown = () => {
    isDraw = true;
    playMusic();   // ✅ music starts here
};

canvas.onmouseup = () => isDraw = false;
canvas.onmousemove = e => draw(e.clientX,e.clientY);

/* HEART SCRATCH */
function draw(x,y){
    if(!isDraw) return;

    let size=20;

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.bezierCurveTo(x,y-size,x-size,y-size,x-size,y);
    ctx.bezierCurveTo(x-size,y+size,x,y+size*2,x,y+size*2);
    ctx.bezierCurveTo(x,y+size*2,x+size,y+size,x+size,y);
    ctx.bezierCurveTo(x+size,y-size,x,y-size,x,y);
    ctx.fill();

    count++;
    if(count>600 && !done){
        done=true;
        document.getElementById("hint").style.display="none";
        document.getElementById("reveal").style.opacity=1;
        canvas.remove();
    }
}

/* ================= NAVIGATION ================= */
function goFinal(){
    document.getElementById("reveal").style.display="none";
    document.getElementById("finalPage").style.display="flex";
}

function goBack(){
    document.getElementById("finalPage").style.display="none";
    document.getElementById("reveal").style.display="flex";
}

function goStory(){
    document.getElementById("finalPage").style.display="none";
    document.getElementById("storyPage").style.display="flex";
}

function backToFinal(){
    document.getElementById("storyPage").style.display="none";
    document.getElementById("finalPage").style.display="flex";
}

/* ================= PARTICLES ================= */
const sparkCanvas=document.getElementById("sparkCanvas");
const sparkCtx=sparkCanvas.getContext("2d");

sparkCanvas.width=window.innerWidth;
sparkCanvas.height=window.innerHeight;

let particles=[],showCard=false;

function createParticle(){
    return{
        x:Math.random()*sparkCanvas.width,
        y:Math.random()*sparkCanvas.height,
        size:Math.random()*3+1,
        speedX:(Math.random()-0.5)*2,
        speedY:(Math.random()-0.5)*2,
        color:`hsl(${Math.random()*360},100%,60%)`,
        life:100
    };
}

function initParticles(){
    particles=[];
    showCard=false;
    for(let i=0;i<200;i++) particles.push(createParticle());
}

function animateParticles(){
    sparkCtx.clearRect(0,0,sparkCanvas.width,sparkCanvas.height);

    particles.forEach(p=>{
        p.x+=p.speedX;
        p.y+=p.speedY;
        p.life--;

        sparkCtx.beginPath();
        sparkCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
        sparkCtx.fillStyle=p.color;
        sparkCtx.shadowBlur=10;
        sparkCtx.shadowColor=p.color;
        sparkCtx.fill();
    });

    particles=particles.filter(p=>p.life>0);
    while(particles.length<200) particles.push(createParticle());

    if(!showCard){
        if(particles.some(p=>Math.abs(p.x-sparkCanvas.width/2)<50)){
            showCard=true;
            const card=document.querySelector(".surprise-card");
            card.style.opacity=1;
            card.style.transform="scale(1)";
        }
    }

    requestAnimationFrame(animateParticles);
}

/* ================= FINAL PAGE ================= */
function goFinalSurprise(){
    document.getElementById("storyPage").style.display="none";
    document.getElementById("finalSurprise").style.display="flex";
    initParticles();
    animateParticles();
}

/* ================= VIDEO PAGE ================= */
function goVideo(){
    document.getElementById("finalSurprise").style.display="none";
    document.getElementById("videoPage").style.display="flex";

    stopMusic();   // 🔇 stop music on video page
}

function backToFinalSurprise(){
    document.getElementById("videoPage").style.display="none";
    document.getElementById("finalSurprise").style.display="flex";

    playMusic();   // 🔊 resume music
}