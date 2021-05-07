// url data
const urlParams = new URLSearchParams(window.location.search);
const urlData = {
  apiKey: urlParams.get('apiKey'),
  projectId: urlParams.get('projectId'),
  quantity: urlParams.get('quantity') || 9,
}

// global app data
const app = {container: {selector: document.querySelector('#container')}};

// slider data
const slider = {moveSpeed: 2500, clearDuration: '0.35s'}

// Configure Firebase
const firebaseConfig = {
    apiKey: urlData.apiKey,
    authDomain: `${urlData.projectId}.firebaseapp.com`,
    projectId: urlData.projectId,
    storageBucket: `${urlData.projectId}.appspot.com`,
    messagingSenderId: "426738143693",
    appId: "1:426738143693:web:f6c2b7c76f3cef15b5b484",
    databaseURL: `https://${urlData.projectId}-default-rtdb.europe-west1.firebasedatabase.app`
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// init db const
const dbRef =  firebase.database().ref();

// get data once without sub
dbRef.get().then((snapshot) => {
  if (snapshot.exists()) {
    run(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

// main run function
function run(mans) {
  initHtml(mans);
  makeUpHtml();
  runSlider();
} 

// init html and fill data
function initHtml(mans) {
  app.container.style = getElementStyle(app.container.selector);
  const parsedMans = calculateKillRate(Object.values(mans));
  const sortedMans = sortByField(parsedMans, 'matches');
  fillHtml(sortedMans);
}

// calculate kill rate by kills/(matches*4/100)
function calculateKillRate(mans) {
  return mans.map((man) => ({
    ...man,
    kr: Math.round(man.kills/(man.matches*4/100)) || 0
  }))
}

// sort mans by field
function sortByField(parsedMans, field) {
  return parsedMans.sort((a, b) => {
    if (a[field] > b[field]) return -1;
    if (a[field] < b[field]) return 1;
    return 0;
  });
}

// fill html with blocks
function fillHtml(sortedMans) {
  sortedMans.forEach(man => {
    addManBlock(man);
  });
}

// add a single man block
function addManBlock(man) {
  const block = document.createElement("div");
  block.className = 'item';

  block.innerHTML = `
    <img class="item__pic" src="pics/${man.pic}"/>
    <div class="desc">
      <div class="desc__name">${man.name}</div>
      <div class="desc__matches">${man.matches} каток</div>
      <div class="desc__kr">${man.kr}% убийств</div>
    </>
  `;

  app.container.selector.appendChild(block);
}

// show only selected card quantity
function makeUpHtml() {
  app.item = {selector: document.querySelector('.item')}
  // item to get offset size
  const item = document.querySelectorAll('.item')[1];
  const itemStyle = getElementStyle(item);
  app.item.parsedStyle = {
    width: trimToInt(itemStyle.width),
    margin: trimToInt(itemStyle.marginLeft),
    duration: itemStyle.transitionDuration
  }
  app.item.style = getElementStyle(app.item.selector);

  const newWidth = calculateSliderWidth(app.item.parsedStyle);
  app.container.selector.style.width = `${newWidth}px`
}

// calculate width for container
function calculateSliderWidth(itemStyleData) {
  const quantity = urlData.quantity;

  return (itemStyleData.width * quantity)
  + (itemStyleData.margin * (quantity - 2))
  + trimToInt(app.container.style.paddingLeft)
}

// start slider
function runSlider() {
  const itemLength = document.querySelectorAll('.item').length;
  let showedItems = urlData.quantity;

  if (itemLength > urlData.quantity) {
    setInterval(() => {
        if (showedItems < itemLength) {
          moveSlider();
          showedItems++;
        } else {
          clearSlider();
          showedItems = urlData.quantity;
        }
    }, slider.moveSpeed);
  }
}

// mobe slider with step
function moveSlider() {
  const stepSize = app.item.parsedStyle.width + app.item.parsedStyle.margin;
  const prevMargin = trimToInt(app.item.style.marginLeft);

  app.item.selector.style.marginLeft = `-${prevMargin + stepSize}px`
}

// return slider to default position
function clearSlider() {
  const defaultDuation = app.item.parsedStyle.duration;
  const clearDuration = slider.clearDuration;

  app.item.selector.style.duration = clearDuration;
  app.item.selector.style.marginLeft = "0px";

  setTimeout(() => {
    app.item.selector.style.duration = defaultDuation;
  }, (trimToInt(clearDuration) + '0'))
  
}

// get style data of element
function getElementStyle(el) {
  return el.currentStyle || window.getComputedStyle(el);
}

// trim string to int
function trimToInt(value) {
  return parseInt(value.replace(/\D/g,''))
}