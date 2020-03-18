$(function (){
  var date = new Date();
  date.setDate(date.getDate() + 7);

  var willCookie = "";
  willCookie += "CookieName=Value;";
  willCookie += "expires=" + date.toUTCString();

  document.cookie = willCookie;
});
