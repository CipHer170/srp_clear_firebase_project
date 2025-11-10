import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
let userData = [];
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userNumber = document.getElementById("userNumber");
const userColor = document.getElementById("userColor");
const userSave = document.getElementById("saveUserBtn");
const userInfo = document.getElementById("userInfo");
const totalUsers = document.getElementById("totalUsers");

// functionality
//working with firebase

const firebaseConfig = {
  apiKey: "AIzaSyDKMtAWtKrdFFF8mVt1PZt1rPQHiM3_mRA",
  authDomain: "srp-version-one.firebaseapp.com",
  projectId: "srp-version-one",
  storageBucket: "srp-version-one.firebasestorage.app",
  messagingSenderId: "1000077611765",
  appId: "1:1000077611765:web:5a7a12ae7b0515f21cebbc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//get data from firebase
async function getBooks() {
  let myBooks = await getDocs(collection(db, "library"));
  // total count data
  userInfo.innerHTML = "";
  const h4 = document.createElement("h4");
  h4.innerHTML = "Total books " + myBooks.size;
  userInfo.appendChild(h4);
  //rendering each data
  myBooks.forEach((books) => {
    console.log(books);
    const book = books.data(); // data() => by default in firestore
    const div = document.createElement("div");
    div.innerHTML = `
               <h3>${book.title}</h3> <span>
                <h4>E-mail: ${book.genre}</h4>
               <h4>Age: ${book.author}</h4>
               <span class="action_btns">
              <b id="deleteUserInfo-${books.id}" class="btn delete_btn">Delete</b  utton>
          </span>
          </span>`;
    userInfo.appendChild(div);
  });
}
// add data to firebase
async function addBooks(userDataValue) {
  await addDoc(collection(db, "library"), userDataValue);
}
// save data like object in array
userSave.onclick = (event) => {
  event.preventDefault(); // stop refreshing after adding new data
  const userNameValue = userName.value.trim();
  const userEmailValue = userEmail.value;
  const userNumberValue = userNumber.value;
  const userColorValue = userColor.value;

  const userDataValue = {
    name: userNameValue,
    email: userEmailValue,
    number: userNumberValue,
    color: userColorValue,
  };

  if (
    !userNameValue ||
    !userEmailValue ||
    !userNumberValue ||
    userNumberValue < 0
  ) {
    alert("Check all fields");
    return;
  }

  userData.push(userDataValue);
  addBooks(userDataValue);
  getBooks();
  userName.value = "";
  userEmail.value = "";
  userNumber.value = "";
  userColor.value = "";
};
getBooks();
