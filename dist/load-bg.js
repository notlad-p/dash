// Load background scripts
function loadBackgroundScripts() {
  let threeJs = document.createElement("script");
  threeJs.setAttribute("src", "three.r95.min.js");
  document.body.appendChild(threeJs);

  threeJs.addEventListener("load", threeJsLoaded, false);

  function threeJsLoaded() {
    let vantaJs = document.createElement("script");
    // add from IndexedDB
    if(!localStorage.getItem('currentBG')) {
      localStorage.setItem('currentBG', 'net');
    }
    vantaJs.setAttribute("src", `/vendor/vanta.${localStorage.getItem('currentBG')}.min.js`);
    vantaJs.classList.add('background-script');
    document.body.appendChild(vantaJs);
    vantaJs.addEventListener("load", vantaJsLoaded, false);
    // Local storage colors
    let defaultColor = localStorage.getItem('color');
    let defaultBackground = localStorage.getItem('backgroundColor');

    // If local storage colors exist, use them for accents
    if(defaultColor || defaultBackground) {
      const search = document.getElementById('search');
      const localInfo = document.querySelector('.local-info');
      search.style.borderColor = localStorage.getItem('color');
      localInfo.style.borderBottom = '1px solid ' + localStorage.getItem('color');
    }
  }

  function vantaJsLoaded() {
    let backgroundJs = document.createElement("script");
    backgroundJs.setAttribute("src", "./dist/background2.js");
    backgroundJs.setAttribute('type', 'module');
    document.body.appendChild(backgroundJs);
  }
}

addEventListener('DOMContentLoaded', loadBackgroundScripts());

