var escenario, DonGui, PlayerIMG, Muestra, MuestraIMG, Muestra2IMG, Muestra3IMG, Muestra4IMG, Estacion, EstacionIMG, CafeIMG, SmartIMG;
var countVirus = 0;
var countGlucemia = 0;
var countHipertension = 0;
var countHiperlipidemia = 0;
var MuestraCount = 0;
var Puntos = 0;
var speedX, speedY;
var fase = 0;
var Fase2, Fase3, Fase4;
var muestras = [];
var CafeG = [];
var startGame = false;
var lost = false;
var btnComenzar;
var btnReintentar;
let textos = [
  { mensaje: "PCR Negativo", activo: false, contador: 0, posX: 0, posY: 0},
  { mensaje: "PCR Positivo", activo: false, contador: 0, posX: 0, posY: 0},
  { mensaje: "Muestra contaminada", activo: false, contador: 0, posX: 0, posY: 0}
];
let FRAMES_MOSTRAR = 75;
let btnUp, btnDown, btnLeft, btnRight;
let isUp = false, isDown = false, isLeft = false, isRight = false;
let value;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function preload() {
  MuestraIMG = loadImage("./imagenes/Muestra.png");
  Muestra2IMG = loadImage("./imagenes/MuestraGlu.png");
  Muestra3IMG = loadImage("./imagenes/MuestraLip.png");
  Muestra4IMG = loadImage("./imagenes/MuestraVir.png");
  PlayerIMG = loadImage("./imagenes/F1.png");
  Fase2 = loadImage("./imagenes/F2.png");
  Fase3 = loadImage("./imagenes/F3.png");
  Fase4 = loadImage("./imagenes/F4.png");
  EstacionIMG = loadImage("./imagenes/Estacion.png");
  CafeIMG = loadImage("./imagenes/cafe.png");
  SmartIMG = loadImage("./imagenes/Smart2.jpeg");
  Risk1IMG = loadImage("./imagenes/Risk1.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (isMobile) {
    value = windowHeight / 2000;
  } else {
    value = windowWidth / 2000;
  }
  speedX = 20 * value;
  speedY = 10 * value;

  btnComenzar = createButton('Comenzar');
  btnComenzar.position(width / 2 - 100 * value, height / 2 - 100 * value);
  btnComenzar.size(200 * value, 200 * value);
  btnComenzar.style('background-color', 'blue');
  btnComenzar.style('color', 'white');
  btnComenzar.style('font-size', 30 * value + 'px');
  btnComenzar.style('border-radius', '100px');
  btnComenzar.style('border', 'none');
  btnComenzar.style('cursor', 'pointer');

  btnComenzar.mousePressed(() => {
    startGame = true;
    btnComenzar.hide();
  });
  btnReintentar = createButton('Volver a intentar');
  btnReintentar.position(width / 2 - 100 * value, height / 2);
  btnReintentar.size(200 * value, 100 * value);
  btnReintentar.style('background-color', 'red');
  btnReintentar.style('color', 'white');
  btnReintentar.style('font-size', 30 * value + 'px');
  btnReintentar.style('border-radius', '50px');
  btnReintentar.style('border', 'none');
  btnReintentar.style('cursor', 'pointer');
  btnReintentar.hide();
  btnReintentar.mousePressed(() => {
    reiniciarJuego();
    btnReintentar.hide();
  });
}
  btnUp = createButton('↑');
  btnUp.position(width / 2 - 60, height - 440);
  btnUp.size(120, 120);
  btnUp.touchStarted(() => isUp = true);
  btnUp.touchEnded(() => isUp = false);

  btnDown = createButton('↓');
  btnDown.position(width / 2 - 60, height - 240);
  btnDown.size(120, 120);
  btnDown.touchStarted(() => isDown = true);
  btnDown.touchEnded(() => isDown = false);

  btnLeft = createButton('←');
  btnLeft.position(width / 2 - 180, height - 340);
  btnLeft.size(120, 120);
  btnLeft.touchStarted(() => isLeft = true);
  btnLeft.touchEnded(() => isLeft = false);

  btnRight = createButton('→');
  btnRight.position(width / 2 + 60, height - 340);
  btnRight.size(120, 120);
  btnRight.touchStarted(() => isRight = true);
  btnRight.touchEnded(() => isRight = false);

  if (!isMobile) {
    btnUp.hide();
    btnDown.hide();
    btnLeft.hide();
    btnRight.hide();
  }

  textos[0].posX = windowWidth - 325 * value;
  textos[0].posY = windowHeight - 325 * value;
  textos[1].posX = windowWidth - 325 * value;
  textos[1].posY = windowHeight - 325 * value;

  DonGui = createSprite(windowWidth / 2, windowHeight / 2);
  DonGui.scale = value * 1.5;
  DonGui.setCollider('circle', 0, 0, 50);
  DonGui.debug = true;
  DonGui.addImage(PlayerIMG);

  Estacion = createSprite(windowWidth - 150 * value, windowHeight - 125 * value, 200, 200);
  Estacion.setCollider('circle', 0, 0, 25);
  Estacion.addImage(EstacionIMG);
  Estacion.scale = value * 3.5;
  Estacion.debug = true;
}

function draw() {
  background(SmartIMG);

  if (!startGame) {
    textFont("Montserrat");
    textSize(50 * value);
    fill("white");
    textAlign(CENTER, CENTER);
    text("Presiona 'Comenzar' para iniciar", width / 2, height / 2 - 150 * value);
    btnReintentar.hide();
    return;
  }

if (lost) {
    textFont("Montserrat");
    textSize(50 * value);
    fill("red");
    textAlign(CENTER, CENTER);
    text("¡Has perdido! Tocaste un ataque.", width / 2, height / 4);
    btnReintentar.show();
    return;
  } else {
    btnReintentar.hide();
  }
  Move();
  crearMuestra();
  createCafe();
  crearRisk1();
  crearRisk2();
  crearRisk3();
  Puntuacion();
  State();

  drawSprites();

  // Verificar colisiones con muestras
  for (let i = muestras.length - 1; i >= 0; i--) {
    let m = muestras[i];
    if (m.sprite.removed) {
      muestras.splice(i, 1);
      continue;
    }
    if (DonGui.overlap(m.sprite)) {
      if (m instanceof Risk1 || m instanceof Risk2 || m instanceof Risk3) {
        lost = true;
        startGame = false;
        destruirObjetos();
        Puntos = 0;
        MuestraCount = 0;
        countVirus = 0;
        countGlucemia = 0;
        countHipertension = 0;
        countHiperlipidemia = 0;
        m.sprite.remove();
        muestras.splice(i, 1);
        break;
      } else {
        m.sprite.remove();
        muestras.splice(i, 1);
        MuestraCount += m.getPoints();
        if (m instanceof Virus) countVirus++;
        else if (m instanceof Glucemia) countGlucemia++;
        else if (m instanceof Hipertension) countHipertension++;
        else if (m instanceof Hiperlipidemia) countHiperlipidemia++;
      }
    }
  }

  // Verificar colisiones con cafés
  for (let i = CafeG.length - 1; i >= 0; i--) {
    let c = CafeG[i];
    if (c.sprite.removed) {
      CafeG.splice(i, 1);
      continue;
    }
    if (DonGui.overlap(c.sprite)) {
      c.sprite.remove();
      CafeG.splice(i, 1);
      speedX *= 1.2;
      speedY *= 1.15;
    }
  }

  // Mostrar textos activos
  textos[2].posX = DonGui.position.x - 175 * value;
  textos[2].posY = DonGui.position.y - 50 * value;
  for (let i = 0; i < textos.length; i++) {
    if (textos[i].activo && textos[i].contador < FRAMES_MOSTRAR) {
      fill("white");
      textSize(37.5 * value);
      textFont('Montserrat');
      text(textos[i].mensaje, textos[i].posX, textos[i].posY);
      textos[i].contador++;
      if (textos[i].contador >= FRAMES_MOSTRAR) {
        textos[i].activo = false;
        textos[i].contador = 0;
      }
    }
  }

  textFont("Montserrat");
  textSize(75 * value);
  fill("red");
  textAlign(LEFT, TOP);
  text("Puntos: " + Puntos, 25 * value, 100 * value);

  if (frameCount < 500 && startGame) {
    textSize(30 * value);
    text("Deja aqui tus muestras", windowWidth - 325 * value, windowHeight - 225 * value);
  }
}

function reiniciarJuego() {
  lost = false;
  startGame = true;
  Puntos = 0;
  MuestraCount = 0;
  countVirus = 0;
  countGlucemia = 0;
  countHipertension = 0;
  countHiperlipidemia = 0;
  destruirObjetos();
  DonGui.position.x = windowWidth / 2;
  DonGui.position.y = windowHeight / 2;
  fase = 0;
}
function Move() {
  if (keyDown(UP_ARROW) || isUp) {
    DonGui.position.y -= speedY;
  }
  if (keyDown(DOWN_ARROW) || isDown) {
    DonGui.position.y += speedY;
  }
  if (keyDown(RIGHT_ARROW) || isRight) {
    DonGui.position.x += speedX;
  }
  if (keyDown(LEFT_ARROW) || isLeft) {
    DonGui.position.x -= speedX;
  }
  DonGui.position.x = constrain(DonGui.position.x, 0 + DonGui.width / 2, width - DonGui.width / 2);
  DonGui.position.y = constrain(DonGui.position.y, 0 + DonGui.height / 2, height - DonGui.height / 2);
}

// Clase para Virus
class Virus {
  constructor() {
    this.sprite = createSprite(Math.round(random(25 * value, windowWidth - 50 * value)), 50 * value);
    this.sprite.addImage(Muestra4IMG);
    this.sprite.velocityY = 7.5 * value;
    this.sprite.scale = value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;
  }
  getPoints() {
    return 1;
  }
}

// Clase para Cafe
class Cafe {
  constructor() {
    this.sprite = createSprite(Math.round(random(25 * value, windowWidth - 50 * value)), 50 * value);
    this.sprite.addImage(CafeIMG);
    this.sprite.velocityY = 12.5 * value;
    this.sprite.scale = 2 * value;
    this.sprite.lifetime = 200;
  }
}

// Clase para Glucemia
class Glucemia {
  constructor() {
    this.sprite = createSprite(Math.round(random(25 * value, windowWidth - 50 * value)), 50 * value);
    this.sprite.addImage(MuestraIMG);
    this.sprite.velocityY = 10 * value;
    this.sprite.scale = value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;
  }
  getPoints() {
    return 2;
  }
}

// Clase para Hipertension
class Hipertension {
  constructor() {
    this.sprite = createSprite(Math.round(random(25 * value, windowWidth - 50 * value)), 50 * value);
    this.sprite.addImage(Muestra3IMG);
    this.sprite.velocityY = 15 * value;
    this.sprite.scale = value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;
  }
  getPoints() {
    return 4;
  }
}

// Clase para Hiperlipidemia
class Hiperlipidemia {
  constructor() {
    this.sprite = createSprite(Math.round(random(25 * value, windowWidth - 50 * value)), 50 * value);
    this.sprite.addImage(Muestra2IMG);
    this.sprite.velocityY = 12.5 * value;
    this.sprite.scale = value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;
  }
  getPoints() {
    return 3;
  }
}

function crearMuestra() {
  if (frameCount % 75 === 0) {
    let nuevaMuestra;
    let rand = Math.round(random(1, 4));
    switch(rand) {
      case 1: 
        nuevaMuestra = new Virus();
        break;
      case 2: 
        nuevaMuestra = new Hiperlipidemia();
        break;
      case 3: 
        nuevaMuestra = new Hipertension();
        break;
      case 4: 
        nuevaMuestra = new Glucemia();
        break;
      default: break;
    }
    muestras.push(nuevaMuestra);
  }
}

function createCafe(){
  if (frameCount % 1000 === 0 && Puntos > 16) {
    let nuevoCafe = new Cafe();
    CafeG.push(nuevoCafe);
  }
}

class Risk1 {
  constructor() {
    this.sprite = createSprite(0, Math.round(random(windowHeight/2, windowHeight - 50 * value))); 
    this.sprite.addImage(Risk1IMG);  
    this.sprite.velocityX = 35 * value;  
    this.sprite.scale = 0.5 * value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;
  }
}

class Risk2 {
  constructor() {
    this.sprite = createSprite(windowWidth, Math.round(random(windowHeight/2, windowHeight - 50 * value))); 
    this.sprite.addImage(Risk1IMG); 
    this.sprite.velocityX = -40 * value;     
    this.sprite.scale = 0.5 * value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;  
  }
}

class Risk3 {
  constructor() {
    this.sprite = createSprite(Math.round(random(25 * value, windowWidth - 25 * value)), windowHeight); 
    this.sprite.addImage(Risk1IMG); 
    this.sprite.velocityY = -25 * value;  // Cambiado a Y para caer hacia arriba
    this.sprite.scale = 0.5 * value;
    this.sprite.setCollider('circle', 0, 0, 50);
    this.sprite.lifetime = 200;  
  }
}

function crearRisk1() {
  if (frameCount % 100 === 0 && Puntos > 8) {
    let nuevoAtaque = new Risk1();
    muestras.push(nuevoAtaque);
  }
}

function crearRisk2() {
  if (frameCount % 150 === 0 && Puntos > 30) {
    let nuevoAtaque = new Risk2();
    muestras.push(nuevoAtaque);
  }
}

function crearRisk3() {
  if (frameCount % 200 === 0 && Puntos > 50) {
    let nuevoAtaque = new Risk3();
    muestras.push(nuevoAtaque);
  }
}

function Puntuacion() {
  if (DonGui.overlap(Estacion) && fase > 0) {
    Puntos += MuestraCount;
    MuestraCount = 0; 
    countVirus = 0;
    countGlucemia = 0;
    countHipertension = 0;
    countHiperlipidemia = 0;
    let t = Math.round(random(1, 2));
    switch(t) {
      case 1:
        textos[0].activo = true;
        break;
      case 2:
        textos[1].activo = true;
        break;
      default: break;
    }
  }
}

function State() {
  if (fase == 0) {
    DonGui.addImage(PlayerIMG);
  } else if (fase == 1) {
    DonGui.addImage(Fase2);
  } else if (fase == 2) {
    DonGui.addImage(Fase3);
  } else if (fase == 3) {
    DonGui.addImage(Fase4);
  }
}

function destruirObjetos() {
  for (let i = muestras.length - 1; i >= 0; i--) {
    if (muestras[i].sprite) {
      muestras[i].sprite.remove();
    }
  }
  muestras = [];

  for (let i = CafeG.length - 1; i >= 0; i--) {
    if (CafeG[i].sprite) {
      CafeG[i].sprite.remove();
    }
  }
  CafeG = [];

  if (DonGui) {
    DonGui.position.x = windowWidth / 2;
    DonGui.position.y = windowHeight / 2;
  }
}

function clasesDistintasTomadas() {
  let clases = 0;
  if (countVirus > 0) clases++;
  if (countGlucemia > 0) clases++;
  if (countHipertension > 0) clases++;
  if (countHiperlipidemia > 0) clases++;
  return clases;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (isMobile) {
    value = windowHeight / 2000;
  } else {
    value = windowWidth / 2000;
  }

  btnUp.position(width / 2 - 40, height - 160);
  btnDown.position(width / 2 - 40, height - 60);
  btnLeft.position(width / 2 - 120, height - 110);
  btnRight.position(width / 2 + 40, height - 110);

  DonGui.position.x = windowWidth / 2;
  DonGui.position.y = windowHeight / 2;
  Estacion.position.x = windowWidth - 200;
  Estacion.position.y = windowHeight - 250;
  DonGui.scale = value * 1.5;
  Estacion.scale = value * 3.5;

  for (let i = 0; i < muestras.length; i++) {
    if (muestras[i] instanceof Virus ||
        muestras[i] instanceof Glucemia ||
        muestras[i] instanceof Hipertension ||
        muestras[i] instanceof Hiperlipidemia) {
      muestras[i].sprite.scale = 2 * value;
    } else if (muestras[i] instanceof Risk1 ||
               muestras[i] instanceof Risk2 ||
               muestras[i] instanceof Risk3) {
      muestras[i].sprite.scale = value;
    }
  }

  for (let i = 0; i < CafeG.length; i++) {
    CafeG[i].sprite.scale = 2 * value;
  }
}

function mousePressed() {
  if (!startGame || lost) {
    let botonX = width / 2;
    let botonY = height / 2;
    let radio = 100 * value;
    if (dist(mouseX, mouseY, botonX, botonY) < radio) {
      startGame = true;
      lost = false;
      btnComenzar.hide();
    }
  }
}

// Lógica para gestionar los estados de fases basada en las cuentas
function actualizarFase() {
  if (clasesDistintasTomadas() > 1) {
    countVirus = 0;
    countGlucemia = 0;
    countHipertension = 0;
    countHiperlipidemia = 0;
    MuestraCount = 0;
    textos[2].activo = true;
  }

  if (countGlucemia == 0 && countHiperlipidemia == 0 && countHipertension == 0 && countVirus == 0) {
    fase = 0;
  } else if (countGlucemia == 1 || countHiperlipidemia == 1 || countHipertension == 1 || countVirus == 1) {
    fase = 1;
  } else if (countGlucemia == 2 || countHiperlipidemia == 2 || countHipertension == 2 || countVirus == 2) {
    fase = 2;
  } else if (countGlucemia == 3 || countHiperlipidemia == 3 || countHipertension == 3 || countVirus == 3) {
    fase = 3;
  } else if (countGlucemia > 3 || countHiperlipidemia > 3 || countHipertension > 3 || countVirus > 3) {
    fase = 0;
    countVirus = 0;
    countGlucemia = 0;
    countHipertension = 0;
    countHiperlipidemia = 0;
    MuestraCount = 0;
  }
}

// Llamar actualizarFase cada cuadro para mantener actualizada la fase
function lateUpdate() {
  actualizarFase();
}

// Llamar lateUpdate al final de draw para sincronizar estado
function draw() {
  background(SmartIMG);

  if (!startGame) {
    textFont("Montserrat");
    textSize(50 * value);
    fill("black");
    textAlign(CENTER, CENTER);
    text("Presiona 'Comenzar' para iniciar", width / 2, height / 2 - 150 * value);
    return;
  }

  if (lost) {
    textFont("Montserrat");
    textSize(50 * value);
    fill("red");
    textAlign(CENTER, CENTER);
    text("¡Has perdido! Tocaste un ataque.", width / 2, height / 4);
    return;
  }

  Move();
  crearMuestra();
  createCafe();
  crearRisk1();
  crearRisk2();
  crearRisk3();
  Puntuacion();
  State();

  drawSprites();

  // Chequeo colisión y recolecta
  for (let i = muestras.length - 1; i >= 0; i--) {
    let m = muestras[i];
    if (m.sprite.removed) {
      muestras.splice(i, 1);
      continue;
    }
    if (DonGui.overlap(m.sprite)) {
      if (m instanceof Risk1 || m instanceof Risk2 || m instanceof Risk3) {
        lost = true;
        startGame = false;
        destruirObjetos();
        Puntos = 0;
        MuestraCount = 0;
        countVirus = 0;
        countGlucemia = 0;
        countHipertension = 0;
        countHiperlipidemia = 0;
        m.sprite.remove();
        muestras.splice(i, 1);
        break;
      } else {
        m.sprite.remove();
        muestras.splice(i, 1);
        MuestraCount += m.getPoints();
        if (m instanceof Virus) countVirus++;
        else if (m instanceof Glucemia) countGlucemia++;
        else if (m instanceof Hipertension) countHipertension++;
        else if (m instanceof Hiperlipidemia) countHiperlipidemia++;
      }
    }
  }

  for (let i = CafeG.length - 1; i >= 0; i--) {
    let c = CafeG[i];
    if (c.sprite.removed) {
      CafeG.splice(i, 1);
      continue;
    }
    if (DonGui.overlap(c.sprite)) {
      c.sprite.remove();
      CafeG.splice(i, 1);
      speedX *= 1.2;
      speedY *= 1.15;
    }
  }

  textos[2].posX = DonGui.position.x - 175 * value;
  textos[2].posY = DonGui.position.y - 50 * value;
  for (let i = 0; i < textos.length; i++) {
    if (textos[i].activo && textos[i].contador < FRAMES_MOSTRAR) {
      fill("black");
      textSize(37.5 * value);
      textFont('Montserrat');
      text(textos[i].mensaje, textos[i].posX, textos[i].posY);
      textos[i].contador++;
      if (textos[i].contador >= FRAMES_MOSTRAR) {
        textos[i].activo = false;
        textos[i].contador = 0;
      }
    }
  }

  textFont("Montserrat");
  textSize(75 * value);
  fill("red");
  textAlign(LEFT, TOP);
  text("Puntos: " + Puntos, 25 * value, 100 * value);

  if (frameCount < 500 && startGame) {
    textSize(30 * value);
    text("Deja aqui tus muestras", windowWidth - 325 * value, windowHeight - 225 * value);
  }

  lateUpdate();
}


