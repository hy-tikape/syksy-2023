const hideSideNav = () => {
  document.getElementById("side-nav").className = "side-nav-hidden";
}

function showSideNav() {
  document.getElementById("side-nav").className = "side-nav";
}

function reportWindowSize() {
  if (window.innerWidth < 500) {
    hideSideNav();
  } else {
    showSideNav();
  }
}

window.onresize = reportWindowSize;

window.onload = () => {
  reportWindowSize();
  setActiveMenu()
 // generateTOC()
};

window.onscroll = () => {
  setActiveMenu()
}

function generateTOC() {
  tof = document.getElementById("tof")
  if (tof && document.body.id === "chapter") {
    tof.parentNode.insertBefore(document.getElementsByTagName("h1")[0], tof)
    tof.style.removeProperty("display")
  }

}

function handleActiveMenu(headers) {

  for (h in headers) {
    currentElement = document.getElementById(headers[h].innerText + "nav")
    previousElement = null
    if (currentElement) {
      previousElement = document.getElementById(headers[h].innerText + "nav").previousElementSibling
    }


    if (headers[h].tagName === "H1") {
      if (currentElement) {
        currentElement.classList.add("current")
        currentElement.scrollIntoView({ block: "center" })
      }
    } else if (headers[h].offsetTop <= window.scrollY + window.screenTop) {
      if (currentElement && previousElement) {
        currentElement.classList.add("current")
        if (previousElement.classList.contains("current")) {
          previousElement.classList.remove("current")
        }
      }
    } else if (headers[h].offsetTop > window.scrollY + window.screenTop) {
      if (currentElement) {
        currentElement.classList.remove("current")

      }
    }
  }
}

function setActiveMenu() {
  if (location.href.split("/").length <= 5) {
    document.getElementById("indexnav").classList.add("current")

  }

  titles = document.getElementsByTagName("h1")
  subtitles = document.getElementsByTagName("h2")
  handleActiveMenu(titles)
  handleActiveMenu(subtitles)
}

