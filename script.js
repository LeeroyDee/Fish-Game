

const canvas=document.getElementById("canvas1");
const ctx=canvas.getContext("2d");
canvas.width=document.documentElement.clientWidth;
canvas.height=document.documentElement.clientHeight;
let score=0;
let gameFrame=0
ctx.font="40px Georgia";
let gameSpeed=1;
let gameOver=false;
let a=canvas.width>376?1:0.5;


const bubblePop1= new Audio("./sound/Plop.wav")
const bubblePop2=new Audio("./sound/bubbles-single2.wav")
var audioWeWantToUnlock =[];
audioWeWantToUnlock.push(bubblePop1);
audioWeWantToUnlock.push(bubblePop2);



canvas.addEventListener("touchstart",function(){
  if(audioWeWantToUnlock){
    for(let audio of audioWeWantToUnlock){
  
      audio.play();
    audio.pause();
    audio.currentTime=0;
    }
audioWeWantToUnlock=null;
  }
},false);
//
//
//
//
//
//

// Mouse interactivity
let canvasPosition=canvas.getBoundingClientRect();
const mouse={
  x:canvas.width/2,
  y:canvas.height/2,
  click:false
}

canvas.addEventListener("mousedown",function(event){
  mouse.click=true;
  mouse.x=event.x-canvasPosition.left;
  mouse.y=event.y-canvasPosition.top;

});
canvas.addEventListener("mouseup",function(){
  mouse.click=false;
});



const playerLeft = new Image();
playerLeft.src="./img/fish_swim_left.png"

const playerRight =new Image();
playerRight.src="./img/fish_swim_right.png"



class Player{
  constructor(){
    this.x=canvas.width;
    this.y=canvas.height/2;
    this.radius=50*a;
    this.angle=0;
    this.frameX=0;
    this.frameY=0;
    this.frame=0;
    this.spriteWidth=498;
    this.spriteHeight=327;

  }
  update(){
    const dx=this.x-mouse.x;
    const dy=this.y-mouse.y;
    
    if(mouse.x!=this.x){
      this.x-=dx/(20*a);

    }
      if(mouse.y!=this.y){
      this.y-=dy/(20*a);
    }
    let theta=Math.atan2(dy,dx);
    this.angle=theta;
  }
  draw(){
    if(mouse.click){
      ctx.lineWidth=0.001;
      ctx.beginPath();
      ctx.moveTo(this.x,mouse.y);
      ctx.lineTo(mouse.x,mouse.y);
      ctx.stroke();
    }
    // ctx.fillStyle="red";
    // ctx.beginPath();
    // ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    // ctx.fill();
    // ctx.closePath();
    // ctx.fillRect(this.x,this.y,this.radius,10)
      if(gameFrame%10==0){
        this.frame++;
        if(this.frame==12)this.frame=0;
        if(this.frame==3||this.frame==7||this.frame==11){
          this.frameX=0;
        }else{this.frameX++;}
        if(this.frame>3){
          this.frameY=0;
        }else if(this.frame>7){
          this.frameY=1;
        }else if(this.frame>11){
          this.frameY=2
        }else this.frameY=0;
      }
    
      ctx.save()
      ctx.translate(this.x,this.y);
      ctx.rotate(this.angle);
       if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60*a, 0 - 45*a, this.spriteWidth /4*a, this.spriteHeight /4*a);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60*a, 0 - 45*a, this.spriteWidth /4*a, this.spriteHeight /4*a);
        }
      ctx.restore();
    
  }
}



const player= new Player;

const bubblesArray=[];
const bubbleImage=new Image();
bubbleImage.src="./img/bubble_pop.png";


class Bubble{
    constructor(){
      this.x=Math.random()*canvas.width;
      this.y=canvas.height+100;
      this.radius=50*a;
      this.speed=Math.random()*5+1;
      this.distance;
      this.counted=false;
      this.sound=Math.random()<=0.5?"sound1":"sound2";
      this.frameX=0;
      this.frameY=0;
      this.frame=0;
      this.spriteWidth = 512;
      this.spriteHeight = 512;
      this.pop = false;

    }
    update(){
      this.y-=this.speed;
      const dx=this.x-player.x;
      const dy=this.y-player.y;
      this.distance=Math.sqrt(dx*dx+dy*dy);
    
    }
    draw(){
      // ctx.fillStyle="blue";
      // ctx.beginPath();
      // ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
      // ctx.fill();
      // ctx.closePath();
      // ctx.stroke();
      ctx.drawImage(bubbleImage,this.spriteWidth*this.frameX,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x-65*a,this.y-65*a, this.spriteWidth/4*a,this.spriteHeight/4*a);
      
    }
}

function handleBubbles(){
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].y < 0 - canvas.height){
            bubblesArray.splice(i, 1);
        }
    }
    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
            popAndRemove(i);
        }
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }
    if (gameFrame % 50 == 0) {
        bubblesArray.push(new Bubble());

    }
}
function popAndRemove(i){
    if (bubblesArray[i]) {
        if (!bubblesArray[i].counted){
            score++;
            if(bubblesArray[i].sound=="sound1"){
               bubblePop1.play();
                }else{
              bubblePop2.play();
              }

        } 
        
        bubblesArray[i].counted = true;
        bubblesArray[i].frame++;
        if(bubblesArray[i].frame==3){
          bubblesArray[i].frameX=0;
        }else bubblesArray[i].frameX++;
        bubblesArray[i].frameY>2?bubblesArray[i].frameY=1:bubblesArray[i].frameY=0;
     
        if (bubblesArray[i].frame>5) bubblesArray[i].pop = true;
        if (bubblesArray[i].pop) bubblesArray.splice(i, 1);
        requestAnimationFrame(popAndRemove);
    }

}


const background=new Image();
background.src="./img/background1.png"

const BG={
  x1:0,
  x2:canvas.width,
  y:0,
  width:canvas.width,
  height:canvas.height,
}
function handleBackground(){
  BG.x1-=gameSpeed;
  if(BG.x1<-BG.width)BG.x1=BG.width;
  BG.x2-=gameSpeed;
  if(BG.x2<-BG.width)BG.x2=BG.width;
  ctx.drawImage(background,BG.x1,BG.y,BG.width,BG.height);
  ctx.drawImage(background,BG.x2,BG.y,BG.width,BG.height);
}
/****Bubble Text ****/

let bubbleTextArray=[];


class Particle2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 7;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 15) + 1;
        this.distance;
    }
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(34,147,214,1)';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        if (this.distance < 50){
            this.size = 14;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 4, this.y -4, this.size/3, 0, Math.PI * 2);
            ctx.arc(this.x -6, this.y -6, this.size/5, 0, Math.PI * 2);
        } else if (this.distance <= 80){
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 3, this.y -3, this.size/2.5, 0, Math.PI * 2);
            ctx.arc(this.x -4, this.y -4, this.size/4.5, 0, Math.PI * 2);
        }
        else {
            this.size = 5;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 1, this.y -1, this.size/3, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill()
    }
    update(){
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < 100){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/20;
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
    }
}
function init2() {

let adjustX=-3;
let adjustY=-3;
ctx.fillStyle="white";
ctx.font =canvas.width>500?"20px Verdana":'10px Verdana';
ctx.fillText(input.value,5,60);
const textCoordinates=ctx.getImageData(0,0,200,60);
    bubbleTextArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                bubbleTextArray.push(new Particle2(positionX * 8, positionY * 8));
            }
        }
    }
}
// init2();


//Enemies
const enemyImage=new Image();
enemyImage.src="./img/enemy1.png";

class Enemy{
  constructor() {
    this.x=canvas.width+200;
    this.y=Math.random()*(canvas.height-150)+90;
    this.radius=60*a;
    this.speed=canvas.width>377?(Math.random()*2+2):1;
    this.frame=0;
    this.frameX=0;
    this.frameY=0;
    this.spriteWidth=418;
    this.spriteHeight=397;
    
  }
  draw(){
    // ctx.fillStyle="red";
    // ctx.beginPath();
    // ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    // ctx.fill();
    ctx.drawImage(enemyImage,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x-60*a,this.y-70*a,this.spriteWidth/3*a,this.spriteHeight/3*a)

  }
  update(){
    this.x-=this.speed;
    if(this.x<0-this.radius*2){
      this.x=canvas.width+200;
      this.y=Math.random()*(canvas.height-150)
    }
    if(gameFrame%5==0){
      this.frame++;
      if(this.frame>=12)this.frame=0;
      if(this.frame==3||this.frame==7||this.frame||11){
        this.frameX=0;
      }else{
        this.frameX++;
      }
      if(this.frame<3)this.frameY=0;
      else if(this.frame<7)this.frameY=1;
       else if(this.frame<11)this.frameY=2;
        else this.frameY=0;
    }
    const dx=this.x-player.x
    const dy=this.y-player.y;
    const distance=Math.sqrt(dx*dx+dy*dy);
    if(distance<this.radius+player.radius){
      handleGameOver();
    }
  }
}
const enemy1=new Enemy();
function handleEnemies(){
 
  enemy1.draw();
   enemy1.update();
}
function handleGameOver(){
  ctx.fillStyle="white";
  ctx.font=canvas.width>500?'120px Arial':"40px Arial"
  ctx.fillText("Game over ",canvas.width/2-100,canvas.height/2);
  buttonExit.style.display="block";
  buttonReset.style.display="block";
  gameOver=true;
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  for (let i = 0; i < bubbleTextArray.length; i++){
        bubbleTextArray[i].draw();
        bubbleTextArray[i].update();
    }
  handleBackground()
  handleBubbles();

  player.update();
  player.draw();
  handleEnemies();
  ctx.fillStyle="black";
  ctx.font = '50px Georgia'
  ctx.fillText("score:"+score,10,50)
  if(canvas.width<=375){
    
    ctx.fillStyle="rgba(250,80,40,1)";
  ctx.font=canvas.width>500?'50px Georgia':'20px Georgia';
  ctx.fillText(input.value+" привет:)",100,100)
  }
  gameFrame++;
  if(!gameOver){requestAnimationFrame(animate);}
  }
  //button start,reset,Exit
let buttonExit=document.getElementById("buttonEx")
  buttonExit.onclick=function(){
   // window.close();
  }
let buttonReset=document.getElementById("buttonRe");
buttonReset.onclick=function(){
  location.reload();
  buttonStart.style.display="none";
  animate();

}
let buttonStart=document.getElementById("button");
buttonStart.onclick=function(){
  
  init2();
  input.style.display="none";
  buttonStart.style.display="none";
  animate();
}
////
///input name
//
let input =document.getElementById("input1");
//animate();
window.addEventListener("resize",function(){
  canvasPosition=canvas.getBoundingClientRect();
})
//
//escape button
//
let opRunBt={
  //кнопка которую будем использовать:)
  field:document.getElementById("buttonEx"),
  events:{
    mouseover: e=>{
  // max canvas.width
  // max canvas.height
  //width =
    opRunBt.field.style.left=Math.random()*document.documentElement.clientWidth-opRunBt.field.style.width+"px";
    opRunBt.field.style.top=Math.random()*document.documentElement.clientHeight-opRunBt.field.style.width+"px";
      }
    },
}

opRunBt.field.addEventListener("mouseover",opRunBt.events.mouseover);




