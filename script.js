const ONE_SECONDS = 1000;
const ALL_WORDS = 300;
const LAST_TEN_SECONDS = 10;
const TIME_EXPIRED = 0;
const INDEX_DIFFERENCE = 2;
const userInputField = document.getElementById('userInput');
const displayTextField = document.getElementById('coloredText');
let lastKeyPressed;
let remainingTime = 60;
let completedWordsCount = 0;
let isFirstLetter = true;
let text = "";
let currentWordIndex = 0;
let typedText = "";
let currentWord = "";
let timingStarts = false;
let firstAttempt = true;
let gameActive = true;
let intervalId;
let isCurrentWordCorrect;

const wordList = [
    "apple ", "banana ", "cherry ", "date ", "elderberry ", "fig ", "grape ", "honeydew ", "kiwi ", "lemon ",
    "mango ", "nectarine ", "orange ", "papaya ", "quince ", "raspberry ", "strawberry ", "tangerine ",
    "ugli ", "valencia ", "watermelon ", "xigua ", "yellow ", "zucchini ", "avocado ", "blueberry ",
    "cranberry ", "durian ", "eggplant ", "fennel ", "guava ", "hibiscus ", "jalapeno ", "kumquat ",
    "lime ", "mulberry ", "nutmeg ", "olive ", "peach ", "plum ", "quinoa ", "radish ", "spinach ", "tomato ",
    "yam ", "zest ", "almond ", "basil ", "carrot ", "dill ", "endive ", "fennel ", "ginger ", "horseradish ",
    "iceberg ", "jicama ", "kale ", "lettuce ", "mushroom ", "nopales ", "oregano ", "parsley ", "quinoa ",
    "rosemary ", "sage ", "thyme ", "udon ", "vinegar ", "wasabi ", "yam ", "ziti ", "asparagus ", "broccoli ",
    "cauliflower ", "daikon ", "escarole ", "fiddlehead ", "garlic ", "herb ", "italian ", "japanese ",
    "kohlrabi ", "leek ", "melon ", "nectar ", "okra ", "pear ", "quiche ", "rhubarb ", "spinach ", "taro ",
    "uji ", "victor ", "wheat ", "xanthan ", "yogurt ", "zucchini ", "acai ", "blackberry ", "celery ",
    "dragonfruit ", "elderflower ", "fig ", "goji ", "hibiscus ", "ivy ", "jackfruit ", "kiwi ", "lychee ",
    "mango ", "nut ", "olive ", "pineapple ", "quassia ", "rose ", "straw ", "thyme ", "vine ", "water ",
    "ximenia ", "yuzu ", "zebra ", "adzuki ", "beet ", "corn ", "dandelion ", "elder ", "fig ", "grapefruit ",
    "hops ", "iris ", "jostaberry ", "kiwano ", "lime ", "mandarin ", "nectarine ", "onion ", "persimmon ",
    "quackgrass ", "raspberry ", "seaweed ", "teff ", "ume ", "verbena ", "watercress ", "xigua ", "yarrow ",
    "zaatar ", "apricot ", "broccoli ", "carrot ", "dulse ", "elderberry ", "fiddlehead ", "grape ", "hibiscus ",
    "iris ", "japanese ", "kale ", "lettuce ", "mushroom ", "nopales ", "orange ", "pepper ", "quince ", "radish ",
    "spinach ", "tangerine ", "ugni ", "vanilla ", "watermelon ", "xanthan ", "yam ", "zucchini ", "arugula ",
    "brussels ", "chard ", "dandelion ", "eggplant ", "fig ", "grape ", "hibiscus ", "iceberg ", "jerusalem ",
    "kiwifruit ", "lettuce ", "mushroom ", "nectarine ", "olive ", "pineapple ", "quinoa ", "radish ", "squash ",
    "turnip ", "ube ", "victor ", "watercress ", "xylocarp ", "yuzu ", "zucchini ", "melon ", "broccoli ",
    "lemonade ", "sesame ", "milkshake ", "popcorn ", "cheddar ", "blue cheese ", "straw ", "mushrooms ",
    "cucumber ", "raspberry ", "lettuce ", "black ", "pepper ", "spinach ", "cereal ", "pizza ", "mango ",
    "noodles ", "honey ", "ginger ", "yam ", "peppermint ", "walnut ", "gingerbread ", "milk ", "cream ",
    "cinnamon ", "butter ", "garlic ", "beet ", "tomato ", "turmeric ", "carrot ", "honeydew ", "butternut ",
    "squash ", "cilantro ", "parsley ", "oregano ", "thyme ", "basil ", "sage ", "thyme ", "mint ",
    "tarragon ", "fennel ", "cumin ", "dill ", "paprika ", "chili ", "peanut ", "cashew ", "almond ",
    "pine ", "hazelnut ", "pistachio ", "sunflower ", "sesame ", "pumpkin ", "watermelon ", "canola ",
    "safflower ", "coconut ", "olive ", "avocado ", "peach ", "plum ", "pear ", "cherry ", "grapefruit ",
    "lime ", "orange ", "tangerine ", "lemongrass ", "pineapple ", "pomegranate ", "banana ", "blueberry ",
    "strawberry ", "kiwi ", "passionfruit ", "guava ", "papaya ", "fig ", "date ", "prune ", "raisin ",
    "apricot ", "tomatillo ", "jalapeno ", "chili ", "habanero ", "serrano ", "poblano ", "bell ",
    "carolina reaper ", "cayenne ", "szechuan ", "arbol ", "chipotle ", "pasilla ", "guajillo ",
    "turkey ", "chicken ", "beef ", "pork ", "bacon ", "salmon ", "tuna ", "sardine ", "cod ", "halibut ",
    "trout ", "tilapia ", "anchovy ", "shrimp ", "scallop ", "clam ", "oyster ", "mussel ", "crab ",
    "lobster ", "squid ", "octopus ", "milk ", "cream ", "yogurt ", "butter ", "cheese ", "ice cream ",
    "gelato ", "sorbet ", "popsicle ", "custard ", "pudding ", "egg ", "duck ", "goose ", "quail ", "ostrich ",
    "emu ", "boar ", "venison ", "rabbit ", "kangaroo ", "alligator ", "frog ", "quail ", "pigeon ", "swan ",
    "turducken ", "turkey ", "goose ", "grouse ", "pheasant ", "dove ", "chicken ", "cornish ", "hen ", "rooster "
];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function generateText() {
    for (let i = 0; i < ALL_WORDS; ++i) {
        text += wordList[getRandomInt(ALL_WORDS)];
    }
    return text;
}

function displayGeneratedText() {
    document.getElementById("textOfWords").innerHTML = generateText();
}

function updateColorBasedOnMatch(typedText, currentWord) {
    const element = document.querySelector('#textOfWords');
    isCurrentWordCorrect = true;
    const text = element.innerText;
    let updatedText = "";
    let lengthOfTextWord = getWordLength(text);
    if (lengthOfTextWord > currentWordIndex) {
        for (let i = 0; i < typedText.length; ++i) {
            if (typedText[i] === currentWord[i]) {
                updatedText += '<span style="color: green;">' + text[i] + '</span>';
            } else {
                updatedText += '<span style="color: red;">' + text[i] + '</span>';
                isCurrentWordCorrect = false;
            }
        }
        updatedText += text.substring(typedText.length);
        element.innerHTML = updatedText;
    }
    ++currentWordIndex;
}

function addToTypedText(letter) {
    typedText += letter;
}

function updateCurrentWord() {
    currentWord += text[currentWordIndex];
}

function getWordLength(text) {
    let length = 0;
    while (text[length] !== " " && length < text.length) {
        ++length;
    }
    return length;
}

function resetStateAfterWordCheck(wordLength) {
    text = text.slice(wordLength);
    document.getElementById("userInput").value = "";
    document.getElementById("textOfWords").innerHTML = text;
    typedText = "";
    currentWord = "";
    currentWordIndex = 0;
}

function validateWord() {
    const wordLength = getWordLength(text) + 1;
    if (getWordLength(text) === getWordLength(typedText)
        && isCurrentWordCorrect) {
        ++completedWordsCount;
    }
    resetStateAfterWordCheck(wordLength);
}

function timeLapse() {
    if (timingStarts) {
        intervalId = setInterval(function () {
            --remainingTime;
            if (remainingTime < LAST_TEN_SECONDS) {
                document.getElementById("largeTimer")
                    .style.color = "red";
            }
            if (remainingTime <= TIME_EXPIRED) {
                clearInterval(intervalId);
                remainingTime = TIME_EXPIRED;
                gameActive = false;
                displayGameOverMessage();
            }
            document.getElementById("largeTimer")
                .innerHTML = remainingTime;
        }, ONE_SECONDS);
    }
}

function stopTimeLapse() {
    clearInterval(intervalId);
}

function completedWords() {
    document.getElementById("numberOfWords").innerHTML = completedWordsCount;
}

function displayGameOverMessage() {
    document.getElementById("textGameOver").innerText =
        "You managed to write " + completedWordsCount + " words in one minute"
    document.getElementById("gameOverMessage").style.visibility = "visible";
    restartGame();
}

function restartGame() {
    document.getElementById('restartButton')
        .addEventListener('click', function (event) {
            event.preventDefault();
            location.reload();
        });
}

displayGeneratedText();

userInputField.addEventListener('keydown', function (event) {
    if (gameActive) {
        timingStarts = true;
        const inputLetter = event.key;
        if (inputLetter !== "Backspace") {
            addToTypedText(inputLetter);
            updateCurrentWord();
        }
        if (inputLetter === "Backspace") {
            typedText = typedText.slice(0, -1);
            currentWord = currentWord.slice(0, -1);
            updateColorBasedOnMatch(typedText, currentWord);
            currentWordIndex -= INDEX_DIFFERENCE;
        } else if (inputLetter === " ") {
            validateWord();
        } else {
            updateColorBasedOnMatch(typedText, currentWord);
        }
        if (firstAttempt) {
            timeLapse();
        }
        firstAttempt = false;
        completedWords();
    }
});
