import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
let allBooks = [];

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookRating = document.getElementById("bookRating");
const bookGenre = document.getElementById("bookGenreSelect");
const bookComments = document.getElementById("bookComments");
const bookFinishedDate = document.getElementById("bookFinishedDate");
const saveBookBtn = document.getElementById("saveBookBtn");
const bookInfo = document.getElementById("bookInfo");
const countBooks = document.getElementById("countBooks");

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
  // rendering data from db
  const myBooks = await getDocs(collection(db, "books"));
  console.log(myBooks);

  myBooks.forEach((books) => {
    const book = books.data();
    console.log(book);
    const bookDiv = document.createElement("div");
    bookDiv.innerHTML = ` 
          <span class="addBook_title"> 
            <h3>${book.title}</h3> 
            <p>Rating: ${book.rating}</p>
          </span>
          <span class="addBook_desc">
               <h4>Author: ${book.author}</h4>
              <h4>Genre: ${book.genre}</h4>
              <span class="addBook_userDesc">
                ${
                  book.comment
                    ? ` <p>comment: ${book.comment}</p>`
                    : `<p> no comments</p>`
                }
                ${
                  book.finishedDate
                    ? `<p>finished date: ${book.finishedDate}</p>`
                    : `<p>not finished</p>`
                }
              </span>
              <button class="btn delete_btn">Delete</button>
          </span>`;
    bookInfo.appendChild(bookDiv);

    // counter
    countBooks.innerHTML = `Total books ` + myBooks.size;
  });
};

// add info to firebase

async function addBooksFrDb(bookDataValue) {
  await addDoc(collection(db, "books"), bookDataValue);
}

// saving data in aaray
saveBookBtn.onclick = (e) => {
  e.preventDefault();
  //   handling added new data on inputs
  const bookTitleValue = bookTitle.value.trim();
  const bookAuthorValue = bookAuthor.value.trim();
  const bookRatingValue = bookRating.value.trim();
  const bookGenreValue = bookGenre.value.trim();
  const bookCommentsValue = bookComments.value.trim();
  const bookFinishedDateValue = bookFinishedDate.value;
  // build object with added data
  const bookDataValue = {
    bookCreated: new Date().toISOString(),
    title: bookTitleValue,
    author: bookAuthorValue,
    rating: bookRatingValue,
    genre: bookGenreValue,
    comment: bookCommentsValue,
    finishedDate: bookFinishedDateValue,
  };

  if (
    !bookTitleValue ||
    !bookAuthorValue ||
    !bookGenreValue ||
    !bookFinishedDateValue ||
    !bookCommentsValue ||
    bookRatingValue < 0
  ) {
    alert("Check all fields");
    return;
  }
  //   adding in array
  allBooks.push(bookDataValue);
  addBooksFrDb(bookDataValue);
  getBooksDb();
  //   empty inputs after forming array
  bookTitle.value = "";
  bookAuthor.value = "";
  bookRating.value = "";
  bookGenre.value = "";
  bookFinishedDate.value = "";
  bookComments.value = "";
};
