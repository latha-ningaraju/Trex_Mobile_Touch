var trex, trex_running;
var ground, groundImage;
var invisibleGround; 
var rand;
var cloud;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, gameOverImage;
var restart, restartImage;
var score = 0;

var jumpSound, dieSound, checkPointSound;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_jump = loadAnimation("trex1.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
createCanvas(windowWidth, windowHeight);
  
  
  //create a trex sprite
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.addAnimation("jump",trex_jump);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle",0,0,40);

  //create a ground sprite
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = width /2;

  //create an invisible ground
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  //create gameover sprite
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage("over",gameOverImage);
  gameOver.scale = 0.5;
  
  //create restart sprite
  restart = createSprite(width/2,height/2);
  restart.addImage("restart",restartImage);
  restart.scale = 0.5;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
}

function draw() {
  //set background color
  background("white");

  //To display score system
  text("Score: " + score, width-100,height/8);
  
  if (gameState === PLAY){
    trex.changeAnimation("running");
    gameOver.visible = false;
    restart.visible = false;
    ground.velocityX = -(4 + score/100);
    
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score % 100 == 0){
      checkPointSound.play();
    }
    
    if (ground.x < 0) {
    ground.x = ground.width / 2;
    }
    
    if(trex.y<165){
      trex.changeAnimation("jump");
    }
    
    //jump when the space button is pressed
    if ((touches.length > 0 || keyDown("space")) && trex.y>=165) {
      jumpSound.play();
      trex.velocityY = -10;
      touches = [];
    }
    
    //trex.changeAnimation("running");
    trex.velocityY = trex.velocityY + 0.5;
    
    //Spawn the clouds & obstacles
    spawnClouds();
    spawnObstacles();
    
    //to check if trex touches any of the obstacles
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
    }
  }
  
  else if (gameState === END){
    
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    //to change trex animation when it collides
    trex.changeAnimation("collided");
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 == 0) {
    var obstacle = createSprite(width,height-35,10,40);
    obstacle.velocityX = -(6 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = width/6;
    obstacle.depth = trex.depth;
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds(){
  if (frameCount % 60 == 0){
    cloud = createSprite(width,height-300,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(height-100,height-300));
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
    //assigning lifetime to the variable
    cloud.lifetime = width/3;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
