document.addEventListener("DOMContentLoaded", () => {
  // console.log(gsap); /**Gasp: Professional-grade JavaScript animation for the modern web */

  /**variabes declaration */
  var canvas;
  var c, x, y, scoreEl, startGameBtn, players, submitSuccessAlert, savePointBtn;


  canvas = document.querySelector("canvas");

  startGameBtn = document.querySelector("#startGameBtn");
  scoreEl = document.querySelector("#scoreEl");
  savePointBtn = document.getElementById("savePointBtn");
  submitSuccessAlert = document.getElementById("submitSuccessAlert");
  players = document.getElementById("players");

  
  if (canvas) {
    c = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }


  if (savePointBtn) savePointBtn.style.display = "none";
  if (submitSuccessAlert) submitSuccessAlert.style.display = "none";

  // const modalEl = document.querySelector("#modalEl");
  // const bigScoreEl = document.querySelector("#bigScoreEl");

  //   console.log(scoreEl);
  scoreEl ? console.log(scoreEl) : null;

  // console.log(c);

  /* player class */
  class Player {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }

    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      c.closePath();
    }
  }

  /* projectile class */
  class Projectile {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
    update() {
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }

  /* Enemy class */
  class Enemy {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
    update() {
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }

  /* Particle class */
  const friction = 0.99;
  class Particle {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
      this.alpha = 1;
    }
    draw() {
      c.save();
      c.globalAlpha = this.alpha;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      /* end code block begining with save() */
      c.restore();
    }
    update() {
      this.draw();
      this.velocity.x *= friction;
      this.velocity.y *= friction;
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
      this.alpha -= 0.01;
    }
  }

  if (canvas) {
    x = canvas.width / 2;
    y = canvas.height / 2;
  }

  let player = new Player(x, y, 10, "white");
  /* multiple projectiles */
  let projectiles = [];
  /* multiple enemies */
  let enemies = [];
  /* multiple particles */
  let particles = [];

  /* create init function */
  function init() {
    player = new Player(x, y, 10, "white");
    /* multiple projectiles */
    projectiles = [];
    /* multiple enemies */
    enemies = [];
    /* multiple particles */
    particles = [];

    /* set score to 0, when init() function is called */
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
  }

  scoreEl ? console.log(scoreEl) : null;
  /* Spawn enemies */
  function spawnEnemies() {
    setInterval(() => {
      /* radius of different sizes */
      const radius = Math.random() * (30 - 4) + 4;

      let x;
      let y;
      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }
      /* random enemies colors */
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
  }

  let animationId;
  let score = 0;

  console.log(scoreEl);

  function animate() {
    animationId = requestAnimationFrame(animate);
    /* color the background */
    c.fillStyle = "rgba(0,0,0,0.1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    /* remove particles from screen */
    particles.forEach((element, index) => {
      if (element.alpha <= 0) {
        particles.splice(index, 1);
      } else {
        element.update();
      }
    });
    particles.forEach((particle) => {
      particle.update();
    });
    projectiles.forEach((projectile, projectileIndex) => {
      projectile.draw();
      projectile.update();
      /* remove projectiles from edges of the screen */
      if (
        projectile.x - projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        setTimeout(() => {
          projectiles.splice(projectileIndex, 1);
        }, 0);
      }
    });

    /* draw enemies */
    enemies.forEach((enemy, index) => {
      enemy.draw();
      enemy.update();
      /* check enemies - player collision */
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      // end game
      if (dist - enemy.radius - player.radius < 1) {
        cancelAnimationFrame(animationId);
        modalEl.style.display = "flex";
        bigScoreEl.innerHTML = score;
        savePointBtn.style.display = "block";
      }
      /* check projectiles enemies collision */
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        // when projectiles touch enemy
        if (dist - enemy.radius - projectile.radius < 1) {
          /* multiple particles (explosions) */
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(
                projectile.x,
                projectile.y,
                Math.random() * 2,
                enemy.color,
                {
                  x: (Math.random() - 0.5) * (Math.random() * 6),
                  y: (Math.random() - 0.5) * (Math.random() * 6),
                }
              )
            );
          }

          if (enemy.radius - 10 > 5) {
            /* update score */
            score += 100;
            scoreEl.innerHTML = score;

            /* using gsap */
            gsap?.to(enemy, {
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              projectiles.splice(projectileIndex, 1);
            }, 0);
          } else {
            setTimeout(() => {
              /* update score */
              score += 250;
              scoreEl.innerHTML = score;

              enemies.splice(index, 1);
              projectiles.splice(projectileIndex, 1);
            }, 0);
          }
        }
      });
    });
  }
  addEventListener("click", (event) => {
    if (!canvas) return;
    const angle = Math.atan2(
      event.clientY - canvas.height / 2,
      event.clientX - canvas.width / 2
    );
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
    );
  });

  /* start game */

  if (startGameBtn) {
    startGameBtn.addEventListener("click", (event) => {
      /* restart the game with the init function */
      init();
      modalEl.style.display = "none";
      submitSuccessAlert.style.display = "none";
      savePointBtn.style.display = "none";
      animate();
      spawnEnemies();
    });
  }

  /**Submit score points: HTTP request */
  if (savePointBtn) {
    savePointBtn.addEventListener("click", () => {
      var http = new XMLHttpRequest();

      http.onreadystatechange = () => {
        if (http.readyState == 4 && http.status == 200) {
          console.log(JSON.parse(http.response));
          submitSuccessAlert.style.display = "block";
          savePointBtn.style.display = "none";
        }
      };

      http.open("POST", "http://localhost:8001/user-account/score-point", true);
      let data = {
        scorePoint: score,
      };
      http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      http.send(JSON.stringify(data));
    });
  }

  /**GET score points for players: HTTP request */
  function fetchLeaderboardPlayers() {
    var http = new XMLHttpRequest();
    let content;
    http.onreadystatechange = () => {
      if (http.readyState == 4 && http.status == 200) {
        let list = JSON.parse(http.response);

        content = `<ul role="list" class="divide-y divide-gray-100">`;
        for (let index = 0; index < list.userAccounts.length; index++) {
          const element = list.userAccounts[index];

          content += `
          <li class="flex justify-between gap-x-6 py-3">
              <div class="flex gap-x-4">
                  <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                  <div class="min-w-0 flex-auto">
                      <p class="text-sm font-semibold leading-6 text-white">${
                        element?.name
                      }</p>
                      <p class="mt-1 truncate text-xs leading-5 text-gray-500">${
                        element?.isOnline ? "online" : "offline"
                      }</p>
                  </div>
              </div>
              <div class="hidden sm:flex sm:flex-col sm:items-end">
                  <p class="text-sm leading-6 text-white">${
                    element?.scorePoint
                  }</p>
              </div>
          </li>
          `;
        }

        content += "</ul>";

        if (!players) return;
        players.innerHTML = content;
      }
    };

    http.open("GET", "http://localhost:8001/leaderboard/players", true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send();
  }

  fetchLeaderboardPlayers();
});
