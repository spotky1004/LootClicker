$(function (){
  function save() {
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
  function load() {
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
      eval(varName);
      a++;
    }
  }
});
