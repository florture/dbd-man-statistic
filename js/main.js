// url data
const urlParams = new URLSearchParams(window.location.search);
const urlData = {
  apiKey: urlParams.get('apiKey'),
  projectId: urlParams.get('projectId'),
  sliderSpeed: urlParams.get('sliderSpeed') || 3500,
  quantity: urlParams.get('quantity') || 9,
}

// global app data
const app = {container: {selector: document.querySelector('#container')}};

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
    addItemCard(man);
  });
}

// add an item card
function addItemCard(item) {
  const block = document.createElement("div");
  block.className = 'item';
  block.setAttribute('name', item.name);

  block.innerHTML = `
    <img class="item__pic" src="pics/${item.pic}"/>
    <div class="desc">
      <div class="desc__name">${item.name}</div>
      <div class="desc__matches">${item.matches} каток</div>
      <div class="desc__kr">${item.kr}% убийств</div>
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
  const quantity = urlData.quantity;
  let showedItems = quantity;

  if (itemLength > quantity) {
    setInterval(() => {
        if (showedItems < itemLength) {
          moveSlider();
          showedItems++;
        } else {
          clearSlider();
          showedItems = quantity;
        }
    }, urlData.sliderSpeed);
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
  app.item.selector.style.marginLeft = "0px";
}

// get style data of element
function getElementStyle(el) {
  return el.currentStyle || window.getComputedStyle(el);
}

// trim string to int
function trimToInt(value) {
  return parseInt(value.replace(/\D/g,''))
}