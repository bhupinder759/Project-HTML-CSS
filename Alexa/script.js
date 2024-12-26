// reload the page

window.onload = function () {
  document.getElementById("reload").onclick = function () {
    location.reload();
    document.getElementsByClassName(".main")[0].style.transform = "translateX(150)";
  };
};

//scroll view all products

function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);
