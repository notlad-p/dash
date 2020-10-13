// open background edit
let backgroundBtn = document.querySelector('.background-icn');
let backgroundModal = document.querySelector('.background-edit');
const backgroundExit = document.querySelector('.bg-delete');

backgroundBtn.addEventListener('click', function(){
  // backgroundModal.style.display = 'block';
  backgroundModal.classList.toggle('active');
});

backgroundExit.addEventListener('click', function(){
  // backgroundModal.style.display = 'none';
  backgroundModal.classList.remove('active');
});



document.addEventListener('click', function(e){
  // exit background modal when clicked outside
  const vantaCanvas = document.querySelector('.vanta-canvas');
  const container = document.querySelector('.container');
  if(e.target === vantaCanvas || e.target === container) {
    // backgroundModal.style.display = 'none';
    backgroundModal.classList.remove('active');
  }
});

// select input contianer
const inputContainer = document.querySelector('.colors');

class Background {
  constructor(name) {
    this.name = name;
    this.el = 'body';
  }

  // loop through passed array and set each value as a key
  setUpKeys(bgName, obj){
     for (let key in obj) {
      if(localStorage.getItem(`${bgName}-${key}`)) {
        this[key] = localStorage.getItem(`${bgName}-${key}`);
      } else {
        this[key] = obj[key];
      }
     }

    let savedModal = localStorage.getItem(`${bgName}-modalColor`);
    this.modalColor = savedModal ? savedModal : '#ffffff';

    // select accents
    const search = document.getElementById('search');
    const localInfo = document.querySelector('.local-info');
    
    // set accents to specified color
    search.style.borderColor = this.modalColor;
    localInfo.style.borderBottom= '1px solid ' + this.modalColor;
  }

  // set up background object based on name
  setUpObj () {
    if(this.name == 'birds') {
      // set currentBG
      localStorage.setItem('currentBG', 'birds');

      this.setUpKeys('birds', {
        backgroundColor: '#000000',
        color1: '#ff0000',
        color2: '#ffffff'
      });

      this.colorMode = 'lerpGradient';

      this.effect = VANTA.BIRDS(this);

      return this.effect;

    } else if(this.name == 'cells') {
      localStorage.setItem('currentBG', 'cells');

      this.setUpKeys('cells', {
        color1: '#009194',
        color2: '#f2e735'
      });

      this.effect = VANTA.CELLS(this);
     
      return this.effect;
    } else if (this.name == 'clouds') {
      localStorage.setItem('currentBG', 'clouds');

      this.setUpKeys('clouds', {
        backgroundColor: '#ffffff',
        skyColor: '#68b8d7',
        cloudColor: '#adc1de',
        cloudShadowColor: '#183550',
        sunColor: '#ff9919',
        sunGlareColor: '#ff6633',
        sunlightColor: '#ff9933'
      });

      this.effect = VANTA.CLOUDS(this);
     
      return this.effect;
    } else if(this.name == 'clouds2') {
      localStorage.setItem('currentBG', 'clouds2');

      this.setUpKeys('clouds2', {
        backgroundColor: '#000000',
        skyColor: '#5ca6ca',
        cloudColor: '#334d80',
        lightColor: '#ffffff'
      });

      this.texturePath = '/img/backgrounds/noise.png';

      this.effect = VANTA.CLOUDS2(this);
     
      return this.effect;
    } else if(this.name == 'dots') {
      localStorage.setItem('currentBG', 'dots');

      this.setUpKeys('dots', {
        backgroundColor: '#222222',
        color: '#ff8820',
        color2: '#ff8820'
      });

      this.effect = VANTA.DOTS(this);
     
      return this.effect;
    } else if(this.name == 'fog') {
      localStorage.setItem('currentBG', 'fog');

      this.setUpKeys('fog', {
        highlightColor: '#ffc300',
        midtoneColor: '#ff1f00',
        lowlightColor: '#2d00ff',
        baseColor: '#ffebeb'
      });

      this.effect = VANTA.FOG(this);
     
      return this.effect;
    }  else if(this.name == 'globe') {
      localStorage.setItem('currentBG', 'globe');

      this.setUpKeys('globe', {
        backgroundColor: '#23153c',
        color: '#ff3f81',
        color2: '#ffffff'
      });

      this.effect = VANTA.GLOBE(this);
     
      return this.effect;
    } else if(this.name == 'halo') {
      localStorage.setItem('currentBG', 'halo');

      this.setUpKeys('halo', {
        backgroundColor: '#131a43',
        baseColor: '#113daa'
      });

      this.effect = VANTA.HALO(this);
     
      return this.effect;
    } else if(this.name == 'net') {
      localStorage.setItem('currentBG', 'net');

      this.setUpKeys('net', {
        backgroundColor: '#23153c',
        color: '#ff3f81'
      });

      this.effect = VANTA.NET(this);
     
      return this.effect;
    } else if(this.name == 'rings') {
      localStorage.setItem('currentBG', 'rings');

      this.setUpKeys('rings', {
        backgroundColor: '#202428',
        color: '#88ff00'
      });

      this.effect = VANTA.RINGS(this);
     
      return this.effect;
    } else if(this.name == 'waves') {
      localStorage.setItem('currentBG', 'waves');

      this.setUpKeys('waves', {
        color: '#1b7ab3'
      });

      this.effect = VANTA.WAVES(this);
     
      return this.effect;
    }
  }

  // generate inputs based on each object property
  // inputs update live & store when done
  generateInputs() {
    // remove current inputs
    this.removeInputs();
    // if key container 'color' or 'Color' generate a color input
    for (let key in this) { 
      if(key.includes('color') || key.includes('Color')) {
        if(key.includes('colorMode')){
          return;
        }
        let wrapDiv = document.createElement('div');

        let input = document.createElement('input');
        input.setAttribute('type', 'color');
        input.setAttribute('class', 'color-input');
        input.setAttribute('name', key);
        input.setAttribute('id', key);
        input.value = this[key];
        wrapDiv.appendChild(input);

        let label = document.createElement('label');
        label.setAttribute('for', key);
        label.textContent = _.startCase(key);
        wrapDiv.appendChild(label);

        inputContainer.appendChild(wrapDiv);

        // update on change
        input.addEventListener('input', () => {
          this.updateFirst();
        }, false); 
        input.addEventListener('change', () => {
          this.updateDone();
        }, false);
      }
    }
  }

  removeInputs() {
    while(inputContainer.firstChild) {
      inputContainer.removeChild(inputContainer.firstChild);
    }
  }

  updateFirst() {
    let targetValue = event.target.value;
    let targetId = event.target.getAttribute('id');
    let value = this[targetId];

    this.effect.setOptions({
      [targetId]: targetValue
    });
    
    if(targetId.includes('modal')) {
      // select accents
      const search = document.getElementById('search');
      const localInfo = document.querySelector('.local-info');

      search.style.borderColor = targetValue;
      localInfo.style.borderBottom= '1px solid ' + targetValue;
    }
  }

  updateDone() {
    let targetId = event.target.getAttribute('id');
    localStorage.setItem(`${this.name}-${targetId}`, event.target.value);
    if(this.name == 'cells' || this.name == 'fog' || this.name == 'clouds' || this.name == 'clouds2' || this.name == 'halo') {
      return;
    }
    this.effect.restart();
  }  
}

// get current background from localStorage
let currentBG = localStorage.getItem('currentBG');

window.addEventListener('load', () => {
  let background;
  // if no current background, use NET
  if(!currentBG) {
    localStorage.setItem('currentBG', 'net');
  } else {
    background = new Background(currentBG);
    background.setUpObj();
    background.generateInputs();
  }

  // on image click, update current background
  const backgroundImages = document.querySelectorAll('.back-img');

  let backgroundScripts = document.getElementsByTagName('script');

  backgroundImages.forEach((img) => {
    img.addEventListener('click', changeScript);
  });

  function changeScript(event) {
    // get image alt
    let newScript = event.target.alt;

    // destroy current background if new background selected
    if(newScript !== background.name){
      console.log('destroyed');
      background.effect.destroy();
    }
    
    // generate new script
    const currentScript = backgroundScripts[4];
    const loadScript = document.createElement('script');
    loadScript.setAttribute('src', `/vendor/vanta.${newScript}.min.js`);
    currentScript.parentNode.replaceChild(loadScript, currentScript);
    // on script load create new background
    loadScript.onload = function() {
      background = new Background(newScript);
      if(background.name == localStorage.getItem('currentBG')) {
        return;
      }
      background.setUpObj();
      background.generateInputs();
    };
  }  
});