	// Bring in Express code
	const express = require('express')

	const app = express()
	const port = 3000
  const usersList = require("./userList");


	app.use(express.json()) // This line is necessary for Express to be able to parse JSON in request body's

	app.get('/', (req, res) => {
		res.send('Hello World!')
	})

	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})