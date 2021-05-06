// url data
const urlParams = new URLSearchParams(window.location.search);
const urlData = {
  quantity: urlParams.get('quantity')
}

// global data
const appContainer = document.querySelector('#container');
const appContainerStyle = getElementStyle(appContainer);

// Configure Firebase
const firebaseConfig = {
    apiKey: "AIzaSyANmhnzVKy1x7MZ-bO_mRvBuCOlH0XIQ_g",
    authDomain: "dbd-stuff.firebaseapp.com",
    projectId: "dbd-stuff",
    storageBucket: "dbd-stuff.appspot.com",
    messagingSenderId: "426738143693",
    appId: "1:426738143693:web:f6c2b7c76f3cef15b5b484",
    databaseURL: ' https://dbd-stuff-default-rtdb.europe-west1.firebasedatabase.app'
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
} 

// init html and fill data
function initHtml(mans) {
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

  appContainer.appendChild(block);
}

// show only selected card quantity
function makeUpHtml() {
  const item = document.querySelectorAll('.item')[1];
  const itemStyle = getElementStyle(item);
  const itemStyleData = {
    width: trimToInt(itemStyle.width),
    leftMargin: trimToInt(itemStyle.marginLeft)
  }

  const newWidth = calculateSliderWidth(itemStyleData);
  appContainer.style.width = `${newWidth}px`
}

// calculate width for container
function calculateSliderWidth(itemStyleData) {
  const quantity = urlData.quantity;

  return (itemStyleData.width * quantity)
  + (itemStyleData.leftMargin * (quantity - 2))
  + trimToInt(appContainerStyle.paddingLeft)
}

function runSlider() {
  // TODO
}

// get style data of element
function getElementStyle(el) {
  return el.currentStyle || window.getComputedStyle(el);
}

// trim string to int
function trimToInt(value) {
  return parseInt(value.replace(/\D/g,''))
}