var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed,feedDog;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed=createButton("Feed");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedtime=database.ref("FeedTime");
  feedtime.on("value",function (data){
  lastFed = data.val();
  })
 
  //write code to display text lastFed time here
  if(lastFed >= 12){
    fill ("black")
    textSize(20)
    text("Last Fed :" + lastFed + "PM", 300,30 );
   }else if (lastFed == 0){
    fill ("black")
    textSize(20)
    text("Last Fed : 12" , 300,30 );
   }else{
    fill ("black")
    textSize(20)
    text("Last Fed :" + lastFed + "AM", 300,30 );
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var storeFS = foodObj.getFoodStock();
  if (storeFS <= 0){
    foodObj.updateFoodStock(storeFS *0)
  }else {
    foodObj.updateFoodStock(storeFS -1)
  }
  database.ref("/").update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
