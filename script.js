const DINOSAUR = document.getElementById('dinosaur');
const currentScoreText = document.getElementById("score").textContent;
const highestScoreText = document.getElementById("theHighestScore").textContent;
const obstaclesDown = document.getElementsByClassName("obstaclesDown");
const obstaclesUp = document.getElementsByClassName("obstaclesUp");
const VERIFICATION_INTERVAL = 10;
const GAME_HEIGHT = 120;
const TEN_SECONDS = 100;
const TWELVE_SECONDS = 120;
const UPWARD = 0.1;
const DOWNWARD = 0;
const MILLISECOND_INTERVAL = 100;
const OBSTACLE_START_POSITION = 350;
const MINIMUM_OBSTACLE_SPACING = 12;
const OBSTACLE_UPDATE_INTERVAL = 10;
const LIFT_SPEED = 1.5;
const DOWN_SPEED = 2;
let gameActive = false;
let restartGame = false;
let dinosaurIsJumping = false;
let score = 0;
let lastObstacleScore = 0;
let level = 0;
let movementSpeed = 2;
let timeBetweenObstacles = 25;
let obstacleUpdateInterval;
let highestScore = 0;

function updateScore() {
    setInterval(function () {
        if (gameActive) {
            ++score;
            let lengthOfScore = (score + "").length;
            let newTextScore = currentScoreText.slice(0, -lengthOfScore);
            document.getElementById("score").innerHTML = newTextScore + score;
            checkLevelUp();
        }
    }, MILLISECOND_INTERVAL);
}

function checkAndUpdateHighestScore() {
    if (!gameActive && score !== 0) {
        if (highestScore < score) {
            highestScore = score;
        }
    }
    let lengthOfScore = (highestScore + "").length;
    let newTextHighestScore = highestScoreText.slice(0, -lengthOfScore);
    document.getElementById("theHighestScore").innerHTML = newTextHighestScore + highestScore;
    score = 0;
}

function checkLevelUp() {
    if (score % TEN_SECONDS === 0 && score > 99) {
        document.getElementById('levelUp').style.visibility = 'visible';
        timeBetweenObstacles = Math.max(timeBetweenObstacles - 1, MINIMUM_OBSTACLE_SPACING);
        ++level;
        return true;
    } else if (score % TWELVE_SECONDS === 0) {
        document.getElementById('levelUp').style.visibility = 'hidden';
        return false;
    }
}

function jumpDinosaur() {
    let heightOfTheJump = parseInt(window.getComputedStyle(DINOSAUR).top);
    let jumpHeight = GAME_HEIGHT;
    let jumpDirection = UPWARD;
    let jumpSpeed = LIFT_SPEED;

    jumpInterval = setInterval(function () {
        dinosaurIsJumping = true;
        if (jumpHeight === DOWNWARD) {
            jumpDirection = DOWNWARD;
        }
        if (jumpDirection === UPWARD) {
            jumpHeight -= jumpSpeed;
            DINOSAUR.style.top = jumpHeight + 'px';
        } else {
            jumpSpeed = DOWN_SPEED;
            jumpHeight += jumpSpeed;
            DINOSAUR.style.top = jumpHeight + 'px';
            if (jumpHeight === GAME_HEIGHT) {
                clearInterval(jumpInterval);
                dinosaurIsJumping = false;
            }
        }
    }, VERIFICATION_INTERVAL);
}

let lastSpawnTime = 0;

function spawnObstacle(timestamp) {
    if (!gameActive) return;
    if (!lastSpawnTime) {
        lastSpawnTime = timestamp;
    }
    const timeSinceLastSpawn = timestamp - lastSpawnTime;

    if (timeSinceLastSpawn >= timeBetweenObstacles * 100) {
        if (level >= 2) {
            let obstacle = getRandomInt(2);
            if (obstacle === 1) {
                createObstaclesUp();
            } else {
                createObstaclesDown();
            }
        } else {
            createObstaclesDown();
        }
        lastSpawnTime = timestamp;
    }
    requestAnimationFrame(spawnObstacle);
}



function updateObstaclePosition() {
    obstacleUpdateInterval = setInterval(function () {
        changeObstaclePosition();
        dinosaurHitsAnObstacle();
    }, OBSTACLE_UPDATE_INTERVAL);
}

function createObstacle(type) {
    const obstacle = document.createElement('div');
    obstacle.classList.add(type);
    obstacle.style.left = OBSTACLE_START_POSITION + 'px';
    document.getElementById('dinosaurGame').appendChild(obstacle);
}

function createObstaclesDown() {
    createObstacle('obstaclesDown');
}

function createObstaclesUp() {
    createObstacle('obstaclesUp');
}

function changeObstaclePosition() {
    changeObstaclePositionForClass('obstaclesDown', 'obstaclesUp');
    changeObstaclePositionForClass('obstaclesUp', 'obstaclesDown');
}

function changeObstaclePositionForClass(obstacleClass, otherObstacles) {
    const obstacles = Array.from(document.getElementsByClassName(obstacleClass));
    let removedObstacle = false;

    for (let i = 1; i < obstacles.length; ++i) {
        let left = parseInt(window.getComputedStyle(obstacles[i]).left);
        if (left <= -800) {
            obstacles[i].remove();
            removedObstacle = true;
            break;
        } else {
            obstacles[i].style.left = (left - movementSpeed) + 'px';
        }
    }

    if (removedObstacle) {
        const secondaryObstacles = Array.from(document.getElementsByClassName(otherObstacles));
        moveObstaclesLeft(obstacles, 42);
        moveObstaclesLeft(secondaryObstacles, 42);
    }
}

function moveObstaclesLeft(obstacleList, distance) {
    for (let i = 1; i < obstacleList.length; ++i) {
        if (obstacleList[i].parentNode) {
            let left = parseInt(window.getComputedStyle(obstacleList[i]).left);
            obstacleList[i].style.left = (left - distance) + 'px';
        }
    }
}

function dinosaurHitsAnObstacle() {
    const dinosaurRect = DINOSAUR.getBoundingClientRect();
    const obstacles = document.querySelectorAll('.obstaclesDown, .obstaclesUp');

    for (let obstacle of obstacles) {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (checkCollision(dinosaurRect, obstacleRect)) {
            document.getElementById('gameOverMess').style.visibility = 'visible';
            gameActive = false;
            setNewInstructions();
            clearInterval(obstacleUpdateInterval);
            restartGame = true;
            checkAndUpdateHighestScore();
            return true;
        }
    }
    return false;
}

function checkCollision(dinosaurRect, obstacleRect) {
    return dinosaurRect.left < obstacleRect.right && dinosaurRect.right > obstacleRect.left &&
        dinosaurRect.top < obstacleRect.bottom && dinosaurRect.bottom > obstacleRect.top;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setNewInstructions() {
    document.getElementById('instructions').innerHTML = "Press space to restart the game.";
}

function startNewGame() {
    for (let i = obstaclesDown.length - 1; i >= 0; --i) {
        obstaclesDown[i].remove();
    }
    for (let i = obstaclesUp.length - 1; i >= 0; --i) {
        obstaclesUp[i].remove();
    }
    document.getElementById('gameOverMess').style.visibility = 'hidden';
    score = 0;
    level = 0;
    movementSpeed = 2;
    timeBetweenObstacles = 25;
    gameActive = true;
    dinosaurIsJumping = false;
    updateObstaclePosition();
}

updateObstaclePosition();

document.addEventListener('keydown', function (event) {
    if (event.key === " " && restartGame) {
        startNewGame();
        restartGame = false;
        requestAnimationFrame(spawnObstacle);
    } else if (event.key === " ") {
        if (!dinosaurIsJumping) {
            jumpDinosaur();
        }
        if (!gameActive) {
            updateScore();
            gameActive = true;
            requestAnimationFrame(spawnObstacle);
        }
    }
});
