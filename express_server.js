const express = require("express");
const cookieSession = require('cookie-session');
const  { updateUrl, createNewUrl, createUser, authenticateUser, fetchUserInformation, isLoggedIn, filterUrlDb } = require("./helpers/userHelper");
const { userDB, urlDatabase} = require("./data/userData");
const app = express();

const PORT = 8080;
const bodyParser = require("body-parser");

app.use(cookieSession({
  name: 'mustafa',
  keys: ['highly', 'confidential']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/urls", (req, res) => {
  const user = fetchUserInformation(userDB, req.session.userId);
  const urlDB = filterUrlDb(urlDatabase, user.id);
  if (isLoggedIn(user)) {
    const templateVars = { urls: urlDB, userId : user.id, email: user.email };
    res.render("urls_index", templateVars);
  } else {
    res.send("please login first!");
  }
});

app.get("/urls/new", (req, res) => {
  const user = fetchUserInformation(userDB, req.session.userId);
  const templateVars = { userId : user.id, email: user.email };
  if (isLoggedIn(user)) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user = fetchUserInformation(userDB, req.session.userId);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userId: user.id, email: user.email};

  if (isLoggedIn(user)) {
    // Checks if the short URL exists in the URL database
    if (!urlDatabase[req.params.shortURL]) {
      res.send(` Short URL " ${req.params.shortURL} " not found`);
    }
    // Checks if userID matches the userID of short URL in the URL database
    if (user.id === urlDatabase[req.params.shortURL].userID) {
      res.render("urls_show", templateVars);
    } else {
      res.send(`Url " ${templateVars.shortURL} " cannot be accessed by user ${templateVars.email} due to user restrictions! `);
    }
  } else {
    res.send("Please login first to proceed!");
  }
});

app.get("/register", (req, res) => {
  const user = fetchUserInformation(userDB, req.session.userId);
  const templateVars = { userId : user.id, email: user.email };
  if (isLoggedIn(user)) {
    res.redirect("/urls");
  } else {
    res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  const user = fetchUserInformation(userDB, req.session.userId);
  const templateVars = { userId : user.id, email: user.email };
  if (isLoggedIn(user)) {
    res.redirect("/urls");
  } else {
    res.render("login", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  const user = fetchUserInformation(userDB, req.session.userId);
  if (isLoggedIn(user)) {
    res.json(urlDatabase);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  const usersURL = urlDatabase[shortURL] && urlDatabase[shortURL].userID === userId;
  if (isLoggedIn(req.session)) {
    // Checks if user has appropriate right to update the URL
    if (!usersURL) {
      res.send(`Url " ${shortURL} " cannot be deleted due to user right restrictions! `);
    } else {
      const url = req.params.shortURL;
      delete urlDatabase[url];
      res.redirect("/urls");
    }
  } else {
    res.send("Please first login to proceed!");
  }
});

app.post("/urls/:shortURL/update", (req, res) => {
  if (isLoggedIn(req.session)) {
    // Checks if user has appropriate right to update the URL
    if (req.session.userId === urlDatabase[req.params.shortURL].userID) {
      const { error } = updateUrl(urlDatabase, req.params.shortURL,req.body.longURL, req.session.userId);
      if (error) {
        res.send(error);
      }
      res.redirect("/urls");
    } else {
      res.send(`Url " ${req.params.shortURL} " cannot be updated due to user rights restrictions! `);
    }
  } else {
    res.send("Please first login to proceeed!");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const { error, data } = authenticateUser(userDB, email, password);
  if (error) {
    return res.status(403).send(error);
  }
  req.session.userId = data.id;
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls", (req, res) => {
  if (isLoggedIn(req.session)) {
    const { error, shortURL } = createNewUrl(urlDatabase, req.body.longURL, req.session.userId);
    if (error) {
      res.send(error);
    }
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect("login");
  }
});

app.post("/register", (req, res) => {
  if (isLoggedIn(req.session)) {
    res.redirect("/urls");
  } else {
    const { error, data } = createUser(userDB, req.body);
    if (error) {
      return res.status(400).send(error);
    }
    req.session.userId = data.id;
    res.redirect("/urls");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});