const bcrypt = require("bcryptjs");

// Create random userID and shortURL
const generateRandomString = () => {
  return Math.random().toString(20).substr(2, 6);
};

const createUser = (userDB, user) => {
  const { email, password } = user;
  const userData = Object.values(userDB);
  if (email === '' || password === '') {
    return {error: "Email or password can't be empty", data: null};
  }
  for (const user of userData) {
    if (user.email === email) {
      return { error: `account already exists ${email}`, data: null };
    }
  }
  const uid = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  userDB[uid] = {id: uid, email: email, password: hashedPassword};
  return {error: null, data: userDB[uid]};
};

const createNewUrl = (urlDatabase, longUrl, userId) => {
  if (longUrl === '') {
    return {error: "URL cannot be empty", data: null};
  } else {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {longURL: longUrl, userID: userId};
    return { error: null, data: urlDatabase[shortURL], shortURL: shortURL };
  }
};

const updateUrl = (urlDatabase, shortUrl, longUrl, userId) => {
  if (longUrl === '') {
    return {error: "URL cannot be empty", data: null};
  }
  if (urlDatabase[shortUrl].userID === userId) {
    urlDatabase[shortUrl] = {longURL: longUrl, userID: userId};
  } else if (urlDatabase[shortUrl].userID !== userId) {
    console.log("UserID doesn't match");
  }
  return { error: null, data: urlDatabase[shortUrl]};
};


const authenticateUser = (userDB, email, password) => {
  const userData = Object.values(userDB);
  if (!email || !password) {
    return {error: "Email or Password cannot be empty string"};
  }
  for (const user of userData) {
    if (user.email === email) {
      if (bcrypt.hashSync(password, user.password)) {
        return { error: null, data: user };
      }
    }
  }
  return { error: "Email or Password not found", data: null };
};

// send the user information based on UserID
const fetchUserInformation = (userDB, userId) => {
  let userInfo = undefined;
  if (userDB[userId]) {
    userInfo = userDB[userId];
  } else {
    userInfo = {};
  }
  return userInfo;
};

// Check if the user is loge in or not
const isLoggedIn = (loginToken) => {
  if (Object.keys(loginToken).length === 0) {
    return false;
  } else {
    return true;
  }
};

// Filter URLs based on the userID, Each user will access their own URLs
const filterUrlDb = (urlDatabase, userId) => {
  let urlDB = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userId) {
      urlDB[url] = urlDatabase[url];
    }
  }
  return urlDB;
};

module.exports = { filterUrlDb, updateUrl, createNewUrl, fetchUserInformation, authenticateUser, createUser, isLoggedIn };