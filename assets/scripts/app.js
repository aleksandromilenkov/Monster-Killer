const ATTACK_VALUE = 10; // Konstanta koja e hard-coded zatoa e so cap lock
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;
function getMaxLifeValues() {
  // vnesuvanje pocetna sila:
  const enteredValue = prompt("Eter start health for You and the Monster", 100);
  let parsedValue = parseInt(enteredValue);
  // proverka za nevaliden vnes na pocetna sila:
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "Wrong input" };
  }
  return parsedValue;
}
let chosenMaxLife;
try{
 chosenMaxLife = getMaxLifeValues();
}catch(err){
    console.log(err);
    chosenMaxLife=100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
// Prilagoduvanje na barovite spored izbranata vrednost:
adjustHealthBars(chosenMaxLife);

function writeToLog(evt, val, monsterHealth, playerHealth ){
    let logEntry ={
        event:evt,
        value:val,
        finalMonsterHealth : monsterHealth,
        finalPlayerHealth : playerHealth,
    }
   
    switch(evt){
        case LOG_EVENT_PLAYER_ATTACK: logEntry.target = "MONSTER"; break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK: logEntry.target = "MONSTER"; break;
        case LOG_EVENT_MONSTER_ATTACK: logEntry.target = "PLAYER"; break;
        case LOG_EVENT_PLAYER_HEAL: logEntry.target = "PLAYER"; break;
        default: logEntry = {};
    }
    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth=chosenMaxLife;
    currentPlayerHealth=chosenMaxLife;
    resetGame(chosenMaxLife);
}

// funkcija za napaganje vrz igracot i proverka za pobeda
function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,currentMonsterHealth,currentPlayerHealth);
    //bonus life check:
    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife=false;
        removeBonusLife();
        currentPlayerHealth=initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but bonus life saved you!")
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth>0){
        alert("You won!");
        writeToLog(LOG_EVENT_GAME_OVER,"Player won",currentMonsterHealth,currentPlayerHealth);
    }else if (currentPlayerHealth <=0 && currentMonsterHealth>0){
        alert("You lost!");
        writeToLog(LOG_EVENT_GAME_OVER,"Monster won",currentMonsterHealth,currentPlayerHealth);
    }else if (currentMonsterHealth<=0 && currentPlayerHealth<=0){
        alert("It is a draw!");
        writeToLog(LOG_EVENT_GAME_OVER,"Its a draw",currentMonsterHealth,currentPlayerHealth);
    }

    if(currentMonsterHealth<=0 || currentPlayerHealth <=0){
        reset();
    }
}


//napaganje na monsterot i negovo vrakjanje nazad so napad i proverka na pobednik
function attackMonster(mode){
    const maxDamage = (mode === MODE_ATTACK) ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logAttack = (mode === MODE_ATTACK) ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
    // if(mode===MODE_ATTACK){
    //     maxDamage=ATTACK_VALUE;
    //     logAttack = LOG_EVENT_PLAYER_ATTACK;
    // }else if(mode===MODE_STRONG_ATTACK){
    //     maxDamage=STRONG_ATTACK_VALUE
    //     logAttack = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }

    const damage=dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logAttack,damage,currentMonsterHealth,currentPlayerHealth);
   endRound();
}

// napaganje na monsterot
function attackHandler(){
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife-HEAL_VALUE){
        alert("You cant heal above the max health");
        healValue = chosenMaxLife-currentPlayerHealth;
    }else{
        healValue = HEAL_VALUE
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
    endRound();
}



function printLogHandler() {

   
   let i = 0;
   
   
   for ( const logEntry of battleLog){
       if(!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i){
        console.log("#",i);
        for(const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`);
        }
        lastLoggedEntry = i;
        break;
    }
        i++;
    }

// let i = 0;
//  prvCiklus: do{
//      console.log("prv ",i);
//      for(let o =0; o<3;o++){
//          if(o==2){
//             break prvCiklus;
//          }
//          console.log("Vtpr ",o);
//      }
//      i++;
//  }while(i<3);
  }


attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);