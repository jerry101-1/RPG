// ==================== 🎮 全域玩家與怪物狀態 ====================
let player = null;
let monster = { name: "迷幻蘑菇", health: 250, maxHealth: 250, attack: 80, defense: 30, expReward: 80, moneyReward: 80, monsterLV: 1, monsterType: 6 };

const defaultPlayer = {
    roleType: 3,     // 3: 至高法師
    level: 1,
    health: 7000,
    maxHealth: 7000,
    attack: 500,
    defense: 50,
    money: 0,
    playerExp: 0,
    playexp: 100,
    world: 1,
    weaponLv: 0,
    showSecretShop: false
};

// 📈 核心升級經驗公式
function getRequiredExp(level) {
    return Math.round(50 * Math.pow(level, 1.5) + level * 20);
}

// 👾 怪物動態生成邏輯
function generateMonster() {
    let monsterType = Math.floor(Math.random() * 7) + 1; 
    if (player.level >= 50 && Math.random() <= 0.20) monsterType = 8; // 毀滅之龍

    let we = Math.floor(Math.random() * 3) - 1; 
    let monsterLV = Math.max(1, player.level + we);
    let world = player.world || 1;

    switch (monsterType) {
        case 1: monster.name = "野生史萊姆"; monster.maxHealth = 50 + 15 * monsterLV * world; monster.attack = 10 + 8 * monsterLV * world; monster.defense = 2 + 2 * monsterLV * world; monster.expReward = 30 * monsterLV * world; monster.moneyReward = 20 * monsterLV * world; break;
        case 2: monster.name = "暴躁哥布林"; monster.maxHealth = 100 + 20 * monsterLV * world; monster.attack = 25 + 10 * monsterLV * world; monster.defense = 10 + 3 * monsterLV * world; monster.expReward = 50 * monsterLV * world; monster.moneyReward = 40 * monsterLV * world; break;
        case 3: monster.name = "兇猛野狼"; monster.maxHealth = 180 * monsterLV * world; monster.attack = 40 + 12 * monsterLV * world; monster.defense = 20 * monsterLV * world; monster.expReward = 80 * monsterLV * world; monster.moneyReward = 35 * monsterLV * world; break;
        case 4: monster.name = "石像鬼"; monster.maxHealth = 300 + 40 * monsterLV * world; monster.attack = 50 + 15 * monsterLV * world; monster.defense = 50 + 20 * monsterLV * world; monster.expReward = 180 * monsterLV * world; monster.moneyReward = 60 * monsterLV * world; break;
        case 5: monster.name = "骷髏弓箭手"; monster.maxHealth = 200 + 25 * monsterLV * world; monster.attack = 60 + 15 * monsterLV * world; monster.defense = 15 * monsterLV * world; monster.expReward = 120 * monsterLV * world; monster.moneyReward = 55 * monsterLV * world; break;
        case 6: monster.name = "迷幻蘑菇"; monster.maxHealth = 150 + 30 * monsterLV * world; monster.attack = 30 + 7 * monsterLV * world; monster.defense = 30 * monsterLV * world; monster.expReward = 100 * monsterLV * world; monster.moneyReward = 80 * monsterLV * world; break;
        case 7: monster.name = "黃金波利"; monster.maxHealth = 10 * monsterLV; monster.attack = 1; monster.defense = 999; monster.expReward = 500 * monsterLV * world; monster.moneyReward = 2000 * monsterLV * world; break;
        case 8: monster.name = "👑 毀滅之龍"; monster.maxHealth = 5000 + 500 * monsterLV * world; monster.attack = 200 + 40 * monsterLV * world; monster.defense = 150 + 30 * monsterLV * world; monster.expReward = 5000 * world; monster.moneyReward = 10000 * world; break;
    }
    monster.health = monster.maxHealth;
    monster.monsterLV = monsterLV;
    monster.monsterType = monsterType;

    player.showSecretShop = Math.random() <= 0.20;
}

// ⚔️ 擊敗怪物判定與升級
function checkMonsterDeath(battleLog) {
    if (monster.health <= 0) {
        let totalExp = Math.round((monster.expReward * player.playexp) / 100.0);
        player.playerExp += totalExp;
        player.money += monster.moneyReward;

        battleLog.push(`🎉 擊敗 ${monster.name}！獲得 ${totalExp} 經驗與 ${monster.moneyReward} 金幣。`);

        let lvUpExp = getRequiredExp(player.level);
        let leveledUp = false;

        while (player.playerExp >= lvUpExp) {
            player.playerExp -= lvUpExp;
            player.level++;
            leveledUp = true;

            if (player.roleType === 1) { player.maxHealth += 150; player.attack += 15; player.defense += 8; }
            else if (player.roleType === 2) { player.maxHealth += 100; player.attack += 25; player.defense += 4; }
            else if (player.roleType === 3) { player.maxHealth += 80;  player.attack += 35; player.defense += 2; } 
            else if (player.roleType === 4) { player.maxHealth += 250; player.attack += 10; player.defense += 12; }
            lvUpExp = getRequiredExp(player.level);
        }

        if (leveledUp) {
            player.health = player.maxHealth;
            battleLog.push(`🌟🌟🌟 【LEVEL UP!】 升到 Lv.${player.level}！屬性提升，HP已回滿！ 🌟🌟🌟`);
        }
        generateMonster();
        battleLog.push(`🔍 遭遇新怪：【${monster.name} (Lv.${monster.monsterLV})】！` + (player.showSecretShop ? " 📢 【神祕的黑市隱藏商店開門了！】" : ""));
        return true;
    }
    return false;
}

// 🔺 怪物反擊
function monsterCounterAttack(battleLog) {
    let mVar = Math.floor(Math.random() * 7) - 3;
    let mDmg = Math.round((monster.attack - player.defense) * (100.0 + mVar) / 100.0);
    if (mDmg < 1) mDmg = 1;

    player.health -= mDmg;
    if (player.health < 0) player.health = 0;
    battleLog.push(`🔺 ${monster.name} 發動反擊，造成 ${mDmg} 點傷害！`);
    if (player.health === 0) battleLog.push(`💀 你戰死沙場！請點擊返回村莊復活。`);
}

// 💾 自動存檔機制
function saveGame() {
    localStorage.setItem("rpg_player_save", JSON.stringify(player));
}

function loadGame() {
    const saved = localStorage.getItem("rpg_player_save");
    if (saved) {
        player = JSON.parse(saved);
    } else {
        player = { ...defaultPlayer };
    }
}

// ==================== 🕹️ 玩家動作處理 ====================

function doAttack() {
    let battleLog = [];
    let pVar = Math.floor(Math.random() * 7) - 3; 
    let pDmg = Math.round((player.attack * player.attack / (player.attack + monster.defense)) * (100.0 + pVar) / 100.0);
    if (pDmg < 1) pDmg = 1;

    battleLog.push(`⚔️ 你對 ${monster.name} 造成了 ${pDmg} 點傷害。`);
    monster.health -= pDmg;

    if (!checkMonsterDeath(battleLog)) {
        monsterCounterAttack(battleLog);
    }
    saveGame();
    updateUI(battleLog);
}

function doSkill() {
    let battleLog = [];
    let sDmg = 0;

    if (player.roleType === 1) { 
        sDmg = player.attack * 2;
        battleLog.push(`🔥 施展【盾擊二連斬】！對 ${monster.name} 狂轟 ${sDmg} 點重擊傷害！`);
    } else if (player.roleType === 2) { 
        sDmg = Math.round(player.attack * 2.5);
        battleLog.push(`🗡️ 施展【暗影伏擊】！從背後背刺 ${monster.name} 造成 ${sDmg} 點暴擊傷害！`);
    } else if (player.roleType === 3) { 
        sDmg = player.attack * 3;
        battleLog.push(`🔮 施展【百萬噸隕石術】！召喚天火對 ${monster.name} 砸出 ${sDmg} 點毀滅傷害！`);
    } else if (player.roleType === 4) { 
        let heal = Math.round(player.maxHealth * 0.4);
        player.health = Math.min(player.maxHealth, player.health + heal);
        sDmg = player.attack;
        battleLog.push(`✨ 施展【神聖治癒術】！恢復了 ${heal} 點生命值，並順手聖光制裁造成 ${sDmg} 點傷害！`);
    }

    monster.health -= sDmg;

    if (!checkMonsterDeath(battleLog)) {
        monsterCounterAttack(battleLog);
    }
    saveGame();
    updateUI(battleLog);
}

function buyItem(item) {
    let battleLog = [];

    if (item === 'potion') {
        if (player.money >= 500) {
            player.money -= 500;
            player.health = Math.min(player.maxHealth, player.health + Math.round(player.maxHealth * 0.5));
            battleLog.push(`🧪 你從商店購買並喝下特級藥水，生命值大幅恢復！`);
        } else { battleLog.push(`❌ 金幣不足，買不起藥水！`); }
    } 
    else if (item === 'weapon') {
        if (player.money >= 2000) {
            player.money -= 2000;
            player.weaponLv++;
            player.attack += 150;
            battleLog.push(`⚔️ 鐵匠幫你強化了武器 (+$150 攻擊)！目前鐵匠鋪武器等級: Lv.${player.weaponLv}`);
        } else { battleLog.push(`❌ 金幣不足，無法升級武器！`); }
    } 
    else if (item === 'secret') {
        if (player.showSecretShop && player.money >= 50000) {
            player.money -= 50000;
            player.attack += 2000;
            player.showSecretShop = false;
            battleLog.push(`💎 恭喜！你傾家蕩產買下了【神祕聖劍】！攻擊力瘋狂暴增 +2000！！`);
        } else { battleLog.push(`❌ 購買失敗！可能金幣不夠，或是黑市商人已經溜了！`); }
    }

    saveGame();
    updateUI(battleLog);
}

function goVillage() {
    player.health = player.maxHealth;
    generateMonster();
    let battleLog = [`🏡 回到村莊，生命值全滿！`, `🔍 重新出發，遭遇了【${monster.name}】！`];
    saveGame();
    updateUI(battleLog);
}

// 🖥️ UI 繪製
function updateUI(logMsgs = []) {
    const logBox = document.getElementById("battle-log");
    logBox.innerHTML = "";

    logMsgs.forEach(msg => {
        logBox.innerHTML += `<p>${msg}</p>`;
    });

    const jobs = ["未就職", "人類戰士", "王牌刺客", "至高法師", "神聖牧師"];
    document.getElementById("player-job").innerText = jobs[player.roleType] || "冒險者";
    document.getElementById("player-level").innerText = player.level;
    document.getElementById("player-exp").innerText = `${player.playerExp} / ${getRequiredExp(player.level)}`;
    document.getElementById("player-hp").innerText = player.health;
    document.getElementById("player-max-hp").innerText = player.maxHealth;
    document.getElementById("player-money").innerText = player.money;

    document.getElementById("monster-name").innerText = `${monster.name} (Lv.${monster.monsterLV})`;
    let mHpPercent = (monster.health / monster.maxHealth) * 100;
    if (mHpPercent < 0) mHpPercent = 0;
    document.getElementById("monster-hp-bar").style.width = mHpPercent + "%";
    document.getElementById("monster-hp-text").innerText = `HP: ${monster.health} / ${monster.maxHealth}`;

    const secretBtn = document.getElementById("secret-shop-btn");
    if (player.showSecretShop) {
        secretBtn.classList.remove("hidden");
    } else {
        secretBtn.classList.add("hidden");
    }
}

// 🚀 網頁載入即啟動
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    generateMonster();
    updateUI(["⚔️ 冒險開始！"]);
});
