$(function (){
  function notation(num) {
    if (notationForm == 0) {
      if (num <= 1) {
        return num.toFixed(3);
      } else {
        notationLevel = Math.floor(Math.log10(num)/3);
        notationSpace = Math.floor(Math.log10(num)%3);
        notationFixed = (num / 1000 ** notationLevel).toFixed(3 - notationSpace) ;
        if (notationLevel < 11) {
          return notationFixed + ' ' + standardNotation[notationLevel];
        } else {
          return notationFixed + ' ' + standardNotation2[(notationLevel-11) % 10] + standardNotation3[Math.floor((notationLevel-11) / 10)];
        }
      }
    } else {
      if (num >= 1e5) {
        return (num/(10**(Math.floor(Math.log10(num))))).toFixed(3) + 'e' + Math.floor(Math.log10(num));
      } else {
        return num.toFixed(2);
      }
    }
  }
  function makeSave() {
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
  }
  function gameSave() {
    var date = new Date();
    date.setDate(date.getDate() + 2000);
    var willCookie = "";
    willCookie += "saveData=";
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    willCookie += JSON.stringify(saveFile);
    willCookie += ";expires=" + date.toUTCString();
    document.cookie = willCookie;
  }
  function gameLoad() {
    var cookies = document.cookie.split(";");
    for(var i in cookies) {
      if(cookies[i].search('saveData') != -1) {
        const savedFile = JSON.parse(decodeURIComponent(cookies[i].replace('saveData' + "=", "")));
        dataCopy = JSON.parse(JSON.stringify(resetData));
        Object.assign(dataCopy, savedFile);
        for (var i = 0; i < varData.length; i++) {
          this[varData[i]] = dataCopy[i];
        }
        debugStr = dataCopy;
      }
    }
  }
  function gameReset() {
    for (var i = 0; i < varData.length; i++) {
      this[varData[i]] = resetData[i];
    }
    gameSave();
    location.reload();
  }
  function gameDisplay() {
    playerStatus();
    monsterStatus();
    loot();
    weapon();
    translateFun();
    tokenShop();
    tokenBuffCalc();
    playerUnlock();
    masteryQuest();
    mastery();
    $('#playtime').html(function (index,html) {
      return 'Total Play Time: ' + playtime.toFixed(3) + 'h';
    });
  }
  function playerStatus() {
    stageUnlocked = Math.floor((playerLevel-1)/10)+1;
    if (playerExp >= playerExpNeed) {
      playerExp = playerExp - playerExpNeed;
      playerLevel = playerLevel + 1;
      playerExpNeed = 3.2**playerLevel*10;
      $("#playerLevel").attr({
        'class' : 'levelup'
      });
      $("#playerExp").attr({
        'class' : 'levelup'
      });
      setTimeout(function(){
        $("#playerLevel").attr({
          'class' : 'levelup2'
        });
        $("#playerExp").attr({
          'class' : 'levelup2'
        });
      }, 1000);
    }
    $('#playerLevel').html(function (index,html) {
      return 'Level ' + playerLevel;
    });
    $('#playerExp').html(function (index,html) {
      expPer = (playerExp / playerExpNeed * 100).toFixed(2);
      return ' - ' + notation(playerExp) + '/' + notation(playerExpNeed) + ' EXP (' + expPer + '%)';
    });
    $('#coin').html(function (index,html) {
      return notation(coin) + ' coin (+' + notation(cps) + '/s)';
    });
    $('#token').html(function (index,html) {
      return notation(token) + ' token (' + tokenTimer.toFixed(1) + 's)';
    });
    $('.totalCombatStatus').html(function (index,html) {
      return 'Total Status<br>Dmg: ' + notation(playerDmg) + '<br>' + 'Hit/s: ' + (playerHitPS+1);
    });
  }
  function playerUnlock() {
    if (playerLevel >= 71) {
      $('.mainMenu').css('width', '12.499999%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 79.999%;' );
      $('#fieldWarp > span:eq(1)').show();
      $('#masteryWarp > .skillLine:eq(2)').show();
      $('#coin').show();
      $('#mainNav > div:eq(6)').show();
      $('#mainNav > div:eq(5)').show();
      $('#mainNav > div:eq(4)').show();
    } else if (playerLevel >= 31) {
      $('.mainMenu').css('width', '14.285713%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 79.999%;' );
      $('#fieldWarp > span:eq(1)').show();
      $('#masteryWarp > .skillLine:eq(2)').hide();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').hide();
      $('#mainNav > div:eq(5)').show();
      $('#mainNav > div:eq(4)').show();
    } else if (playerLevel >= 11) {
      $('.mainMenu').css('width', '16.666666%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 99.999%;' );
      $('#fieldWarp > span:eq(1)').hide();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').hide();
      $('#mainNav > div:eq(5)').hide();
      $('#mainNav > div:eq(4)').show();
    } else {
      $('.mainMenu').css('width', '19.999999%');
      $('#fieldWarp > span:eq(0)').attr( 'style', 'width: 99.999%;' );
      $('#fieldWarp > span:eq(1)').hide();
      $('#coin').hide();
      $('#mainNav > div:eq(6)').hide();
      $('#mainNav > div:eq(5)').hide();
      $('#mainNav > div:eq(4)').hide();
    }
  }
  function monsterStatus() {
    $("#monster").css('background-image', 'url(monster/' + monsterNow + '.png)');
    $('#monLevel').html(function (index,html) {
      return 'Lv ' + monsterNow;
    });
    $('#monsterStatus').html(function (index,html) {
      return monName[monsterNow] + ' (hp: ' + notation(monsterHp) + '/' + notation(monsterHpM) + ')';
    });
  }
  function loot() {
    switch (translateNum) {
      case 0:
        translateTxt = 'EXP Bottle'
        break;
      case 1:
        translateTxt = '경험치 병'
        break;
    }
    $('#EXPBottleQ').html(function (index,html) {
      return translateTxt + ' - ' + lootQuantity[1];
    });
    switch (translateNum) {
      case 0:
        translateTxt = 'Mysterious Chest'
        break;
      case 1:
        translateTxt = '의문의 상자'
        break;
    }
    $('#mysteryChestQ').html(function (index,html) {
      return translateTxt + ' - ' + lootQuantity[2];
    });
    switch (translateNum) {
      case 0:
        translateTxt = 'Tier'
        break;
      case 1:
        translateTxt = '티어'
        break;
    }
    $('#tierLootMark').html(function (index,html) {
      return translateTxt + ' ' + lootPage;
    });
    a = 1;
    while(a <= 4){
      $("#tierLoot > .lootItem:eq(" + (a-1) + ") > .lootName").html(function (index,html) {
        return lootName[(lootPage - 1)*4 + a] + ' - ' + lootQuantity[(lootPage - 1)*4 + a + 2];
      });
      $("#tierLoot > .lootItem:eq(" + (a-1) + ") > .lootImg").attr({
        'style' : 'background-image: url(loot/' + ((lootPage - 1)*4 + a) + '.png);'
      });
      a++;
    }
  }
  function weapon() {
    a = 1;
    while(a <= 5){
      weaponNum = (weaponPage - 1) * 5 + a;
      if (weaponLevel[weaponNum] >= 1) {
        weaponRank = Math.floor(Math.sqrt(weaponLevel[weaponNum]));
        $(".weaponBg > .weapon:eq(" + (a-1) + ")").attr({
          'src' : 'weapon/' + weaponNum + '.png'
        });
        $("#weaponWarp > .weaponBg:eq(" + (a-1) + ")").attr({
          'style' : 'background-image: url(rank/' + weaponRank + '.png);'
        });
      } else {
        $(".weaponBg > .weapon:eq(" + (a-1) + ")").attr({
          'src' : 'weapon/0.png'
        });
        $("#weaponWarp > .weaponBg:eq(" + (a-1) + ")").attr({
          'style' : 'background-image: url(etc/mystery_weapon.png);'
        });
      }
      a++;
    }
  }
  function gotWeaponCalc(num, quantity) {
    if (quantity > 0) {
      if (weaponLevel[num] < 999) {
        if (weaponLevel[num] + quantity > 999) {
          quantity = 999 - weaponLevel[num];
        }
        weaponLevel[num] = weaponLevel[num] + quantity;
        playerDmg = playerDmg + ((num*2)**(1+(num*2)/5)*10)/(1+(num*2)**3)*quantity;
        collectedWeapon = collectedWeapon + quantity;
        if (weaponLevel[num] == 999) {
          switch (translateNum) {
            case 0:
              translateTxt = 'reached 999Level!'
              break;
            case 1:
              translateTxt = '999레벨 달성!'
              break;
          }
          strA = '<span class="maxLv">' + weaponName[num] + ' ' + translateTxt + ' +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num] + '</span>'
          token = token + 10;
        } else {
          switch (translateNum) {
            case 0:
              translateTxt = 'level up!'
              break;
            case 1:
              translateTxt = '획득!'
              break;
          }
          if (num%5 == 0) {
            strA = '<span class="rare">' + weaponName[num] + ' ' + translateTxt + ' +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num] + '</span>'
          } else {
            strA = weaponName[num] + ' ' + translateTxt + ' +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num];
          }
        }
        extraStstusSet(strA);
      }
      playerStatus();
    }
  }
  function extraStstusSet(str) {
    a = 8;
    while (a >= 0) {
      extraStatus[a+1] = extraStatus[a]
      a--;
    }
    extraStatus[0] = str;
    d = 0;
    extraStatusStr = '';
    while (d <= 9) {
      extraStatusStr = extraStatusStr + extraStatus[d] + '<br>';
      d++;
    }
    extraStatusStr
    $('#extraStatus').html(function (index,html) {
      return extraStatusStr;
    });
  }
  function hitMonster(dmg) {
    monsterHp = monsterHp - dmg*tokenBuff0N*masteryBuff00R;
    if (monsterHp <= 0) {
      gotLoot = 1;
      if (Math.random() < 1-masteryBuff01R) {
        gotLoot = gotLoot * 2;
      }
      if (rareMob == 1) {
        gotLoot = gotLoot * 100;
      }
      playerExp = playerExp + Math.random()*(tokenBuff3N**(monsterNow))*tokenBuff2N*masteryBuff02*gotLoot;
      luck = Math.floor(Math.random()*100);
      if (playerLevel >= 31) {
        mobKilled[monsterNow]++;
      }
      loot1Chance = (50-(stagePage-1)*3)*(1-(((monsterNow-1)%5))*0.25);
      if (0 <= luck &&  luck < 50+(stagePage-1)*3) {

      } else if (50+(stagePage-1)*3 <= luck && luck < 50+loot1Chance) {
        lootNum = (Math.ceil(monsterNow/5)*2)+1;
        lootQuantity[lootNum] = lootQuantity[lootNum] + gotLoot;
        if (menuPage == 0) {
          switch (translateNum) {
            case 0:
              translateTxt = 'You got '
              translateTxt2 = ''
              translateTxt3 = 'Have '
              translateTxt4 = ''
              break;
            case 1:
            translateTxt = ''
            translateTxt2 = '획득'
            translateTxt3 = ''
            translateTxt4 = '개 보유'
              break;
          }
          if (stageUnlocked == stagePage) {
            extraStstusSet(translateTxt + lootName[lootNum-2] + ' ' + translateTxt2 + '! (' + translateTxt3 + lootQuantity[lootNum] + translateTxt4 + ')');
          }
        }
        loot();
      } else if (50+loot1Chance <= luck && luck < 100) {
        lootNum = (Math.ceil(monsterNow/5)*2)+2;
        lootQuantity[lootNum] = lootQuantity[lootNum] + gotLoot;
        if (menuPage == 0) {
          switch (translateNum) {
            case 0:
              translateTxt = 'You got '
              translateTxt2 = ''
              translateTxt3 = 'Have '
              translateTxt4 = ''
              break;
            case 1:
            translateTxt = ''
            translateTxt2 = '획득'
            translateTxt3 = ''
            translateTxt4 = '개 보유'
              break;
          }
          if (stageUnlocked == stagePage) {
            extraStstusSet(translateTxt + lootName[lootNum-2] + ' ' + translateTxt2 + '! (' + translateTxt3 + lootQuantity[lootNum] + translateTxt4 + ')');
          }
        }
        loot();
      }
      summonMonster();
      monsterHpCalc();
      masteryQuest();
    }
    monsterStatus();
    playerStatus();
    $("#monsterHpProgress").attr({
      'value' : monsterHp / monsterHpM
    });
    $('#monsterHpProgressNum').html(function (index,html) {
      return (monsterHp / monsterHpM * 100).toFixed(2) + '%';
    });
  }
  function summonMonster() {
    if (stagePage*10 <= playerLevel) {
      monsterNow = Math.floor(Math.random()*10)+1+(stagePage-1)*10;
    } else {
      monsterNow = Math.floor(Math.random()*(playerLevel-(stagePage-1)*10))+1+(stagePage-1)*10;
    }
    monsterHpCalc();
    monsterStatus();
  }
  function monsterHpCalc() {
    extraMonsterHp = 1;
    if (monsterNow >= 71) {
      extraMonsterHp = (10**((monsterNow-70)/10));
      if (monsterNow > 100) {
        extraMonsterHp = extraMonsterHp*1000;
      }
    }
    if (masteryBuff10R != 1 && Math.random() < masteryBuff10) {
      rareMob = 1;
      monsterHpM = (((monsterNow**(1+monsterNow/5)*10)*(1+30/(monsterNow/100+1))/10-0.7)*80)*extraMonsterHp;
      monsterHp = monsterHpM;
      if (stageUnlocked-1 <= stagePage) {
        extraStstusSet('<span class="rareMob">Rare Monster Appears! (' + monsterNow + ' Lv)</span>');
      }
    } else {
      rareMob = 0;
      monsterHpM = ((monsterNow**(1+monsterNow/5)*10)*(1+30/(monsterNow/100+1))/10-0.7)*extraMonsterHp;
      monsterHp = monsterHpM;
    }
  }
  function stageChange() {
    summonMonster();
    $("#fieldWarp").attr({
      'style' : 'background-image: url(bg/world' + stagePage + '.png);'
    });
    $('#stageNum').html(function (index,html) {
      return stagePage;
    });
  }
  function lootChange() {
    $('#lootNum').html(function (index,html) {
      return lootPage;
    });
    loot();
  }
  function weaponChange() {
    $('#weaponNum').html(function (index,html) {
      return weaponPage;
    });
    weapon();
  }
  function tokenShop() {
    tokenBuffCalc();
    $('#tokenDisplay').html(function (index,html) {
      return 'You Have ' + token.toFixed(0) + ' Tokens'
    });
    $('#tokenBuff1').html(function (index,html) {
      return 'x' + tokenBuff0N.toFixed(1) + ' -> x'+ tokenBuff0L.toFixed(1)
    });
    $('#tokenBuff2').html(function (index,html) {
      return 'x' + tokenBuff1N + ' -> x'+ tokenBuff1L
    });
    $('#tokenBuff3').html(function (index,html) {
      return 'x' + tokenBuff2N.toFixed(1) + ' -> x'+ tokenBuff2L.toFixed(1)
    });
    $('#tokenBuff4').html(function (index,html) {
      return '^' + tokenBuff3N + ' -> ^'+ tokenBuff3L
    });
    $('#tokenBuff5').html(function (index,html) {
      return tokenBuff4N + '% -> '+ tokenBuff4L + '%'
    });
    $('#tokenBuff6').html(function (index,html) {
      return tokenBuff5N.toFixed(3) + 's -> '+ tokenBuff5L.toFixed(3) + 's'
    });
    $('#tokenBuff7').html(function (index,html) {
      return tokenBuff6N + '/s -> '+ tokenBuff6L + '/s'
    });
    $('#tokenBuy1').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[0] + ' Token)'
    });
    $('#tokenBuy2').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[1] + ' Token)'
    });
    $('#tokenBuy3').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[2] + ' Token)'
    });
    $('#tokenBuy4').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[3] + ' Token)'
    });
    $('#tokenBuy5').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[4] + ' Token)'
    });
    $('#tokenBuy6').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[5] + ' Token)'
    });
    $('#tokenBuy7').html(function (index,html) {
      return 'Buy (' + tokenUpgradePrice[6] + ' Token)'
    });
    $('#tokenLevel1').html(function (index,html) {
      return tokenUpgrade[0]
    });
    $('#tokenLevel2').html(function (index,html) {
      return tokenUpgrade[1]
    });
    $('#tokenLevel3').html(function (index,html) {
      return tokenUpgrade[2]
    });
    $('#tokenLevel4').html(function (index,html) {
      return tokenUpgrade[3]
    });
    $('#tokenLevel5').html(function (index,html) {
      return tokenUpgrade[4]
    });
    $('#tokenLevel6').html(function (index,html) {
      return tokenUpgrade[5]
    });
    $('#tokenLevel7').html(function (index,html) {
      return tokenUpgrade[6]
    });
    $('#tokenName1').html(function (index,html) {
      return tokenUpgradeName[0]
    });
    $('#tokenName2').html(function (index,html) {
      return tokenUpgradeName[1]
    });
    $('#tokenName3').html(function (index,html) {
      return tokenUpgradeName[2]
    });
    $('#tokenName4').html(function (index,html) {
      return tokenUpgradeName[3]
    });
    $('#tokenName5').html(function (index,html) {
      return tokenUpgradeName[4]
    });
    $('#tokenName6').html(function (index,html) {
      return tokenUpgradeName[5]
    });
    $('#tokenName7').html(function (index,html) {
      return tokenUpgradeName[6]
    });
  }
  function tokenBuffCalc() {
    tokenBuff0N = 1 + tokenUpgrade[0]*0.2;
    tokenBuff0L = 1 + (tokenUpgrade[0]+1)*0.2;
    tokenBuff1N = (1 + (tokenUpgrade[1]**1.1)/5).toFixed(1);
    tokenBuff1L = (1 + ((tokenUpgrade[1]+1)**1.1)/5).toFixed(1);
    tokenBuff2N = 1 + tokenUpgrade[2]*0.1;
    tokenBuff2L = 1 + (tokenUpgrade[2]+1)*0.1;
    tokenBuff3N = (2.8 + tokenUpgrade[3]*0.01).toFixed(2);
    tokenBuff3L = (2.8 + (tokenUpgrade[3]+1)*0.01).toFixed(2)
    tokenBuff4N = 1 + tokenUpgrade[4];
    tokenBuff4L = 1 + (tokenUpgrade[4]+1)*1;
    tokenBuff5N = 600*0.9**tokenUpgrade[5];
    tokenBuff5L = 600*0.9**(tokenUpgrade[5]+1);
    tokenBuff6N = tokenUpgrade[6];
    tokenBuff6L = (tokenUpgrade[6]+1);
    playerHitPS = tokenBuff6N;
  }
  function masteryQuest() {
    if (totalToken < token) {
      totalToken = token;
    }
    $('#masteryQuest > div:eq(0)').html(function (index,html) {
      return 'Player Level (' + playerLevel + '/' + (masteryCompeleted[0]*5+35) + ')';
    });
    if (playerLevel >= (masteryCompeleted[0]*5+35)) {
      $('#masteryQuest > span:eq(0)').attr('class', 'buySkillPointY');
    } else {
      $('#masteryQuest > span:eq(0)').attr('class', 'buySkillPointN');
    }
    $('#masteryQuest > div:eq(1)').html(function (index,html) {
      return 'Collect Token (' + totalToken.toFixed(0) + '/' + (1000*2**masteryCompeleted[1]) + ')';
    });
    if (token >= (1000*2**masteryCompeleted[1])) {
      $('#masteryQuest > span:eq(1)').attr('class', 'buySkillPointY');
    } else {
      $('#masteryQuest > span:eq(1)').attr('class', 'buySkillPointN');
    }
    totTokenUpgrede = 0;
    for (var i = 0; i < tokenUpgrade.length; i++) {
      totTokenUpgrede += tokenUpgrade[i];
    }
    $('#masteryQuest > div:eq(2)').html(function (index,html) {
      return 'Token Upgrade (' + totTokenUpgrede + '/' + (100*(masteryCompeleted[2]+1)) + ')';
    });
    if (totTokenUpgrede >= (100*(masteryCompeleted[2]+1))) {
      $('#masteryQuest > span:eq(2)').attr('class', 'buySkillPointY');
    } else {
      $('#masteryQuest > span:eq(2)').attr('class', 'buySkillPointN');
    }
    for (var i = 3; i < 13; i++) {
      if (masteryCompeleted[((stagePage-1)*10+i)] >= 1) {
        $('#masteryQuest > div:eq(' + i + ')').hide();
        $('#masteryQuest > span:eq(' + i + ')').hide();
        $('#masteryQuest > br:eq(' + i + ')').hide();
      } else {
        $('#masteryQuest > div:eq(' + i + ')').html(function (index,html) {
          $('#masteryQuest > div:eq(' + i + ')').show();
          $('#masteryQuest > span:eq(' + i + ')').show();
          $('#masteryQuest > br:eq(' + i + ')').show();
          return 'Monster Lv' + ((stagePage-1)*10+i-2) + ' (' + mobKilled[((stagePage-1)*10+i-2)] + '/' + ((1000+500*(stagePage-1))*1.3**(masteryCompeleted[((stagePage-1)*10+i)])).toFixed(0) + ')';
        });
        if (mobKilled[((stagePage-1)*10+i-2)] >= ((1000+500*(stagePage-1))*1.3**(masteryCompeleted[((stagePage-1)*10+i)])).toFixed(0)) {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointY');
        } else {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointN');
        }
      }
    }
    for (var i = 13; i < 18; i++) {
      if (masteryCompeleted[((stagePage-1)*5+i)+90] >= 1) {
        $('#masteryQuest > div:eq(' + i + ')').hide();
        $('#masteryQuest > span:eq(' + i + ')').hide();
        $('#masteryQuest > br:eq(' + i + ')').hide();
      } else {
        $('#masteryQuest > div:eq(' + i + ')').html(function (index,html) {
          $('#masteryQuest > div:eq(' + i + ')').show();
          $('#masteryQuest > span:eq(' + i + ')').show();
          $('#masteryQuest > br:eq(' + i + ')').show();
          return 'Sword Nr' + ((stagePage-1)*5+i-12) + ' (' + weaponLevel[((stagePage-1)*5+i-12)] + '/' + '999' + ')';
        });
        if (weaponLevel[((stagePage-1)*5+i-12)] >= 999) {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointY');
        } else {
          $('#masteryQuest > span:eq(' + i + ')').attr('class', 'buySkillPointN');
        }
      }
    }
  }
  function mastery() {
    masteryBuff00 = (playerLevel >= 30) ? (playerLevel - 30)*0.05 + 2 : 2;
    masteryBuff01 = 0.5;
    masteryBuff02 = collectedWeapon/9990 + 1;
    masteryBuff03 = (playerLevel >= 30) ? (playerLevel - 30)*0.15 + 2 : 2;
    masteryBuff10 = 0.01;
    masteryBuff11 = 0.02;
    masteryBuff12 = (playerLevel >= 30) ? (playerLevel - 30)*0.5 + 5 : 5;
    masteryBuff13 = 0.99;
    masteryBuff20 = 1;
    masteryBuff21 = 1;
    masteryBuff22 = 1;
    masteryBuff23 = 1;
    $('#skillPoint').html(function (index,html) {
      return 'You Have ' + playerSP + ' Skill Point';
    });
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        eval('masteryBuff' + i + j + 'R = (masteryBought[' + (i*4+j) + '] == 1) ? masteryBuff' + i + j + ' : 1');
        $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ') > p:eq(0)').html(function (index,html) {
          return masteryInfo[i*4+j] + '<br>' + ((eval('masteryBuff' + i + j) >= 1) ? "x" + eval('masteryBuff' + i + j).toFixed(2) : (eval('masteryBuff' + i + j)*100).toFixed(0) + "%");
        });
        $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ') > p:eq(1)').html(function (index,html) {
          return masteryPrice[i*4+j] + ' SP';
        });
        if (masteryBought[i*4+j] == 1) {
          $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ')').attr({
            'class' : 'skillSel skillY'
          });
        } else if (masteryPrice[i*4+j] <= playerSP) {
          $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ')').attr({
            'class' : 'skillSel skillM'
          });
        } else {
          $('.skillLine:eq(' + i + ') > .skillSel:eq(' + j + ')').attr({
            'class' : 'skillSel skillN'
          });
        }
      }
    }
  }
  function translateFun() {
    for (var i = 0; i < toTranslate.length; i++) {
      translateString = toTranslate[i] + ' = ' + toTranslate[i] + translate[translateNum]
      eval(translateString);
    }
    $('#translate').html(function (index,html) {
      return translate[translateNum];
    });
  }
  function setPopup(msg) {
    setTimeout(function() {
      $('#popupLayer').html(function (index,html) {
        return msg;
      });
  		$('#popupLayer').css({
  			"top": divTop,
  			"left": divLeft,
  			"position": "absolute"
  		}).show();
      var timerId1 = setTimeout(function() {
        $('#popupLayer').hide();
      }, 1000);
    }, 0);
  }
  function setDmg(msg) {
    setTimeout(function() {
      $('#popupDmg').html(function (index,html) {
        return '-' + notation(msg) + ' hp';
      });
  		$('#popupDmg').css({
  			"top": divTop,
  			"left": divLeft,
  			"position": "absolute"
  		}).show();
      var timerId1 = setTimeout(function() {
        $('#popupDmg').hide();
      }, 100);
    }, 0);
  }
  function setToken(msg) {
    setTimeout(function() {
      $('#popupToken').html(function (index,html) {
        return '+' + notation(msg) + ' token';
      });
  		$('#popupToken').css({
  			"top": divTop,
  			"left": divLeft,
  			"position": "absolute"
  		}).show();
      var timerId1 = setTimeout(function() {
        $('#popupToken').hide();
      }, 500);
    }, 0);
  }
  function lv0Skip() {
    for (var i = 0; i < varData.length; i++) {
      this[varData[i]] = resetData[i];
    }
  }
  function lv11Skip() {
    playerLevel = 11;
    stageUnlocked = 2;
    token = 200;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];
  }
  function lv31Skip() {
    playerLevel = 31;
    stageUnlocked = 4;
    token = 5000;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];
  }
  function lv71Skip() {
    playerLevel = 71;
    stageUnlocked = 8;
    token = 100000;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];
  }
  function lv101Skip() {
    playerLevel = 101;
    stageUnlocked = 11;
    token = 500000;
    lootQuantity = [
      '0',
      0, 0,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
      1000, 1000, 1000, 1000,
    ];
  }
  $("#mainNav > div").click(function () {
    a = $("#mainNav > div").index(this);
    menuCheck = 0;
    switch (a) {
      case 3:
        if (playerLevel >= 11) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 11 + ' ' + popupMsg[2]);
        }
        break;
      case 4:
        if (playerLevel >= 31) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 31 + ' ' + popupMsg[2]);
        }
        break;
      case 5:
        if (playerLevel >= 71) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 71 + ' ' + popupMsg[2]);
        }
        break;
      case 6:
        if (playerLevel >= 101) {
          menuCheck = 1;
        } else {
          setPopup(popupMsg[1] + ' ' + 101 + ' ' + popupMsg[2]);
        }
        break;
      default:
        menuCheck = 1;
    }
    if (menuCheck == 1) {
      $("#menusWarp > div").hide();
      $("#menusWarp > div:eq(" + a + ")").show();
      menuPage = $("#mainNav > div").index(this);
      gameDisplay();
    }
  });
  $(".lootItem").click(function () {
    setTimeout( function (){
      loot();
      playerStatus();
    }, 0);
  });
  $("#EXPBottleC").click(function () {
    if (1 == 2) {
      if (lootQuantity[1] >= 1) {
        if (lootQuantity[1] < bulkOpen) {
          bulk = lootQuantity[1];
        } else {
          bulk = bulkOpen;
        }
        lootQuantity[1] = lootQuantity[1] - bulk;
        a = 1;
        while (a <= bulk) {
          playerExp = playerExp + Math.random()*playerExpNeed/(3*((playerLevel+1)**1.2))/5*bulk;
          a++;
        }
      }
    } else {
      setPopup('Comming Soon');
    }
  });
  $("#tierLoot > span").click(function () {
    a = $("#tierLoot > span").index(this);
    b = (lootPage - 1)*4 + a + 3;
    if (lootQuantity[b] >= 1) {
      if (lootQuantity[b] < bulkOpen) {
        bulk = lootQuantity[b]
      } else {
        bulk = bulkOpen;
      }
      lootQuantity[b] = lootQuantity[b] - bulk;
      c = 1;
      gotWeapon = [0, 0, 0];
      luckP = 0;
      if (masteryBuff11R != 1) {
        luckP = masteryBuff11R*100;
      }
      while (c <= bulk) {
        luck = Math.floor(Math.random()*100);
        if ((b-2)%2 == 1) {
          if (0 <= luck && luck< 20+(lootPage-1)*2) {
            playerExp = playerExp + Math.random()*(2.8**((b-2)*2))*tokenBuff2N*masteryBuff02;
          } else if (20+(lootPage-1)*2-luckP <= luck && luck < 85+(lootPage-1)-luckP) {
            gotWeapon[0]++;
          } else if (85+(lootPage-1)-luckP <= luck && luck < 98-luckP) {
            gotWeapon[1]++;
          } else if (98-luckP <= luck && luck <= 100 && a == 3) {
            lootQuantity[1] = lootQuantity[1] + Math.floor(Math.random()*(5+(b-3)));
            gotWeapon[2]++;
          }
        } else {
          if (0 <= luck && luck< 20+(lootPage-1)*2) {
            playerExp = playerExp + Math.random()*(2.8**(b*2))*tokenBuff2N*masteryBuff02;
          } else if (20+(lootPage-1)*2-luckP <= luck && luck < 85+(lootPage-1)-luckP) {
            gotWeapon[0]++;
          } else if (85+(lootPage-1)-luckP <= luck && luck < 98-luckP) {
            gotWeapon[1]++;
          } else if (98-luckP <= luck && luck <= 100 && a == 3) {
            lootQuantity[1] = lootQuantity[1] + Math.floor(Math.random()*(5+(b-3)));
            gotWeapon[2]++;
          }
        }
        c++;
      }
      if ((b-2)%2 == 1) {
        gotWeaponCalc(((lootPage-1)*5+1+a), gotWeapon[0]);
        gotWeaponCalc(((lootPage-1)*5+2+a), gotWeapon[1]);
        gotWeaponCalc(((lootPage)*5), gotWeapon[2]);
      } else {
        gotWeaponCalc(((lootPage-1)*5+1+a), gotWeapon[0]);
        gotWeaponCalc(((lootPage-1)*5+a), gotWeapon[1]);
        gotWeaponCalc(((lootPage)*5), gotWeapon[2]);
      }
    }
  });
  $("#weaponWarp > .weaponBg").click(function () {
    a = (weaponPage-1)*5 + $("#weaponWarp > .weaponBg").index(this) + 1;
    if (weaponLevel[a] >= 1) {
      $('#weaponName').html(function (index,html) {
        return weaponName[a] + ' +' + weaponLevel[a];
      });
      $('#totalWeaponStatus').html(function (index,html) {
        return 'Dmg: ' + notation(((a*2)**(1+(a*2)/5)*10)/(1+(a*2)**3)*weaponLevel[a]);
      });
    }
  });
  $("#monster").click(function () {
    $('.monsterMove').css("bottom", (Math.random()-0.5)*10 + 'px');
    $('.monsterMove').css("right", (Math.random()-0.5)*10 + 'px');
    setTimeout(function(){
      $('.monsterMove').css("bottom", 0);
      $('.monsterMove').css("right", 0);
    }, 50);
    infDmg = playerDmg*tokenBuff1N*(Math.random()*0.4+0.8);
    hitMonster(infDmg);
    setDmg(infDmg*tokenBuff0N*masteryBuff00R);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < tokenBuff4N) {
      token += 1*masteryBuff03R;
      totalToken += 1*masteryBuff03R;
      setToken(1*masteryBuff03R);
    }
  });
  $("#popupDmg").click(function () {
    infDmg = playerDmg*tokenBuff1N*(Math.random()*0.4+0.8);
    hitMonster(infDmg);
    setDmg(infDmg*tokenBuff0N*masteryBuff00R);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < tokenBuff4N) {
      token += 1*masteryBuff03R;
      totalToken += 1*masteryBuff03R;
      setToken(1*masteryBuff03R);
    }
  });
  $("#popupToken").click(function () {
    infDmg = playerDmg*tokenBuff1N*(Math.random()*0.4+0.8);
    hitMonster(infDmg);
    setDmg(infDmg*tokenBuff0N*masteryBuff00R);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < tokenBuff4N) {
      token += 1*masteryBuff03R;
      totalToken += 1*masteryBuff03R;
      setToken(1*masteryBuff03R);
    }
  });
  $("#stageL").click(function () {
    if (stagePage > 1) {
      stagePage = stagePage - 1;
      stageChange();
      masteryQuest();
    }
  });
  $("#stageR").click(function () {
    if (stagePage < stageUnlocked && stagePage < 10) {
      stagePage = stagePage + 1;
      stageChange();
      masteryQuest();
    } else if (stagePage >= 10) {
      setPopup(popupMsg[0]);
    } else {
      setPopup(popupMsg[1] + ' ' + ((stagePage*10)+1) + ' ' + popupMsg[2]);
    }
  });
  $("#masteryQuest > span").click(function () {
    a = $("#masteryQuest > span").index(this);
    strA = 0;
    if (a == 0) {
      if (playerLevel >= (masteryCompeleted[0]*5+35)) {
        masteryCompeleted[0]++;
        playerSP += 3;
        strA = 3;
      }
    } else if (a == 1) {
      if (totalToken >= (1000*2**masteryCompeleted[1])) {
        masteryCompeleted[1]++;
        playerSP += 2;
        strA = 2;
      }
    } else if (a == 2) {
      if (totTokenUpgrede >= (100*(masteryCompeleted[2]+1))) {
        masteryCompeleted[2]++;
        playerSP += 2;
        strA = 2;
      }
    } else if (3 <= a && a <= 12) {
      if (mobKilled[((stagePage-1)*10+a-2)] >= ((1000+500*(stagePage-1))*1.3**(masteryCompeleted[((stagePage-1)*10+a)])).toFixed(0)) {
        masteryCompeleted[(stagePage-1)*10+a]++;
        playerSP += 1;
        strA = 1;
      }
    } else if (13 <= a && a <= 16) {
      if (weaponLevel[((stagePage-1)*5+a-12)] >= 999 && masteryCompeleted[((stagePage-1)*5+a)+90] < 1) {
        masteryCompeleted[((stagePage-1)*5+a)+90]++;
        playerSP += 1;
        strA = 1;
      }
    } else if (a == 17) {
      if (weaponLevel[((stagePage-1)*5+a-12)] >= 999 && masteryCompeleted[((stagePage-1)*5+a)+90] < 1) {
        masteryCompeleted[((stagePage-1)*5+a)+90]++;
        playerSP += 3;
        strA = 3;
      }
    }
    if (strA > 0) {
      extraStstusSet('<span class="sp">You Got ' + strA + ' SP (Have ' + playerSP + ')</span>');
    }
  });
  $("#lootL").click(function () {
    if (lootPage > 1) {
      lootPage = lootPage - 1;
      lootChange();
    }
  });
  $("#lootR").click(function () {
    if (lootPage < stageUnlocked && lootPage < 10) {
      lootPage = lootPage + 1;
      lootChange();
    }
  });
  $("#weaponL").click(function () {
    if (weaponPage > 1) {
      weaponPage = weaponPage - 1;
      weaponChange();
    }
  });
  $("#weaponR").click(function () {
    if (weaponPage < stageUnlocked && weaponPage < 10) {
      weaponPage = weaponPage + 1;
      weaponChange();
    }
  });
  $("#bulk1").click(function () {
    bulkOpen = 1;
  });
  $("#bulk2").click(function () {
    bulkOpen = 10;
  });
  $("#bulk3").click(function () {
    bulkOpen = 100;
  });
  $("#bulk4").click(function () {
    bulkOpen = 1000;
  });
  $("#bulk5").click(function () {
    bulkOpen = 10000000;
  });
  $("#resetButton").click(function () {
    if(confirm("Reset game?") == true){
      gameReset();
    }
    else{
      return ;
    }
  });
  $("#exportButton").click(function () {
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    prompt('Exported Save', btoa(JSON.stringify(saveFile)));
  });
  $("#importButton").click(function () {
    var inputedSaveN = prompt('Import Save', '');
    var inputedSave = atob(inputedSaveN);
    if (inputedSave != null && inputedSave != '') {
      var cookies = document.cookie.split(";");
      const savedFile = JSON.parse(inputedSave);
      dataCopy = JSON.parse(JSON.stringify(resetData));
      Object.assign(dataCopy, savedFile);
      setTimeout(function(){
        for (var i = 0; i < varData.length; i++) {
          this[varData[i]] = dataCopy[i];
        }
      }, 0);
    }
  });
  $("#translate").click(function () {
    translateNum++;
    if (translateNum > translate.length-1) {
      translateNum = 0;
    }
    translateFun();
  });
  $("#codeButton").click(function () {
    inputedCode = prompt('Enter Code', '');
    if (inputedCode == 'DEVskip121') {
      lv0Skip();
      lv11Skip();
    } else if (inputedCode == 'DEVskip961') {
      lv0Skip();
      lv31Skip();
    } else if (inputedCode == 'DEVskip5041') {
      lv0Skip();
      lv71Skip();
    } else if (inputedCode == 'DEVskip10201') {
      lv0Skip();
      lv101Skip();
    }
    switch (inputedCode) {
      case 'secret':
        if (codeEnterd[0] == 0) {
          codeEnterd[0]++;
          totalCode++;
          playerLevel++;
          token += 10000;
          extraStstusSet('<span class="code">Code:secret, You got a Level and 10k tokens (' + totalCode + ')</span>');
        }
        break;
      case 'first code':
        if (codeEnterd[1] == 0) {
          codeEnterd[1]++;
          totalCode++;
          playerLevel++;
          token += 10000;
          extraStstusSet('<span class="code">Code:first code, You got a Level and 10k tokens (' + totalCode + ')</span>');
        }
        break;
      case 'Code':
        if (codeEnterd[2] == 0) {
          codeEnterd[2]++;
          totalCode++;
          playerLevel++;
          token += 10000;
          extraStstusSet('<span class="code">Code:code, You got a Level and 10k tokens (' + totalCode + ')</span>');
        }
        break;
    }
  });
  $("#changeNotation").click(function () {
    notationForm++;
    if (notationForm > 1) {
      notationForm = 0;
    }
  });
  $(".tokenList").click(function () {
    clickedA = $("#tokenShopList > .tokenList").index(this);
  });
  $(".tokenBuy").click(function () {
    setTimeout(function() {
      if (tokenUpgradePrice[clickedA] <= token && tokenUpgradeCap[clickedA] > tokenUpgrade[clickedA]) {
        token = token - tokenUpgradePrice[clickedA];
        tokenUpgrade[clickedA]++;
        switch (clickedA) {
          case 0:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+tokenUpgrade[clickedA]+3).toFixed(0));
            break;
          case 1:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+tokenUpgrade[clickedA]*2).toFixed(0));
            break;
          case 2:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+10+tokenUpgrade[clickedA]*4).toFixed(0));
            break;
          case 3:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]*1.7).toFixed(0));
            break;
          case 4:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+(tokenUpgrade[clickedA])**1.5+1).toFixed(0));
            break;
          case 5:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]*1.2).toFixed(0));
            tokenTimer = tokenBuff5N;
            break;
          case 6:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+100).toFixed(0));
            break;
        }
        tokenShop();
        playerStatus();
      }
    }, 0);
  });
  $(".skillSel").click(function () {
    a = $(".skillLine > .skillSel").index(this);
    if (masteryBought[a] != 1) {
      if (playerSP >= masteryPrice[a]) {
        playerSP -= masteryPrice[a];
        masteryBought[a] = 1;
      }
    } else {
      playerSP += masteryPrice[a];
      masteryBought[a] = 0;
    }
    mastery();
  });
  $('*').click(function(e){
    var sWidth = window.innerWidth;
		var sHeight = window.innerHeight;
		var oWidth = $('.popupLayer').width();
		var oHeight = $('.popupLayer').height();
		divLeft = e.clientX + 10;
		divTop = e.clientY - 50;
		if( divLeft + oWidth > sWidth ) divLeft -= oWidth;
		if( divTop + oHeight > sHeight ) divTop -= oHeight;
		if( divLeft < 0 ) divLeft = 0;
		if( divTop < 0 ) divTop = 0;
	});

  playerLevel = 1;
  stageUnlocked = 1;
  monsterDefeated = 0;
  playerExp = 0;
  playerExpNeed = 10;
  playerSP = 0;
  token = 0;
  totalToken = 0;
  coin = 0;
  cps = 0;
  monsterNow = 1
  collectedWeapon = 0;
  weaponMastery = 0;
  stagePage = 1;
  lootPage = 1;
  weaponPage = 1;
  menuPage = 0;
  weaponSelect = 0;
  playerDmg = 1;
  playerHitPS = 1;
  bulkOpen = 1;
  translateNum = 0;
  ehhhhhhhhhhh = '이예ㅔㅔㅔㅔㅔ';
  debugStr = 0;
  brokeUniverse = 0;
  rareMob = 0;
  extraStatus = ['', '', '', '', '', '', '', '', '', ''];
  tokenTimer = 600;
  playtime = 0;
  totalCode = 0;
  notationForm = 0;
  mastery();
  monsterHpCalc();

  $("#menusWarp > div").hide();
  $("#menusWarp > div:eq(0)").show();
  gameLoad();
  gameDisplay();
  extraStstusSet('<span class="discord"><a href="https://discord.gg/wkdVQxT" target="_blank">Join My Discord Server!</a></span>');
  rand = Math.floor(Math.random()*4);
  extraStstusSet(extraStatusTips[rand]);
  setTimeout(function(){
    $('#warpAll2').show();
    $("#warpAll").attr({
      'style' : 'background-image: url(bg/white.png);'
    });
  }, 3000);
  setInterval( function (){
    playtime += 2.7777777777e-6;
    hitMonster(playerDmg/100*(playerHitPS+1));
    if (masteryBuff13R != 1 && Math.random() < (1 + tokenUpgrade[4])/10000) {
      token += 1*masteryBuff03R*(1 + tokenUpgrade[6]);
      totalToken += 1*masteryBuff03R*(1 + tokenUpgrade[6]);
    }
    tokenTimer = tokenTimer - 0.01;
    if (tokenTimer > 600*0.9**tokenUpgrade[5]) {
      tokenTimer = 600*0.9**tokenUpgrade[5];
    }
    if (tokenTimer <= 0) {
      token += 1*masteryBuff03R*masteryBuff12R;
      totalToken += 1*masteryBuff03R*masteryBuff12R;
      tokenTimer = tokenBuff5N;
      tokenShop();
    }
    playerStatus();
  }, 10);
  setInterval( function (){
    gameSave();
    gameDisplay();
  }, 1000);
});
