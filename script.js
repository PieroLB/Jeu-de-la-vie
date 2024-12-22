// Règles :
//   - SURVIE = si la case noire est entourée de 2 ou 3 cases noires
//   - MEURT = si la case noire est entourée de moins de 2 cases noires ou  si la case est entourée de plus de 3 cases noires
//   - NAISSANCE = si une case blanche est entourée d'exactement 3 cases noires

document.getElementById("start").addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const ctx = canvas.getContext("2d");

  const caseSize = parseInt(document.getElementById("caseSize").value);
  const nCaseWidth = Math.floor(innerWidth / caseSize);
  const nCaseHeight = Math.floor(innerHeight / caseSize);
  var grid = Array(nCaseHeight)
    .fill(0)
    .map(() => Array(nCaseWidth).fill(0));
  var n = 0;
  var running = false;
  document.getElementById("play").addEventListener("click", function () {
    running = !running;
    this.textContent = running ? "PAUSE" : "PLAY";
    document.getElementById("nextStep").style.display = running
      ? "none"
      : "block";
  });
  document.getElementById("nextStep").addEventListener("click", () => {
    if (!running) {
      step();
      updateCanvas();
    }
  });

  let t = Date.now();
  const update = () => {
    requestAnimationFrame(update);
    if (running) {
      if (
        Date.now() - t >=
        parseInt(document.getElementById("time").value) * 1000
      ) {
        step();
        t = Date.now();
      }
      updateCanvas();
    }
  };

  const updateCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBoxes();
    showGrid();
  };

  const showGrid = () => {
    ctx.strokeStyle = "red";
    for (let y = 0; y <= innerHeight; y += caseSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(innerWidth, y);
      ctx.stroke();
    }
    for (let x = 0; x <= innerWidth; x += caseSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, innerHeight);
      ctx.stroke();
    }
  };

  const showBoxes = () => {
    let x = 0;
    let y = 0;
    for (const l of grid) {
      for (const c of l) {
        ctx.fillStyle = c == 1 ? "#332f2f" : "white";
        ctx.fillRect(x, y, caseSize, caseSize);
        x += caseSize;
      }
      x = 0;
      y += caseSize;
    }
  };

  const step = () => {
    n++;
    document.getElementById("step").textContent = n;
    let newGrid = JSON.parse(JSON.stringify(grid));
    for (let l = 0; l < nCaseHeight; l++) {
      for (let c = 0; c < nCaseWidth; c++) {
        // Calcul of the number of boxes alived around me
        let n = 0;
        if (l > 0 && c > 0 && grid[l - 1][c - 1] == 1) n++; // Top Left
        if (l > 0 && grid[l - 1][c] == 1) n++; // Top Middle
        if (l > 0 && c < grid.length - 1 && grid[l - 1][c + 1] == 1) n++; // Top Right
        if (c < grid.length - 1 && grid[l][c + 1] == 1) n++; // Middle Right
        if (
          c < grid.length - 1 &&
          l < grid.length - 1 &&
          grid[l + 1][c + 1] == 1
        )
          n++; // Bottom Right
        if (l < grid.length - 1 && grid[l + 1][c] == 1) n++; // Bottom Middle
        if (l < grid.length - 1 && c > 0 && grid[l + 1][c - 1] == 1) n++; // Bottom Left
        if (c > 0 && grid[l][c - 1] == 1) n++; // Middle Left

        // Birth
        if (grid[l][c] == 0 && n == 3) {
          newGrid[l][c] = 1;
        }
        // Death
        else if (grid[l][c] == 1 && (n < 2 || n > 3)) {
          newGrid[l][c] = 0;
        }
      }
    }
    grid = newGrid;
  };

  const fillRandomly = () => {
    for (let l = 0; l < nCaseHeight; l++) {
      for (let c = 0; c < nCaseWidth; c++) {
        grid[l][c] = Math.random() >= 0.5 ? 1 : 0;
      }
    }
  };

  fillRandomly();
  update();
  updateCanvas();
  document.getElementById("parameters").remove();
  document.getElementById("ui").style.display = "block";
});

// var grid = [];
// var largeur;
// function drawGrid(size) {
//   size = size == "" || size <= 0 ? 10 : size;
//   gridElement.innerHTML = "";
//   grid = [];
//   for (let l = 1; l <= size; l++) {
//     let lineElement = document.createElement("tr");
//     gridElement.appendChild(lineElement);
//     let line = [];
//     for (let c = 1; c <= size; c++) {
//       let box = document.createElement("td");
//       box.addEventListener("click", function () {
//         if (this.style.backgroundColor == "black") {
//           this.style.backgroundColor = "white";
//         } else {
//           this.style.backgroundColor = "black";
//         }
//       });
//       ligne.appendChild(cas);
//     }
//     grid.push(line);
//   }
// }

// var liste1 = [];
// document.getElementById("input-random").addEventListener("input", () => {
//   fillRandom();
// });
// function fillRandom() {
//   if (document.getElementById("input-random").checked == true) {
//     for (let l = 1; l <= largeur; l++) {
//       liste1.push([]);
//       for (let c = 1; c <= largeur; c++) {
//         r = Math.round(Math.random());
//         liste1[l - 1].push(r);
//         if (r == 1) {
//           document.getElementById("case-" + l + "-" + c).style.background =
//             "black";
//         }
//       }
//     }
//   } else {
//     liste1 = [];
//     for (let l = 1; l <= largeur; l++) {
//       liste1.push([]);
//       for (let c = 1; c <= largeur; c++) {
//         document.getElementById("case-" + l + "-" + c).style.backgroundColor ==
//           "white";
//         liste1[l - 1].push(0);
//       }
//     }
//   }
// }

// function valider() {
//   if (document.getElementById("input-random").checked == true) {
//     for (let l = 1; l <= largeur; l++) {
//       liste1.push([]);
//       for (let c = 1; c <= largeur; c++) {
//         r = Math.round(Math.random());
//         liste1[l - 1].push(r);
//         if (r == 1) {
//           document.getElementById("case-" + l + "-" + c).style.background =
//             "black";
//         }
//       }
//     }
//   } else {
//     for (let l = 1; l <= largeur; l++) {
//       liste1.push([]);
//       for (let c = 1; c <= largeur; c++) {
//         if (
//           document.getElementById("case-" + l + "-" + c).style
//             .backgroundColor == "black"
//         ) {
//           liste1[l - 1].push(1);
//         } else {
//           liste1[l - 1].push(0);
//         }
//       }
//     }
//   }
//   // console.log(liste1);
//   document.getElementById("div-parametrage").style.display = "none";
//   document.getElementById("button-valider").style.display = "none";
//   document.getElementById("div-gestion").style.display = "";
// }

// var boucle;
// var tempsBoucle;
// // setInterval(()=>{
// //     if (document.getElementById('input-tempsBoucle').value == "") {
// //         tempsBoucle = 0;
// //     }
// //     else {
// //         tempsBoucle = document.getElementById('input-tempsBoucle').value*1000;
// //     }
// // });
// function play(button) {
//   if (button.textContent == "PLAY") {
//     button.textContent = "STOP";

//     boucle = setInterval(function () {
//       tour();
//     }, tempsBoucle);
//   } else {
//     button.textContent = "PLAY";
//     if (boucle != "") {
//       clearInterval(boucle);
//     }
//   }
// }

// var n = 0;
// var liste2 = [];
// function tour() {
//   n++;
//   document.getElementById("label-iteration").textContent = n;
//   // var nl = -1;
//   for (let nl = 0; nl <= liste1.length - 1; nl++) {
//     // nl += 1;
//     liste2.push([]);
//     // var nc = -1;
//     for (let nc = 0; nc <= liste1[nl].length - 1; nc++) {
//       // nc += 1;
//       liste2[nl].push("");
//       nb = 0;
//       nn = 0;
//       // Case de gauche
//       if (nc != 0) {
//         if (liste1[nl][nc - 1] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       // Case de droite
//       if (nc != largeur - 1) {
//         if (liste1[nl][nc + 1] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       //Case du haut
//       if (nl != 0) {
//         if (liste1[nl - 1][nc] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       // Case du bas
//       if (nl != largeur - 1) {
//         if (liste1[nl + 1][nc] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       // Case en haut à gauche
//       if (nc != 0 && nl != 0) {
//         if (liste1[nl - 1][nc - 1] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       // Case en haut à droite
//       if (nc != largeur - 1 && nl != 0) {
//         if (liste1[nl - 1][nc + 1] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       // Case en bas à gauche
//       if (nc != 0 && nl != largeur - 1) {
//         if (liste1[nl + 1][nc - 1] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       // Case en bas à droite
//       if (nc != largeur - 1 && nl != largeur - 1) {
//         if (liste1[nl + 1][nc + 1] == 0) {
//           nb += 1;
//         } else {
//           nn += 1;
//         }
//       }
//       if (liste1[nl][nc] == 1) {
//         // MORT
//         if (nn < 2 || nn > 3) {
//           liste2[nl][nc] = 0;
//         }
//         // SURVIE
//         else {
//           liste2[nl][nc] = 1;
//         }
//       } else {
//         // NAISSANCE
//         if (nn == 3) {
//           liste2[nl][nc] = 1;
//         }
//         // RESTE BLANCHE
//         else {
//           liste2[nl][nc] = 0;
//         }
//       }
//     }
//   }
//   for (let nl = 0; nl <= liste2.length - 1; nl++) {
//     for (let nc = 0; nc <= liste2[nl].length - 1; nc++) {
//       // console.log()
//       if (liste2[nl][nc] == 0) {
//         document.getElementById(
//           "case-" + (nl + 1) + "-" + (nc + 1)
//         ).style.backgroundColor = "white";
//       } else {
//         document.getElementById(
//           "case-" + (nl + 1) + "-" + (nc + 1)
//         ).style.backgroundColor = "black";
//       }
//     }
//   }
//   liste1 = liste2;
//   liste2 = [];
// }

// const canvas = document.getElementById("grille");
// const ctx = canvas.getContext("2d");

// // var zoom = parseFloat(localStorage.getItem("zoom")) || 1
// var CASE_SIZE = 50;
// const drawGrille = ()=>{
//     ctx.strokeStyle = "white";

//     for (let y = CASE_SIZE; y < canvas.height; y += CASE_SIZE) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//         ctx.stroke();
//     }

//     for (let x = CASE_SIZE; x < canvas.width; x += CASE_SIZE) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//         ctx.strokeStyle = "white";
//         ctx.stroke();
//     }
// }

// const ZOOM_SPEED = 5;
// canvas.addEventListener('wheel', (event)=>{
//     let delta = event.deltaY || event.detail || event.wheelDelta;
//     if (delta < 0 && CASE_SIZE < 100){
//         CASE_SIZE += ZOOM_SPEED;
//     }
//     else if (delta > 0 && CASE_SIZE > 10){
//         CASE_SIZE -= ZOOM_SPEED;
//     }
//     // localStorage.setItem("zoom", zoom);
// });
// canvas.addEventListener('contextmenu', (event)=>{
//     event.preventDefault();
// });
// var prevMouseX, prevMouseY;
// canvas.addEventListener('mousedown', (event)=>{
//     canvas.style.cursor = 'move';
//     if (event.buttons === 2) { // Clic droit
//         // Vérifiez si les coordonnées précédentes de la souris existent
//         if (prevMouseX && prevMouseY) {
//             // Calcule le déplacement de la souris
//             var deltaX = event.clientX - prevMouseX;
//             var deltaY = event.clientY - prevMouseY;

//             // Applique le déplacement au canvas
//             canvas.style.marginLeft = (canvas.offsetLeft + deltaX) + 'px';
//             canvas.style.marginTop = (canvas.offsetTop + deltaY) + 'px';
//         }

//         // Met à jour les coordonnées précédentes de la souris
//         prevMouseX = event.clientX;
//         prevMouseY = event.clientY;
//     } else {
//         // Si le clic droit est relâché, réinitialise les coordonnées précédentes de la souris
//         prevMouseX = null;
//         prevMouseY = null;
//     }
// });

// const update = ()=>{
//     requestAnimationFrame(update);

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     canvas.width = innerWidth;
//     canvas.height = innerHeight;

//     // ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
//     drawGrille();

// }

// // canvas.width = innerWidth;
// // canvas.height = innerHeight;
// // drawGrille();

// update();
