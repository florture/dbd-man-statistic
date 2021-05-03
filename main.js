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

const dbRef =  firebase.database().ref();

dbRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });