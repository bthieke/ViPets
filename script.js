"use strict";

let pet = {
  alive: true,
  happy: true,
  sick: false,
  nightmode: false,

  // progress-values
  _hunger: 100,
  get hunger() {
    return this._hunger;
  },
  set hunger(value) {
    if (value > 100) {
      this._hunger = 100;
    } else if (value <= 0) {
      this._hunger = 0;
      this.alive = false;
    } else {
      this._hunger = value;
    }

    let hungerProgress = document.querySelector(".hunger-bar");
    hungerProgress.value = value;
  },

  _energy: 100,
  get energy() {
    return this._energy;
  },
  set energy(value) {
    if (value > 100) {
      this._energy = 100;
    } else if (value <= 0) {
      this._energy = 0;
      this.alive = false;
    } else {
      this._energy = value;
    }
    let energyProgress = document.querySelector(".energy-bar");
    energyProgress.value = value;
  },

  _hygiene: 100,
  get hygiene() {
    return this._hygiene;
  },
  set hygiene(value) {
    if (value > 100) {
      this._hygiene = 100;
    } else if (value <= 0) {
      this._hygiene = 0;
      this.alive = false;
    } else {
      this._hygiene = value;
    }
    let hygieneProgress = document.querySelector(".hygiene-bar");
    hygieneProgress.value = this._hygiene;
  },

  _fun: 100,
  get fun() {
    return this._fun;
  },
  set fun(value) {
    if (value > 100) {
      this._fun = 100;
    } else if (value <= 0) {
      this._fun = 0;
      this.alive = false;
    } else {
      this._fun = value;
    }
    let funProgress = document.querySelector(".fun-bar");
    funProgress.value = this._fun;
  },

  //game-methods
  checkSickness() {
    let randomNumber = Math.trunc(Math.random() * 100 + 1);

    let probability = 100 - this.hunger;
    if (randomNumber <= probability) {
      this.sick = true;
    }
    setTimeout(() => {
      this.checkSickness();
    }, 10000);
  },

  cureSickness() {
    if (pet.sick) {
      pet.sick = false;
    }
  },

  updatePetStatus() {
    let screenHeading = document.querySelector(".screen-heading");
    let petIcon = document.querySelector(".pet-icon");
    let source;
    if (!this.alive) {
      source = "tombstone";
      screenHeading.textContent = "Game Over!";
    } else if (!this.fun) {
      source = "exit-door";
      screenHeading.innerHTML = "You are too boring.";
    } else if (this.sick && this.nightmode) {
      source = "sleeping-sick";
    } else if (this.sick) {
      source = "sick";
    } else if (this.nightmode) {
      source = "sleeping";
    } else if (this.hunger <= 50 || this.energy <= 50 || this.hygiene <= 50 || this.fun <= 50) {
      source = "sad";
    } else {
      source = "happy";
    }
    petIcon.src = "assets/" + source + ".svg";
    petIcon.alt = "Pet Icon: " + source;
  },

  startProgressInterval() {
    setInterval(() => {
      if (this.alive === true) {
        this.hunger -= 2;
        this.hygiene -= 2;
        this.fun -= 2;

        if (!this.sick && this.nightmode) {
          this.energy += 20;
        } else if (this.sick && this.nightmode) {
          this.energy += 0;
        } else if (this.sick && !this.nightmode) {
          this.energy -= 5;
        } else {
          this.energy -= 2;
        }
      }

      this.checkSmell();
      this.updatePetStatus();
    }, 1000);
  },

  // button-methods
  feed() {
    if (this.alive && !this.nightmode) {
      this.hunger += 20;
    }
  },

  poopContainer: document.querySelector(".poop-container"),
  poopCounter: 0,
  addPoop() {
    if (pet.alive) {
      const poopIcon = document.createElement("img");
      poopIcon.src = "assets/poop.svg";
      poopIcon.alt = "pet poop";

      this.poopCounter++;
      if (this.poopCounter > 12) {
        this.poopCounter = 12;
      } else if (this.poopCounter < 0) {
        this.poopCounter = 0;
      } else if (this.poopCounter % 3 === 0 && this.poopCounter > 0) {
        this.poopContainer.appendChild(poopIcon);
        poopSound();
      } else {
        this.poopCounter;
      }
      console.log(this.poopCounter);
    }
  },

  toggleNightmode() {
    if (this.alive) {
      if (this.nightmode) {
        this.nightmode = false;
        nightmodeBtnIcon.src = "assets/sun.svg";
        nightmodeBtnIcon.alt = "sun";
      } else {
        this.nightmode = true;
        nightmodeBtnIcon.src = "assets/moon.svg";
        nightmodeBtnIcon.alt = "moon";
      }
    }
  },

  clean() {
    let wavesIcon = document.querySelector(".waves-icon");
    let animationRunning = false;

    function startAnimation() {
      animationRunning = true;
    }

    function endAnimation() {
      animationRunning = false;
      wavesIcon.style.animation = "";

      if (pet.alive && !pet.nightmode) {
        pet.hygiene += 20;

        //TODO: setter für poopCounter? add clickable variable?
        if (pet.poopCounter >= 3) {
          pet.poopCounter -= 3;
          pet.poopContainer.removeChild(pet.poopContainer.lastChild);
        }
      }

      wavesIcon.removeEventListener("animationend", endAnimation);
      console.log(pet.poopCounter);
    }

    if (!animationRunning && pet.alive && !pet.nightmode) {
      wavesIcon.style.animation = "moveDown 1.5s linear";

      wavesIcon.addEventListener("animationstart", startAnimation);
      wavesIcon.addEventListener("animationend", endAnimation);
    }
  },

  play() {
    if (pet.alive && !pet.nightmode) {
      pet.fun += 20;
    }
  },

  checkSmell() {
    const smellIcon = document.querySelector(".smell-icon");
    let smell = true;
    if (pet.hygiene <= 50 && pet.fun) {
      smell = true;
      smellIcon.style.visibility = "visible";
      smellIcon.alt = "smell";
    } else {
      smell = false;
      smellIcon.style.visibility = "hidden";
      smellIcon.removeAttribute("alt");
    }
  },
};

//Button Sounds

function clickSound() {
  let clickSound = document.querySelector(".click-sound");
  clickSound.play();
}

function errorSound() {
  let errorSound = document.querySelector(".error-sound");
  errorSound.play();
}

function poopSound() {
  let poopSound = document.querySelector(".poop-sound");
  poopSound.play();
}

//TODO: Add another sound for cleaning
function cleanSound() {
  let cleanSound = document.querySelector(".water-sound");
  cleanSound.play();
}

function CheckSound() {
  if (pet.nightmode) {
    errorSound();
  } else {
    clickSound();
  }
}

//Buttons

const feedBtn = document.querySelector(".feed-btn");
feedBtn.addEventListener("click", function () {
  CheckSound();
  pet.feed();
  if (!pet.nightmode) {
    pet.addPoop();
  }
});

const nightmodeBtn = document.querySelector(".nightmode-btn");
const nightmodeBtnIcon = document.querySelector(".nightmode-icon");
nightmodeBtn.addEventListener("click", function () {
  clickSound();
  pet.toggleNightmode();
});

const cleanBtn = document.querySelector(".clean-btn");
cleanBtn.addEventListener("click", function () {
  CheckSound();
  pet.clean();
});

const playBtn = document.querySelector(".play-btn");
playBtn.addEventListener("click", function () {
  CheckSound();
  pet.play();
});

const healBtn = document.querySelector(".heal-btn");
healBtn.addEventListener("click", function () {
  if (pet.sick) {
    clickSound();
    pet.sick = false;
  } else {
    errorSound();
  }
});

pet.startProgressInterval();
pet.checkSmell();
pet.checkSickness();
pet.updatePetStatus();
