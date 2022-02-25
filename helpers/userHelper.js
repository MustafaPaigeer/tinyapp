

function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
}

const createUser = function(userDB, user) {
  const { email, password } = user;
  const userData = Object.values(userDB);
  if (email === '' || password === '') {
    return {error: "Email or password can't be empty", data: null}
  }
  // if (!email || !password) {
  //   return { error: "email or password is not valid", data: null };
  // }
  for (const key in userData) {
    if (userData[key].email === email) {
      return { error: `account already exists ${email}`, data: null };
    }
  }
  const uid = generateRandomString();
  userDB[uid] = {id: uid, email: email, password: password}
  return {error: null, data: userDB[uid]}
};

const createNewUrl = function(urlDatabase, longUrl, user_Id) {
    console.log(longUrl)
    if (longUrl === '') {
      return {error: "URL cannot be empty", data: null}
    } else {
        const shortURL = generateRandomString();
        urlDatabase[shortURL] = {longURL: longUrl, userID: user_Id}
        //console.log(urlDatabase)
        return { error: null, data: urlDatabase[shortURL] };
    }
};

const authenticateUser = (userDB, email, password) => {
    const userData = Object.values(userDB);
    if (email === '' || password === '') {
        return {error: "Email or Password cannot be empty string"}
    }
    for (const user of userData) {
        if (user.email === email && user.password === password) {
            return { error: null, data: user };
        }    
    }
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

  module.exports = { createNewUrl, fetchUserInformation, authenticateUser, createUser, isLoggedIn };