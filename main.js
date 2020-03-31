$(function (){
  function notation(num) {
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
        for (var i = 0; i < varData.length; i++) {
          this[varData[i]] = savedFile[i];
          console.log(typeof(savedFile[i]));
        }
        debugStr = savedFile;
      }
    }
  }
  function gameReset() {
    playerLevel = 0;
    stageUnlocked = 1;
    playerExp = 0;
    playerExpNeed = 10;
    token = 0;
    monsterNow = 1;
    monsterHpM = (monsterNow**(1+monsterNow/5)*10)*3;
    monsterHp = monsterHpM;
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
    extraStatus = ['', '', '', '', '', '', '', '', '', ''];
    lootQuantity = [
      '0',
      0, 0,
      0, 0, 0, 0,
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
    weaponLevel = [
      '0',
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
    ];
    tokenUpgrade = [
      0, 0, 0, 0, 0, 0
    ];
    tokenUpgradePrice = [
      3, 5, 10, 50, 5, 10
    ];
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
  }
  function playerStatus() {
    if (playerExp >= playerExpNeed) {
      playerExp = playerExp - playerExpNeed;
      playerLevel = playerLevel + 1;
      playerExpNeed = 3**playerLevel*10;
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
      stageUnlocked = Math.floor((playerLevel-1)/10)+1;
    }
    $('#playerLevel').html(function (index,html) {
      return 'Level ' + playerLevel;
    });
    $('#playerExp').html(function (index,html) {
      expPer = (playerExp / playerExpNeed * 100).toFixed(2);
      return ' - ' + notation(playerExp) + '/' + notation(playerExpNeed) + ' EXP (' + expPer + '%)';
    });
    $('#coin').html(function (index,html) {
      return notation(coin) + ' coin';
    });
    $('#token').html(function (index,html) {
      return notation(token) + ' token (' + tokenTimer.toFixed(0) + 's)';
    });
    $('.totalCombatStatus').html(function (index,html) {
      return 'Total Status<br>Dmg: ' + notation(playerDmg) + '<br>' + 'Hit/s: ' + playerHitPS;
    });
  }
  function monsterStatus() {
    $("#monster").attr({
      'style' : 'background-image: url(monster/' + monsterNow + '.png);'
    });
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
        $("#weaponWarp > .weapon:eq(" + (a-1) + ")").attr({
          'src' : 'weapon/' + weaponNum + '.png'
        });
        $("#weaponWarp > .weapon:eq(" + (a-1) + ")").attr({
          'style' : 'background-image: url(rank/' + weaponRank + '.png);'
        });
      } else {
        $("#weaponWarp > .weapon:eq(" + (a-1) + ")").attr({
          'src' : 'weapon/0.png'
        });
        $("#weaponWarp > .weapon:eq(" + (a-1) + ")").attr({
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
        playerDmg = playerDmg + ((num*2)**(1+(num*2)/5)*10)/(1+(num*2)**2)*quantity;
        playerHitPS = playerHitPS + (Math.floor((weaponLevel[num])/100)-Math.floor((weaponLevel[num]-quantity)/100));
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
    monsterHp = monsterHp - dmg*tokenBuff0N;
    if (monsterHp <= 0) {
      playerExp = playerExp + Math.random()*(tokenBuff3N**(monsterNow))*tokenBuff2N;
      luck = Math.floor(Math.random()*100);
      loot1Chance = (50-(stagePage-1)*3)*(1-(((monsterNow-1)%5))*0.25);
      if (0 <= luck &&  luck < 50+(stagePage-1)*3) {

      } else if (50+(stagePage-1)*3 <= luck && luck < 50+loot1Chance) {
        lootNum = (Math.ceil(monsterNow/5)*2)+1;
        lootQuantity[lootNum] = lootQuantity[lootNum] + 1;
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
          extraStstusSet(translateTxt + lootName[lootNum-2] + ' ' + translateTxt2 + '! (' + translateTxt3 + lootQuantity[lootNum] + translateTxt4 + ')');
        }
        loot();
      } else if (50+loot1Chance <= luck && luck < 100) {
        lootNum = (Math.ceil(monsterNow/5)*2)+2;
        lootQuantity[lootNum] = lootQuantity[lootNum] + 1;
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
          extraStstusSet(translateTxt + lootName[lootNum-2] + ' ' + translateTxt2 + '! (' + translateTxt3 + lootQuantity[lootNum] + translateTxt4 + ')');
        }
        loot();
      }
      summonMonster();
      monsterHpM = (monsterNow**(1+monsterNow/5)*10)*3;
      monsterHp = monsterHpM;
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
    monsterHpM = (monsterNow**(1+monsterNow/5)*10)*3;
    monsterHp = monsterHpM;
    monsterStatus();
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
      return 'You Have ' + token + ' Tokens'
    });
    $('#tokenBuff1').html(function (index,html) {
      return 'x' + tokenBuff0N + ' -> x'+ tokenBuff0L
    });
    $('#tokenBuff2').html(function (index,html) {
      return 'x' + tokenBuff1N + ' -> x'+ tokenBuff1L
    });
    $('#tokenBuff3').html(function (index,html) {
      return 'x' + tokenBuff2N + ' -> x'+ tokenBuff2L
    });
    $('#tokenBuff4').html(function (index,html) {
      return '^' + tokenBuff3N + ' -> ^'+ tokenBuff3L
    });
    $('#tokenBuff5').html(function (index,html) {
      return tokenBuff4N + '% -> '+ tokenBuff4L + '%'
    });
    $('#tokenBuff6').html(function (index,html) {
      return tokenBuff5N + 's -> '+ tokenBuff5L + 's'
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
  }
  function tokenBuffCalc() {
    tokenBuff0N = 1 + tokenUpgrade[0]*0.2;
    tokenBuff0L = 1 + (tokenUpgrade[0]+1)*0.2;
    tokenBuff1N = 1 + tokenUpgrade[1]*(tokenUpgrade[1]+1)/2;
    tokenBuff1L = 1 + (tokenUpgrade[1]+1)*(tokenUpgrade[1]+2)/2;
    tokenBuff2N = 1 + tokenUpgrade[2]*0.1;
    tokenBuff2L = 1 + (tokenUpgrade[2]+1)*0.1;
    tokenBuff3N = (2.85 + tokenUpgrade[3]*0.01).toFixed(2);
    tokenBuff3L = (2.85 + (tokenUpgrade[3]+1)*0.01).toFixed(2)
    tokenBuff4N = 1 + tokenUpgrade[4];
    tokenBuff4L = 1 + (tokenUpgrade[4]+1)*1;
    tokenBuff5N = 120 - tokenUpgrade[5]*2;
    tokenBuff5L = 120 - (tokenUpgrade[5]+1)*2;
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
  $("#mainNav > div").click(function () {
    a = $("#mainNav > div").index(this);
    menuCheck = 0;
    if (a != 3 && a != 4) {
      menuCheck = 1;
    } else if (a == 3) {
      if (playerLevel >= 31) {
        menuCheck = 1;
      } else {
        setPopup(popupMsg[1] + ' ' + 31 + ' ' + popupMsg[2]);
      }
    } else if (a == 4) {
      if (playerLevel >= 101) {
        menuCheck = 1;
      } else {
        setPopup(popupMsg[1] + ' ' + 101 + ' ' + popupMsg[2]);
      }
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
      while (c <= bulk) {
        luck = Math.floor(Math.random()*100);
        if ((b-2)%2 == 1) {
          if (0 <= luck && luck< 20+(lootPage-1)*2) {
            playerExp = playerExp + Math.random()*(2.8**((b-2)*2))*tokenBuff2N;
          } else if (20+(lootPage-1)*2 <= luck && luck < 85+(lootPage-1)*1) {
            gotWeapon[0]++;
          } else if (85+(lootPage-1)*1 <= luck && luck < 98) {
            gotWeapon[1]++;
          } else if (98 <= luck && luck <= 100) {
            lootQuantity[1] = lootQuantity[1] + Math.floor(Math.random()*(5+(b-3)));
            gotWeapon[2]++;
          }
        } else {
          if (0 <= luck && luck< 20+(lootPage-1)*2) {
            playerExp = playerExp + Math.random()*(2.8**(b*2))*tokenBuff2N;
          } else if (20+(lootPage-1)*2 <= luck && luck < 85+(lootPage-1)*1) {
            gotWeapon[0]++;
          } else if (85+(lootPage-1)*1 <= luck && luck < 98) {
            gotWeapon[1]++;
          } else if (98 <= luck && luck <= 100) {
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
  $("#weaponWarp > .weapon").click(function () {
    a = (weaponPage-1)*5 + $("#weaponWarp > .weapon").index(this) + 1;
    if (weaponLevel[a] >= 1) {
      $('#weaponName').html(function (index,html) {
        return weaponName[a] + ' +' + weaponLevel[a];
      });
      $('#totalWeaponStatus').html(function (index,html) {
        return 'Dmg: ' + notation(((a*2)**(1+(a*2)/5)*10)/(1+(a*2)**2)*weaponLevel[a]) + '<br>' + 'Hit/s: ' + Math.floor(weaponLevel[a]/100);
      });
    }
  });
  $("#monster").click(function () {
    hitMonster(playerDmg*tokenBuff1N);
    luck = Math.floor(Math.random()*100);
    if (0 <= luck &&  luck < 50+(stagePage-1)*3) {

    }
  });
  $("#stageL").click(function () {
    if (stagePage > 1) {
      stagePage = stagePage - 1;
      stageChange();
    }
  });
  $("#stageR").click(function () {
    if (stagePage < stageUnlocked && stagePage < 10) {
      stagePage = stagePage + 1;
      stageChange();
    } else if (stagePage >= 10) {
      setPopup(popupMsg[0]);
    } else {
      setPopup(popupMsg[1] + ' ' + ((stagePage*10)+1) + ' ' + popupMsg[2]);
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
    prompt('Exported Save', saveFile);
  });
  $("#importButton").click(function () {
    var inputedSave = prompt('Import Save', '');
    if (inputedSave != '') {
      var date = new Date();
      date.setDate(date.getDate() + 2000);
      var willCookie = "";
      willCookie += "saveData=";
      willCookie += JSON.parse(inputedSave);
      willCookie += ";expires=" + date.toUTCString();
      document.cookie = willCookie;
      gameLoad();
    }
  });
  $("#translate").click(function () {
    translateNum++;
    if (translateNum > translate.length-1) {
      translateNum = 0;
    }
    translateFun();
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
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+3).toFixed(0));
            break;
          case 1:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]*1.15).toFixed(0));
            break;
          case 2:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+10).toFixed(0));
            break;
          case 3:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]*3).toFixed(0));
            break;
          case 4:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+(tokenUpgrade[clickedA]+5)).toFixed(0));
            break;
          case 5:
            tokenUpgradePrice[clickedA] = Number((tokenUpgradePrice[clickedA]+20).toFixed(0));
            break;
        }
        tokenShop();
        playerStatus();
      }
    }, 0);
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
  token = 0;
  tokenTimer = 120;
  monsterNow = 1;
  monsterHpM = (monsterNow**(1+monsterNow/5)*10)*3;
  monsterHp = monsterHpM;
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
  extraStatus = ['', '', '', '', '', '', '', '', '', ''];

  $("#menusWarp > div").hide();
  $("#menusWarp > div:eq(0)").show();
  gameLoad();
  gameDisplay();
  rand = Math.floor(Math.random()*6);
  extraStstusSet(extraStatusTips[rand]);
  setInterval( function (){
    hitMonster(playerDmg/100*playerHitPS);
    tokenTimer = tokenTimer - 0.01;
    if (tokenTimer <= 0) {
      token = token + 1;
      tokenTimer = tokenBuff5N;
    }
    playerStatus();
  }, 10);
  setInterval( function (){
    gameSave();
    gameDisplay();
  }, 2500);
});
