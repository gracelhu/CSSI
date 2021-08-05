/* global
 *    createCanvas, colorMode, HSB, background, ellipseMode, CENTER, ellipse, width, height, fill, stroke, strokeWeight,
 *    noStroke, cos, sin, text, textSize, textFont, frameRate, noFill, loadImage, image, mouseX, mouseY, collideRectCircle,
 *    clear, noLoop, loop, mouseIsPressed, round, key, textAlign, rect, image, tint, LEFT, noTint, loadSound, soundFormats,
 *    createSlider
 */

let saturation,
  brightness,
  sunWidth,
  timetexty,
  angle,
  user,
  yearsPassed,
  totalDaysPassed;

//planet variables
let Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto;
var planets = [];

let mercuryOrbitalVelocity = 0.15;

let cloud, arrow;

//Details page variables
let gravityBoxX, gravityBoxY, gravityBoxVelocity;

function setup() {
  createCanvas(1200, 800);
  colorMode(HSB, 360, 100, 100);

  //TODO: finish background music -- file size too big
  //background music: initialize song var
  //music.play();

  //width of the Sun
  sunWidth = 56;

  //I'm setting the saturation and brightness both to 100 because that's the color theme of our objects
  saturation = 100;
  brightness = 100;

  //setting initial y location of orbit time text on screen
  timetexty = 0;
  createPlanets();
  //Creating planets
  function createPlanets() {
    Mercury = new Planet(
      "Mercury",
      width / 2 + 50,
      height / 2,
      8 * 1.2,
      mercuryOrbitalVelocity,
      50,
      60,
      88,
      true,
      true,
      3.7,
      290,
      800
    );
    Venus = new Planet(
      "Venus",
      width / 2 + 100,
      height / 2,
      12 * 1.2,
      mercuryOrbitalVelocity * 0.39,
      85,
      30,
      225,
      false,
      true,
      8.9,
      480,
      480
    );
    Earth = new Planet(
      "Earth",
      width / 2 + 150,
      height / 2,
      13 * 1.2,
      mercuryOrbitalVelocity * 0.24,
      120,
      240,
      365,
      false,
      true,
      9.8,
      -25,
      45
    );
    Mars = new Planet(
      "Mars",
      width / 2 + 200,
      height / 2,
      10 * 1.2,
      mercuryOrbitalVelocity * 0.12,
      155,
      3,
      687,
      false,
      true,
      3.7,
      -140,
      20
    );
    Jupiter = new Planet(
      "Jupiter",
      width / 2 + 250,
      height / 2,
      19 * 1.2,
      mercuryOrbitalVelocity * 0.02,
      190,
      35,
      4333,
      false,
      false,
      24.8,
      -128,
      -13
    );
    Saturn = new Planet(
      "Saturn",
      width / 2 + 300,
      height / 2,
      18 * 1.2,
      mercuryOrbitalVelocity * 0.0083,
      225,
      70,
      10759,
      true,
      false,
      10.4,
      -185,
      -122
    );
    Uranus = new Planet(
      "Uranus",
      width / 2 + 350,
      height / 2,
      16 * 1.2,
      mercuryOrbitalVelocity * 0.0029,
      260,
      177,
      30689,
      false,
      false,
      8.9,
      -214,
      -214
    );
    Neptune = new Planet(
      "Neptune",
      width / 2 + 400,
      height / 2,
      16 * 1.2,
      mercuryOrbitalVelocity * 0.00146,
      295,
      210,
      60182,
      false,
      false,
      11.2,
      -225
    );
    planets.push(Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune);
  }
  //TODO: should we include pluto?
  //Pluto = new Planet(width/2 + 450, height/2, 10, 0.02, 450, 0);

  //distanceFromSun = 30;
  //50 is the radius of the planet's orbital path

  //initialize the angle to 0 at first
  angle = 0;

  //initialize the yearsPassed to 0 for now
  yearsPassed = 0;

  //initialize the totalTimePassed to 0 for now
  totalDaysPassed = 0;

  //frameRate set to 30
  frameRate(30);

  //load astronaut user
  user = loadImage(
    `https://cdn.glitch.com/280a71ac-f06a-489e-8883-e6f1d89878ef%2Fastronaut%20character.png?v=1628022885912`
  );

  cloud = loadImage(
    "https://cdn.glitch.com/280a71ac-f06a-489e-8883-e6f1d89878ef%2Fcloud%20planet%20project.png?v=1628105238050"
  );
  arrow = loadImage(
    "https://cdn.glitch.com/280a71ac-f06a-489e-8883-e6f1d89878ef%2Farrow.png?v=1628105249258"
  );
}

function draw() {
  solarSystemModel();
}

function solarSystemModel() {
  //black background
  background(0);

  //draw the sun with no outline
  noStroke();
  fill(60, saturation, brightness);
  ellipse(width / 3.5, height / 1.75, sunWidth);

  //Title text
  fill(360);
  textSize(60);
  //textFont('Press Start 2P');
  textAlign(LEFT);
  text("Click each planet to learn more!", width / 5, 100);
  textSize(45);
  text("Orbital Periods:", width / 1.5, height / 3.5);
  textSize(30);

  fill(100);
  //draw the orbital path and set the planet into motion on it
  //then display orbit time
  for (let i = 0; i < planets.length; i++) {
    planets[i].drawOrbitalPath();
    planets[i].displayPlanet();
    planets[i].orbitPlanet();
    planets[i].checkCollisions();
  }
  printOrbitalPeriod();
  //TODO: add info box explaining differences in velocities
  //TODO: add slider to speed up time

  /* Making the planet move in a circular orbit 
  X := originX + cos(angle)*radius;
  Y := originY + sin(angle)*radius;
  The angle goes from 0 to 360 (This will be the incremented factor)
  (originX, originY) is the center of your circle. radius is its radius. That's it.
  */

  //Check for collisions
  for (let i = 0; i < planets.length; i++) {
    planets[i].checkCollisions();
  }

  image(user, mouseX, mouseY, 55, 55);
}

//print each planet's orbital period (length) to the right side of the screen
function printOrbitalPeriod() {
  timetexty = height / 2.5;
  fill("white");
  for (let i = 0; i < planets.length; i++) {
    if (planets[i].orbitalPeriod < 365) {
      text(
        `${planets[i].name}: ${planets[i].orbitalPeriod} days`,
        width / 1.5,
        timetexty
      );
    } else if (planets[i].orbitalPeriod == 365) {
      text(
        `${planets[i].name}: ${round(planets[i].orbitalPeriod / 365, 0)} year`,
        width / 1.5,
        timetexty
      );
    } else {
      text(
        `${planets[i].name}: ${round(planets[i].orbitalPeriod / 365, 0)} years`,
        width / 1.5,
        timetexty
      );
    }
    timetexty += 50;
  }
}

//planet class
class Planet {
  constructor(
    name,
    planetX,
    planetY,
    radius,
    angleIncrement,
    distanceFromSun,
    color,
    orbitalPeriod,
    isGrey,
    rocky,
    gravity,
    minTemp,
    maxTemp
  ) {
    this.name = name;
    this.planetX = planetX;
    this.planetY = planetY;
    //radius represents the size of the planet
    this.radius = radius;
    //angle increment represents angular velocity of orbit
    this.angle = 0;
    this.angleIncrement = angleIncrement;
    this.distanceFromSun = distanceFromSun;
    this.color = color;
    this.orbitalPeriod = orbitalPeriod;
    this.isGrey = isGrey;
    this.rocky = rocky;
    this.gravity = gravity;
  }

  drawOrbitalPath() {
    //draw the orbital path of a planet
    noFill();
    strokeWeight(2.5);
    stroke(95);
    ellipse(width / 3.5, height / 1.75, this.distanceFromSun * 2);
  }

  displayPlanet() {
    noStroke();
    if (this.isGrey) {
      fill(this.color);
    } else {
      fill(this.color, saturation, brightness);
    }
    ellipse(this.planetX, this.planetY, this.radius * 2, this.radius * 2);
  }

  orbitPlanet() {
    //TODO: if time, add day counter
    //TODO: slow down orbit for easier clicking
    this.planetX = width / 3.5 + cos(this.angle) * this.distanceFromSun;
    this.planetY = height / 1.75 + sin(this.angle) * this.distanceFromSun;
    this.angle += this.angleIncrement;
  }

  checkCollisions() {
    //collideRectCircle(x1, y1, width1, height1, cx, cy, diameter)
    if (
      collideRectCircle(
        mouseX,
        mouseY,
        55,
        55,
        this.planetX,
        this.planetY,
        this.radius
      ) &&
      mouseIsPressed
    ) {
      noLoop();
      this.detailsPage();
    }
  if  (
    collideRectRect(
      mouseX,
      mouseY,
      55,
      55,
      250,
      30,
      120,
      80
      ) &&
      mouseIsPressed
    ){
      fill("white");
      rect(width / 2, height / 2, 240, 160);
    }
  }
  detailsPage() {
    clear();
    background(0);

    //displays the planet (semicircle) --> if the planet is grey, make it grey
    if (this.isGrey) {
      fill(this.color);
    } else {
      fill(this.color, 100, 100);
    }

    ellipse(width / 2, height + 700, 1900);

    fill(100);
    textAlign(CENTER);
    textSize(40);
    text(this.name, width / 2, 70);

    //displays the atmosphere --> tint it the color of the planet (grey if the planet is grey)
    if (this.isGrey) {
      tint(this.color);
    } else {
      tint(this.color, 60, 90);
    }

    //display the cloud --> only if it has an atmosphere -> mercury is the only one that doesn't
    image(cloud, width / 2 - 150, 100, 300, 300);
    fill(0);
    textSize(25);
    text("Atmosphere", width / 2, 250);
    text("(Click me!)", width / 2, 280);

    textSize(35);
    if (this.rocky) {
      text("Rocky Ground", width / 2, 700);
    } else {
      text("Gaseous Ground", width / 2, 700);
    }

    //draw the Stats and test gravity boxes

    //purple stats box and purple gravity box
    gravityBoxX = width - 340;
    gravityBoxY = 65;

    fill(270, 80, 100);
    rect(250, 30, 120, 80);
    rect(width - 400, 30, 120, 80);

    fill(0);
    textSize(20);
    text("Stats", 310, 65);
    text("(Click me!)", 310, 90);

    textSize(20);
    text("Test Gravity", width - 340, 65);
    text("(Click me!)", width - 340, 90);
    fill(100);

    //We want to make the gravity box fall when it hits the ground

    //expanded stats box
    //fill("white");
    //rect(width / 2, height / 2, 240, 160);

    //press a to go back
    fill(0);
    textSize(25);
    text("press [space] to go back", width / 2, height - 60);

    noTint();
  }
}

function keyTyped() {
  if (key === " ") {
    loop();
    solarSystemModel();
  }
}
