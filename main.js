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
  function gameSave() {
    var date = new Date();
    date.setDate(date.getDate() + 2000);

    var willCookie = "";
    willCookie += "saveData=";
    a = 0;
    var willCookieString = '{';
    while ((a+1) <= varData.length) {
      willCookieString += varData[a] + ':' + eval(varData[a]) + ',';
      a++;
    }
    willCookieString += '}';
    willCookie += JSON.stringify(willCookieString);
    willCookie += ";expires=" + date.toUTCString();

    document.cookie = willCookie;
  }
  function gameLoad() {
    var cookies = document.cookie.split(";");
    for(var i in cookies) {
      if(cookies[i].search('saveData') != -1) {
        JSON.parse(decodeURIComponent(cookies[i].replace('saveData' + "=", "")));
      }
    }
    var willCookieString = '{';
    var cookies = document.cookie.split(";");
    for(var i in cookies) {
      if(cookies[i].search('CookieName') != -1) {
        savedFile = decodeURIComponent(cookies[i].replace('CookieName' + "=", ""));
      }
    }
    a = 0;
    const obj = JSON.parse(json);
    while ((a+1) <= varData.length) {
      varName = varData[a];
      eval(varName = obj.varName;);
      a++;
    }
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
      return notation(token) + ' token';
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
    $('#EXPBottleQ').html(function (index,html) {
      return '경험치 병 - ' + lootQuantity[1];
    });
    $('#mysteryChestQ').html(function (index,html) {
      return '의문의 상자 - ' + lootQuantity[2];
    });
    $('#tierLootMark').html(function (index,html) {
      return '티어 ' + lootPage;
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
        token = token + (Math.floor((weaponLevel[num])/10)-Math.floor((weaponLevel[num]-quantity)/10));
        collectedWeapon = collectedWeapon + quantity;
        if (weaponLevel[num] == 999) {
          strA = '<span class="maxLv">' + weaponName[num] + ' 999강화 달성! +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num] + '</span>'
          token = token + 10;
        } else {
          if (num%5 == 0) {
            strA = '<span class="rare">' + weaponName[num] + ' 획득! +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num] + '</span>'
          } else {
            strA = weaponName[num] + ' 획득! +' + (weaponLevel[num]-quantity) + ' ▶ +' + weaponLevel[num];
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
    monsterHp = monsterHp - dmg;
    if (monsterHp <= 0) {
      playerExp = playerExp + Math.random()*(2.85**(monsterNow));
      luck = Math.floor(Math.random()*100);
      loot1Chance = (50-(stagePage-1)*3)*(1-(((monsterNow-1)%5))*0.25);
      if (0 <= luck &&  luck < 50+(stagePage-1)*3) {

      } else if (50+(stagePage-1)*3 <= luck && luck < 50+loot1Chance) {
        lootNum = (Math.ceil(monsterNow/5)*2)+1;
        lootQuantity[lootNum] = lootQuantity[lootNum] + 1;
        if (menuPage == 0) {
          extraStstusSet(lootName[lootNum-2] + ' 획득! (' + lootQuantity[lootNum] + '개 소지중)');
        }
        loot();
      } else if (50+loot1Chance <= luck && luck < 100) {
        lootNum = (Math.ceil(monsterNow/5)*2)+2;
        lootQuantity[lootNum] = lootQuantity[lootNum] + 1;
        if (menuPage == 0) {
          extraStstusSet(lootName[lootNum-2] + ' 획득! (' + lootQuantity[lootNum] + '개 소지중)');
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
  $("#mainNav > div").click(function () {
    a = $("#mainNav > div").index(this);
    $("#menusWarp > div").hide();
    $("#menusWarp > div:eq(" + a + ")").show();
    menuPage = $("#mainNav > div").index(this);
    switch ($("#mainNav > div").index(this)) {
      case 0:
        monsterStatus();
        break;
      case 1:
        loot();
        break;
      case 2:
        weapon();
        break;
    }
  });
  $(".lootItem").click(function () {
    setTimeout( function (){
      loot();
      playerStatus();
    }, 0);
  });
  $("#EXPBottleC").click(function () {
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
            playerExp = playerExp + Math.random()*(2.8**((b-2)*2));
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
            playerExp = playerExp + Math.random()*(2.8**(b*2));
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
        return 'Dmg: ' + notation(((a*2)**(1+(a*2)/10)*10)/(100*(a/1.5))*weaponLevel[a]) + '<br>' + 'Hit/s: ' + Math.floor(weaponLevel[a]/100);
      });
    }
  });
  $("#monster").click(function () {
    hitMonster(playerDmg);
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

  $("#menusWarp > div").hide();
  $("#menusWarp > div:eq(0)").show();
  playerStatus();
  monsterStatus();
  loot();
  weapon();
  gameLoad();
  rand = Math.floor(Math.random()*6);
  extraStstusSet(extraStatusTips[rand]);
  setInterval( function (){
    hitMonster(playerDmg/100*playerHitPS);
  }, 10);
  setInterval( function (){
    gameSave();
  }, 5000);
});
