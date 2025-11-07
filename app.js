// handling
let userData = [];

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userNumber = document.getElementById("userNumber");
const userColor = document.getElementById("userColor");
const userSave = document.getElementById("saveUserBtn");
const userInfo = document.getElementById("userInfo");
const totalUsers = document.getElementById("totalUsers");

// functionality

// rendering data
const renderuserInfo = () => {
  // userInfo.innerHTML = "";
  // const h4 = document.createElement("h4");
  // h4.innerHTML = "Total reg user " + userData.length;
  // userInfo.appendChild(h4);
  userData.forEach((userDataDetail, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${userDataDetail.name}</h3>
      <span>  
      <h4>E-mail: ${userDataDetail.email}</h4>
      <h4>Age: ${userDataDetail.number}</h4>
      <span class="action_btns">
        <button id="deleteUserInfo-${index}" class="btn delete_btn">Delete</button>
        <button id="editUserInfo-${index}" class="btn edit_btn">Edit</button>
      </span>
      </span>`;
    // colorized
    div.style.backgroundColor = `${userDataDetail.color}`;
    userInfo.appendChild(div);

    // deleting element by id(index)
    div.querySelector(`#deleteUserInfo-${index}`).onclick = () => {
      userData.splice(index, 1);
      addLocalStorageData();
      renderuserInfo();
    };
    // editing
    div.querySelector(`#editUserInfo-${index}`).onclick = () => {
      userName.value = userDataDetail.name;
      userEmail.value = userDataDetail.email;
      userNumber.value = userDataDetail.number;
      userColor.value = userDataDetail.color;
      userData.splice(index, 1);
      addLocalStorageData();
      renderuserInfo();
    };
  });
};

// adding data local storage
const addLocalStorageData = () => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

// get data from storage
const getLocalStorageData = () => {
  const localStorageData = localStorage.getItem("userData");
  if (localStorageData) {
    userData = JSON.parse(localStorageData);
  }
};
// adding new data
userSave.onclick = () => {
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
  addLocalStorageData();
  renderuserInfo();
  userName.value = "";
  userEmail.value = "";
  userNumber.value = "";
  userColor.value = "";
};

// sorting array by name formula
userData.sort((a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
});

getLocalStorageData();
renderuserInfo();

// document.getElementById("sorting").onchange = (e) => {
//   const choosenSort = e.target.value;
//   if (choosenSort === "name") {
//     userData.sort((a, b) => a.name.localeCompare(b.name));
//   } else if (choosenSort === "email") {
//     userData.sort((a, b) => a.email.localeCompare(b.email));
//   } else if (choosenSort === "age") {
//     userData.sort((a, b) => a.number - b.number);
//   }
//   addLocalStorageData();
// };
