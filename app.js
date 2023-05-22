// Bring in Express code
const express = require("express");

const app = express();
const port = 3000;
const usersList = require("./userList");
const e = require("express");

app.use(express.json()); // This line is necessary for Express to be able to parse JSON in request body's

// display Hello world //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// gets all users from usersList ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/all-users", (req, res) => {
  res.status(200).json({ data: usersList });
});

// gets single user based on phone number /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/single-user/:phoneNumber", (req, res) => {
  const phoneNum = req.params.phoneNumber.replace(/[^0-9^]/g, ""); // sanitized the phone using regular expression will remove all non-numeric char

  let userInfo = null; // place holder for user info to be render
  for (const user of usersList) {
    // this for of loop will go through phone/cell and sanitize and if condition evaluates true userInfo is set
    const nameFirst = user.name.first;
    const nameLast = user.name.last;

    const allPhonesInList = user.phone.replace(/[^0-9^]/g, ""); // sanitized all numbers
    const allCellInList = user.cell.replace(/[^0-9^]/g, ""); // sanitized all numbers
    //console.log(allPhonesInList, allCellInList)

    if (phoneNum === allPhonesInList || phoneNum === allCellInList) {
      // this if statement compares phone numbers and if the conditional evaluates to true userInfo is set
      userInfo = `${nameFirst} ${nameLast} Phone: ${user.phone}, Cell: ${user.cell} `;
    }
  }
  res.status(200).json({ data: userInfo });
});

// gets single user based on country ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/some-users/:countryName", (req, res) => {
  const country = req.params.countryName.toLowerCase(); // sanitized string to lower case

  let userInfo = null; // place holder for user info to be render

  for (const user of usersList) {
    // this loop will go through usersList and if condition evaluates true userInfo is set
    if (user.location.country.toLowerCase() === country) {
      //this condition compares user location sanitized toLowerCase and country params
      userInfo = `${user.name.first} ${user.name.last} country: ${country}`; // userInfo set
    }
  }
  res.status(200).json({ data: userInfo });
});

// new user ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/new-user", (req, res) => {

  const newUser = {
    gender: req.body.gender,
    name: {
      title: req.body.name.title,
      first: req.body.name.first,
      last: req.body.name.last,
    },
    location: {
      city: req.body.location.city,
      state: req.body.location.state,
      country: req.body.location.country,
      postcode: req.body.location.postcode,
    },
    email: req.body.email,
    phone: req.body.phone,
    cell: req.body.cell,
    nat: req.body.nat,
  };
  let errorArray = [];

  //checks to make sure we're not saving something that is empty or undefined
  for (let key in newUser) { // main keys 
    if (newUser[key] === "" || newUser[key] === undefined) {
      errorArray.push(`${key} cannot be empty`);
    }
  }

  for (let key in newUser.name) { // name keys 
    if (newUser.name[key] === "" || newUser.name[key] === undefined) {
      errorArray.push(`${key} name cannot be empty`);
    }
  }

  for (let key in newUser.location) { // location keys
    if (newUser.location[key] === "" || newUser.location[key] === undefined) {
      errorArray.push(`${key} location can not be empty`);
    }
  }

  if (errorArray.length > 0) {
    return res.status(500).json({ error: true, message: errorArray });
  } else {
    usersList.push(newUser);
  }
  res.status(200).json({ message: "Success" });
});

// updates user ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.put("/update-user/:email", (req, res) => {
	//find person using req.params
	const email = req.params.email;
	const findIndex = usersList.findIndex((person) => person.email === email);
	if (findIndex === -1) {
		return res.status(400).json({ success: false, message: "person not found" });
	}

	// grab all the current persons original  information
	const person = usersList[findIndex];
  
	//need to make a new object
	let updateUserInfo = { ...person };

	if (req.body !== "" || req.body !== undefined) {
		updateUserInfo = {...req.body};
	}

	//replace information
	usersList.splice(findIndex, 1, updateUserInfo);

	res.status(200).json({ message: "Success" });
});

// delete user ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.delete("/delete-user/:cell", (req, res) => {
	//.indexOf
	const cell = req.params.cell;
	//implicit returns
	const findIndexOfUser = usersList.findIndex((person) => person.cell === cell);
  if (findIndexOfUser === -1) {
		return res.status(400).json({ success: false, message: "person not found" });
	}
	//.splice(index, how many)
	usersList.splice(findIndexOfUser, 1);
	// console.log(movies);
	res.status(200).json({ data: "user deleted" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
