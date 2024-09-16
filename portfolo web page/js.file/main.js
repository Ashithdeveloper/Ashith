/*========================typing animation========================= */
var typed = new Typed(".typing", {
  strings: ["web Designer", "web Developer", "Graphic Designer"],
  typeSpeed: 100,
  BackSpeed: 60,
  loop: true,
});
/*======================== Aside ========================= */
const nav = document.querySelector(".nav"),
  navlist = nav.querySelectorAll("li"),
  totalNavList = navlist.length,
  allSection = document.querySelectorAll(".section"),
  totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
  const a = navlist[i].querySelector("a");
  a.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of anchor tag
    for (let i = 0; i < totalSection; i++) {
      allSection[i].classList.remove("back-section");
    }
    for (let j = 0; j < totalNavList; j++) {
      if (navlist[j].querySelector("a").classList.add("back-section")) {
        allSection[j].classList.add("bank-section");
      }
      navlist[j].querySelector("a").classList.remove("active");
    }
    this.classList.add("active");
    showSection(this);
    if(window.innerWidth <1200)
    {
      asideSectionTogglerBin()
    }
  });
}

function showSection(element) {
  for (let i = 0; i < totalSection; i++) {
    allSection[i].classList.remove("active");
  }

  const targetId = element.getAttribute("href").substr(1); // Extract section identifier after '#'
  document.getElementById(targetId).classList.add("active"); // Use getElementById to get the section by ID and add 'active' class
}

const navTogglerBin = document.querySelector(".nav-toggler");
const aside = document.querySelector(".aside");
navTogglerBin.addEventListener("click", () => {
  asideSectionTogglerBin();
});

function asideSectionTogglerBin() {
  aside.classList.toggle("open");
  navTogglerBin.classList.toggle("open");
  for (let i = 0; i < totalSection; i++)
  {
    allSection[i].classList.toggle("open");
  }
}
