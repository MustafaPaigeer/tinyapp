const express = require("express");
const cookieParser = require('cookie-parser');
const  { updateUrl, createNewUrl, createUser, authenticateUser, fetchUserInformation, isLoggedIn, filterUrlDb } = require("./helpers/userHelper");
const { userDB, urlDatabase} = require("./data/userData")
const app = express();
app.use(cookieParser());

const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/urls/new", (req, res) => {
    const user = fetchUserInformation(userDB, req.cookies.user_Id)
    const templateVars = { user_Id : user.id, email: user.email };
    if (isLoggedIn(user)) {
        res.render("urls_new", templateVars);
    } else {
        res.redirect("/login")
    }
  
});

app.get("/urls", (req, res) => {
  const user = fetchUserInformation(userDB, req.cookies.user_Id)
  const urlDB = filterUrlDb(urlDatabase, user.id);
  if (isLoggedIn(user)) {

  const templateVars = { urls: urlDB, user_Id : user.id, email: user.email };
  // Filter the URL database based on user ID
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login")
  }
  
});

app.get("/urls/:shortURL", (req, res) => {
  const user = fetchUserInformation(userDB, req.cookies.user_Id)
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_Id: user.id, email: user.email};
  if (isLoggedIn(user)) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login")    
  }
});

app.get("/register", (req, res) => {
  const user = fetchUserInformation(userDB, req.cookies.user_Id)
  const templateVars = { user_Id : user.id, email: user.email };
  if (isLoggedIn(user)) {
    res.redirect("/urls");
  } else {
    res.render("register", templateVars);
  }
  
});

app.get("/login", (req, res) => {
    const user = fetchUserInformation(userDB, req.cookies.user_Id)
    const templateVars = { user_Id : user.id, email: user.email };
    if (isLoggedIn(user)) {
    res.redirect("/urls")
    } else {
    res.render("login", templateVars);
    }
});

app.get("/u/:shortURL", (req, res) => {
    const user = fetchUserInformation(userDB, req.cookies.user_Id)
    const templateVars = { user_Id : user.id, email: user.email };
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL)
  //if (isLoggedIn(user)) {
    res.redirect(longURL);
  //} else {
    //res.redirect("/login")
  //}
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  if (isLoggedIn(user)) {
      res.json(urlDatabase);
  } else {
      res.redirect("/login")
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (isLoggedIn(req.cookies)) {
    const url = req.params.shortURL;
    delete urlDatabase[url];
    res.redirect("/urls");
  } else {
    res.redirect("login")
  }

});

app.post("/urls/:shortURL/update", (req, res) => {
  if (isLoggedIn(req.cookies)) {
    const { error, data } = updateUrl(urlDatabase, req.params.shortURL,req.body.longURL, req.cookies.user_Id); 
    res.redirect("/urls");
   } else {
     res.redirect("login")
   }
});


app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const { error, data } = authenticateUser(userDB, email, password);
    if (error) {
      return res.status(403).send(error);
    }
    res.cookie("user_Id", data.id);
    return res.redirect("/urls");
  });

app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.clearCookie('user_Id', "/urls");
  res.redirect("/login");
});

app.post("/urls", (req, res) => {
    
    if (isLoggedIn(req.cookies)) {
     const { error, data } = createNewUrl(urlDatabase, req.body.longURL, req.cookies.user_Id); 
    res.redirect("/urls");
    } else {
        res.redirect("login")
    }
});

app.post("/register", (req, res) => {
  if (isLoggedIn(req.cookies)) {
    res.redirect("/urls")
  } else {
    const { error, data } = createUser(userDB, req.body);
    if (error) {
      return res.status(400).send(error);
    }
    res.cookie("user_Id", data.id);
    res.redirect("/urls");
  }
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});