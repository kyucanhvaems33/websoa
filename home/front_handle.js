function login(evt,way) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(way).style.display = "flex";
    evt.currentTarget.className += " active";
}

var i, tabcontent;
tabcontent = document.getElementsByClassName("tabcontent");
for (i = 1; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
}