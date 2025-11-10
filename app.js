// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
let allBooks = [];

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookRating = document.getElementById("bookRating");
const bookGenre = document.getElementById("bookGenre");
const saveBookBtn = document.getElementById("saveBookBtn");
const bookInfo = document.getElementById("bookInfo");

// adding firestore
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCThuUEk2dOCvr8oNlLNFwSRDR7fVMP3tA",
  authDomain: "books-2e181.firebaseapp.com",
  projectId: "books-2e181",
  storageBucket: "books-2e181.firebasestorage.app",
  messagingSenderId: "803382735961",
  appId: "1:803382735961:web:f9214b0016f51201856d48",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// getInfo from db
const getBooksDb = async () => {
  const myBooks = await getDocs(collection(db, "books"));
  myBooks.forEach((books) => {
    const book = books.data();
    const bookDiv = document.createElement("div");
    bookDiv.innerHTML = ` <h3>${book.title}</h3> <span>
                <h4>E-mail: ${book.genre}</h4>
               <h4>Age: ${book.author}</h4>
               <span class="action_btns">
              <b id="deleteUserInfo-${books.id}" class="btn delete_btn">Delete</b  utton>
          </span>
          </span>
    `;
    bookInfo.appendChild(bookDiv);
    console.log(bookDiv);
  });
};

// add info to firebase

async function addBooksFrDb(bookDataValue) {
  await addDoc(collection(db, "library"), bookDataValue);
}
// saving data in aaray
saveBookBtn.onclick = (event) => {
  event.preventDeafult();
  //   handling added new data on inputs
  const bookTitleValue = bookTitle.value.trim();
  const bookAuthorValue = bookAuthor.value.trim();
  const bookRatingValue = bookRating.value.trim();
  const bookGenreValue = bookGenre.value;
  // build object with added data
  const bookDataValue = {
    title: bookTitleValue,
    author: bookAuthorValue,
    rating: bookRatingValue,
    genre: bookGenreValue,
  };

  //   adding in array
  allBooks.push(bookDataValue);
  getBooksDb();
  addBooksFrDb(bookDataValue);
  //   empty inputs after forming array
  bookTitle.value = "";
  bookAuthor.value = "";
  bookRating.value = "";
  bookGenre.value = "";
};
getBooksDb();
