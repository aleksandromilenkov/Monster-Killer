const ATTACK_VALUE = 10;
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

let niza= [];
let posledenZapis;

function zemiZivotValue(){
    const vnes = prompt("Vnesi poceten zivot: ",100);
    const parsedValue = parseInt(vnes);
    if(isNaN(parsedValue)|| parsedValue<=20){
        throw{message:"Pogresen vnes!"};
    }
    return parsedValue;
}

let maxLife ;
try{
    maxLife = zemiZivotValue();
}catch(err){
    console.log(err);
    maxLife=100;
}

let momentalnaSilaIgrac = maxLife;
let momentalnaSilaMonster = maxLife;
let imaBonus = true;

adjustHealthBars(maxLife);

function writeToLog(nastan,vrednost,momentalnaIgrac,momentalnaMonster){
    let logEntry = {
        event:nastan,
        value:vrednost,
        currentHealthPlayer:momentalnaIgrac,
        currentHealthMonster:momentalnaMonster
    }
    switch(nastan){
        case LOG_EVENT_PLAYER_ATTACK: logEntry.target="MONSTER"; break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK: logEntry.target="MONSTER";break;
        case LOG_EVENT_MONSTER_ATTACK: logEntry.target="PLAYER";break;
        case LOG_EVENT_PLAYER_HEAL: logEntry.target="PLAYER";break;
        default: logEntry={};
    }
    niza.push(logEntry);
}

function reset(){
    momentalnaSilaIgrac = maxLife;
    momentalnaSilaMonster = maxLife;
    resetGame(maxLife); 
}

function endRound(){
    const inicijalnaIgracSila = momentalnaSilaIgrac;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    momentalnaSilaIgrac -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,playerDamage,momentalnaSilaIgrac,momentalnaSilaMonster);

    if(momentalnaSilaIgrac<=0 && imaBonus){
        imaBonus=false;
        removeBonusLife();
        momentalnaSilaIgrac=inicijalnaIgracSila;
        setPlayerHealth(inicijalnaIgracSila);
        alert("You would be dead but bonus life saved you!")
    }

    if(momentalnaSilaMonster<=0 && momentalnaSilaIgrac >0){
        alert("YOU WON!");
        writeToLog(LOG_EVENT_GAME_OVER,"Player won",momentalnaSilaIgrac,momentalnaSilaMonster);
    }else if (momentalnaSilaIgrac<=0 && momentalnaSilaMonster> 0){
        alert("MONSTER WON!");
        writeToLog(LOG_EVENT_GAME_OVER,"Monster Won",momentalnaSilaIgrac,momentalnaSilaMonster);
    }else if (momentalnaSilaIgrac <=0 && momentalnaSilaMonster <= 0){
        alert("NERESNO!");
        writeToLog(LOG_EVENT_GAME_OVER,"NERESENO",momentalnaSilaIgrac,momentalnaSilaMonster);
    }

    if (momentalnaSilaIgrac<=0 || momentalnaSilaMonster<=0){
        reset();
    }
}

function monsterAttack(mode){
    let maxDamage = (mode === MODE_ATTACK) ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    let logAttack = (mode===MODE_ATTACK)? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage);
    momentalnaSilaMonster -=  damage;
    writeToLog(logAttack,damage,momentalnaSilaIgrac,momentalnaSilaMonster);
    endRound();
}

function attackHandler(){
    monsterAttack(MODE_ATTACK);
}

function strongAttackHandler(){
    monsterAttack(MODE_STRONG_ATTACK);
}

function healPlayer(){
    let heal;
    if(momentalnaSilaIgrac >= maxLife - HEAL_VALUE){
        alert("Ne mozes nad max silata da se izlecis");
        heal = maxLife-momentalnaSilaIgrac;
    }else {
        heal = HEAL_VALUE;
    }
    increasePlayerHealth(heal);
    momentalnaSilaIgrac += heal;
    writeToLog(LOG_EVENT_PLAYER_HEAL,heal,momentalnaSilaIgrac,momentalnaSilaMonster);
    endRound();
}

function printLog(){
    let i = 0;
    for ( const el of niza){
        if(!posledenZapis && posledenZapis!==0 || posledenZapis<i){
        console.log("#",i);
        for( const key in el){
            console.log(`${key} => ${el[key]}`);
        }
        posledenZapis = i;
        break;
    }
    i++;
    }

}

attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener("click",strongAttackHandler);
healBtn.addEventListener("click",healPlayer);
logBtn.addEventListener("click",printLog);