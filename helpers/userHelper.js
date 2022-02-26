const res = require("express/lib/response");
const bcrypt = require("bcryptjs");


function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
}

const createUser = function(userDB, user) {
  const { email, password } = user;
  const userData = Object.values(userDB);
  if (email === '' || password === '') {
    return {error: "Email or password can't be empty", data: null}
  }
  for (const user of userData) {
    if (user.email === email) {
      return { error: `account already exists ${email}`, data: null };
    }
  }
  const uid = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
    userDB[uid] = {id: uid, email: email, password: hashedPassword};
    console.log(userDB[uid])
    return {error: null, data: userDB[uid]}
  

};

const createNewUrl = function(urlDatabase, longUrl, user_Id) {
    console.log(longUrl)
    if (longUrl === '') {
      return {error: "URL cannot be empty", data: null}
    } else {
        const shortURL = generateRandomString();
        urlDatabase[shortURL] = {longURL: longUrl, userID: user_Id}
        return { error: null, data: urlDatabase[shortURL] };
    }
};
const updateUrl = function(urlDatabase, shortUrl, longUrl, user_Id) {
   
    if (longUrl === '') {
      return {error: "URL cannot be empty", data: null}
    }

        if (urlDatabase[shortUrl].userID === user_Id) {
            urlDatabase[shortUrl] = {longURL: longUrl, userID: user_Id}
        } else if (urlDatabase[shortUrl].userID !== user_Id) {
            console.log("UserID doesn't match")
        }

    return { error: null, data: urlDatabase[shortUrl]};
    
};

const authenticateUser = (userDB, email, password) => {
    const userData = Object.values(userDB);
    if (email === '' || password === '') {
        return {error: "Email or Password cannot be empty string"}
    }
    for (const user of userData) {
      console.log("user: ", password)
      console.log(user.password)
        if (user.email === email) {
          if (bcrypt.hashSync(password, user.password)){
            return { error: null, data: user };
          }            
        }
    }
    console.log(userDB)
    return { error: "Email or Password not found", data: null }; 
};

  const fetchUrlInformation = (urlDB, url) => {

  };
  
  const fetchUserInformation = (userDB, userId) => {
    let userInfo = undefined;
        if (userDB[userId]) {
          userInfo = userDB[userId];
        } else {
          userInfo = {};
        }
       return userInfo; 
  };

  const isLoggedIn = (loginToken) => {
    if (Object.keys(loginToken).length === 0) {
        return false;
      } else {
        return true;
      }
  };

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