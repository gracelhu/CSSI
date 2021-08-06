/* global
 *    createCanvas, colorMode, HSB, background, ellipseMode, CENTER, ellipse, width, height, fill, stroke, strokeWeight,
 *    noStroke, cos, sin, text, textSize, textFont, frameRate, noFill, loadImage, image, mouseX, mouseY, collideRectCircle,
 *    clear, noLoop, loop, mouseIsPressed, round, key, textAlign, rect, image, tint, LEFT, noTint, loadSound, soundFormats,
 *    createSlider, collidePointRect, loadFont
 */

let saturation,
  brightness,
  pop,
  sunWidth,
  timetexty,
  angle,
  user,
  yearsPassed,
  totalDaysPassed,
  cloud,
  arrow,
  pageMode,
  currentPlanet,
  spaceFont;

//planet variables
let Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto;
var planets = [];

let mercuryOrbitalVelocity = 0.15;
let mercuryGravity = 2;

//pop up switching variables
let isStatsPage;
let isAtmospherePage;

function setup() {
  createCanvas(1200, 800);
  colorMode(HSB, 360, 100, 100);

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
      8,
      mercuryOrbitalVelocity,
      50,
      60,
      88,
      true,
      true,
      mercuryGravity,
      290,
      800,
      3.7,
      0,
      0.33,
      0
    );
    Venus = new Planet(
      "Venus",
      width / 2 + 100,
      height / 2,
      12,
      mercuryOrbitalVelocity * 0.39,
      85,
      30,
      225,
      false,
      true,
      mercuryGravity * 2.4,
      480,
      480,
      8.9,
      92,
      4.87,
      0
    );
    Earth = new Planet(
      "Earth",
      width / 2 + 150,
      height / 2,
      13,
      mercuryOrbitalVelocity * 0.24,
      120,
      240,
      365,
      false,
      true,
      mercuryGravity * 2.65,
      -25,
      45,
      9.8,
      1.014,
      5.97,
      1
    );
    Mars = new Planet(
      "Mars",
      width / 2 + 200,
      height / 2,
      10,
      mercuryOrbitalVelocity * 0.12,
      155,
      3,
      687,
      false,
      true,
      mercuryGravity,
      -140,
      20,
      3.7,
      0.01,
      0.642,
      2
    );
    Jupiter = new Planet(
      "Jupiter",
      width / 2 + 250,
      height / 2,
      19,
      mercuryOrbitalVelocity * 0.02,
      190,
      35,
      4333,
      false,
      false,
      mercuryGravity * 6.74,
      -128,
      -13,
      24.8,
      "unknown",
      1898,
      79
    );
    Saturn = new Planet(
      "Saturn",
      width / 2 + 300,
      height / 2,
      18,
      mercuryOrbitalVelocity * 0.0083,
      225,
      70,
      10759,
      true,
      false,
      mercuryGravity * 2.82,
      -185,
      -122,
      10.4,
      "n/a",
      568,
      82
    );
    Uranus = new Planet(
      "Uranus",
      width / 2 + 350,
      height / 2,
      16,
      mercuryOrbitalVelocity * 0.0029,
      260,
      177,
      30689,
      false,
      false,
      mercuryGravity * 2.4,
      -214,
      -214,
      8.9,
      "n/a",
      86.8,
      27
    );
    Neptune = new Planet(
      "Neptune",
      width / 2 + 400,
      height / 2,
      16,
      mercuryOrbitalVelocity * 0.00146,
      295,
      210,
      60182,
      false,
      false,
      mercuryGravity * 3,
      -200,
      -200,
      11.2,
      "n/a",
      102,
      14
    );
    planets.push(Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune);
  }

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
    "https://cdn.glitch.com/14b752c7-af9b-404b-87b5-8f5c3e9fa96b%2Fcloud%20planet%20project.png?v=1628222608358"
  );
  arrow = loadImage(
    "https://cdn.glitch.com/280a71ac-f06a-489e-8883-e6f1d89878ef%2Farrow.png?v=1628105249258"
  );

  pageMode = "solar system";
  spaceFont = loadFont(
    "https://cdn.glitch.com/14b752c7-af9b-404b-87b5-8f5c3e9fa96b%2FAstroSpace-eZ2Bg.ttf?v=1628204253236"
  );
  pop = createAudio(
    "https://cdn.glitch.com/14b752c7-af9b-404b-87b5-8f5c3e9fa96b%2Fsfx-pop.mp3?v=1628231019505"
  );
}

function draw() {
  if (pageMode === "solar system") {
    solarSystemModel();
  } else if (pageMode === "planet page") {
    isStatsPage = false;
    isAtmospherePage = false;
    currentPlanet.detailsPage();
  } else if (pageMode === "stats page") {
    currentPlanet.detailsPage();
    currentPlanet.displayStats();
  } else if (pageMode === "atmosphere page") {
    currentPlanet.detailsPage();
    currentPlanet.displayAtmosphereInfo();
  }
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
  textSize(45);
  //textFont('Press Start 2P');
  textAlign(LEFT);
  textFont(spaceFont);
  text("Solar System Simulator", width / 5 + 40, 80);
  textSize(20);
  text("(Click each planet to learn more)", width / 3, 120);
  textSize(35);
  text("Orbital Periods:", width / 1.5, height / 3.5);
  textSize(27);

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
    maxTemp,
    gravConstant,
    pressure,
    mass,
    numMoons
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
    this.minTemp = minTemp;
    this.maxTemp = maxTemp;
    this.gravConstant = gravConstant;
    this.pressure = pressure;
    this.mass = mass;
    this.numMoons = numMoons;
    this.boxX = width - 400;
    this.boxY = 30;
    this.boxWidth = 120;
    this.boxHeight = 80;
    this.boxVelocity = 0;
    this.fall = false;
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
      //noLoop();
      //this.detailsPage();
      pop.play();
      pageMode = "planet page";
      currentPlanet = this;
    }
  }

  detailsPage() {
    clear();
    background(0);

    fill(100);
    textAlign(CENTER);
    textSize(40);
    text(this.name, width / 2, 70);

    this.displayStatsBox();

    this.displayAtmosphere();

    this.displayGround();

    this.displayGravityBox();

    this.dropGravityBox();

    noTint();
  }

  displayGround() {
    if (this.isGrey) {
      fill(this.color);
    } else {
      fill(this.color, 100, 100);
    }

    ellipse(width / 2, height + 700, 1900);

    textSize(35);
    fill(0);
    if (this.rocky) {
      text("Rocky Ground", width / 2, 700);
    } else {
      text("Gaseous Ground", width / 2, 700);
    }

    textSize(25);
    text("press [space] to go back", width / 2, height - 60);
  }

  displayAtmosphere() {
    if (this.isGrey) {
      tint(this.color);
    } else {
      tint(this.color, 60, 90);
    }

    image(cloud, width / 2 - 150, 150, 300, 150);
    fill(0);
    textSize(25);
    text("Atmosphere", width / 2, 230);
    text("(Click me!)", width / 2, 260);
  }

  displayStatsBox() {
    fill(270, 80, 100);
    rect(250, 30, 120, 80);
    fill(0);
    textSize(17);
    text("Stats", 310, 65);
    text("(Click me!)", 310, 90);
  }

  displayGravityBox() {
    fill(270, 80, 100);
    rect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);

    if (!this.fall) {
      textSize(15);
      fill(0);
      text("Test Gravity", width - 340, 65);
      text("(Click me!)", width - 340, 90);
    }
  }

  dropGravityBox() {
    //collidePointRect(pointX, pointY, x, y, width, height)
    if (
      collidePointRect(
        mouseX,
        mouseY,
        this.boxX,
        this.boxY,
        this.boxWidth,
        this.boxHeight
      ) &&
      mouseIsPressed
    ) {
      this.fall = true;
    }

    if (this.fall) {
      this.boxVelocity += this.gravity;
      this.boxY += this.boxVelocity;

      if (this.boxY >= height - this.boxHeight) {
        this.boxVelocity = 0;
        this.boxX = width - 400;
        this.boxY = 30;
        this.fall = false;
      }
    }
  }

  displayStats() {
    isStatsPage = true;
    fill("white");
    rect(300, 200, 600, 400);
    fill("grey");
    textSize(45);
    text("STATS", 600, 255);
    fill("black");
    textSize(25);
    text(`Gravitational Constant: ${this.gravConstant} m/s^2`, 600, 310);
    if (this.minTemp === this.maxTemp) {
      text(`Avg. Temperature: ${this.minTemp}\u00B0C`, 600, 355);
    } else {
      text(
        `Temperature Range: ${this.minTemp} to ${this.maxTemp}\u00B0C`,
        600,
        355
      );
    }
    if (this.pressure == "n/a") {
      text(`Surface Pressure: ${this.pressure}`, 600, 400);
    } else {
      text(`Surface Pressure: ${this.pressure} bars`, 600, 400);
    }
    text(`Mass: ${this.mass} x 10^24 kg`, 600, 445);
    text(`Number of Moons: ${this.numMoons}`, 600, 490);
    textSize(20);
    text("press [space] to go back", 600, 535);
  }

  displayAtmosphereInfo() {
    isAtmospherePage = true;
    fill("white");
    rect(300, 200, 600, 400);
    fill("grey");
    textSize(45);
    text("ATMOSPHERE", 600, 255);
    fill("black");
    textSize(25);
    //put the atmosphere info here, you'll want to add a variable to the
    //planet class that's like atmosphereInfo where you can store the description,
    //and then put it in for each class and retrieve it here (since these descriptions
    //are sentences long, you might want to just create a global variable for each
    //planet's description and then pass it down into the constructor, text me if you
    //want clarification or help)
    //use \n for line breaks in your passed variables
    text(
      "This is where you can \n put the atmosphere \n descriptions.",
      600,
      310
    );
    textSize(20);
    text("press [space] to go back", 600, 535);
  }
}

function keyTyped() {
  if (key === " " && !isStatsPage && !isAtmospherePage) {
    //loop();
    //solarSystemModel();
    pageMode = "solar system";
  } else if (key === " " && (isStatsPage || isAtmospherePage)) {
    pageMode = "planet page";
  }
}

function mouseClicked() {
  statsCollide();
  atmosphereCollide();
}

function statsCollide() {
  if (collidePointRect(mouseX, mouseY, 250, 30, 120, 80)) {
    pageMode = "stats page";
  }
}

function atmosphereCollide() {
  if (collidePointRect(mouseX, mouseY, 450, 150, 300, 150)) {
    pageMode = "atmosphere page";
  }
}
