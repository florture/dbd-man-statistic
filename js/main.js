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
  const parsedMans = calculateKillRate(Object.values(mans));
  const sortedMans = sortByKillRate(parsedMans);
  fillHtml(sortedMans);
} 

// calculate kill rate by kills/(matches*4/100)
function calculateKillRate(mans) {
  return mans.map((man) => ({
    ...man,
    kr: Math.round(man.kills/(man.matches*4/100)) || 0
  }))
}

// sort mans by kill rate
function sortByKillRate(parsedMans) {
  return parsedMans.sort((a, b) => {
    if (a.kr > b.kr) return -1;
    if (a.kr < b.kr) return 1;
    return 0;
  });
}

// fill html with blocks
function fillHtml(sortedMans) {
  const container = document.querySelector('#container');
  sortedMans.forEach(man => {
    addManBlock(man, container);
  });
}

// add a single man block
function addManBlock(man, container) {
  const block = document.createElement("div");
  block.className = 'item';

  block.innerHTML = `
    <img class="item__pic" src="pics/${man.pic}"/>
    <div class="item__name">${man.name}</div>
    <div class="item__matches">${man.matches}</div>
    <div class="item__kr">${man.kr}</div>
  `;

  container.appendChild(block);
}