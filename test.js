






require("dotenv").config()
const Frameio = require("./src")
let f = new Frameio({
	token: process.env.FRAMEIO_TOKEN,
	teamId: process.env.ALIENBOYFILMS_TEAM_ID,
	projectId: process.env.OLIVERTREEUNIVERSE_PROJECT_ID,
	accountId: process.env.FRAMEIO_ACCOUNT_ID,
	debug: true
})




// f.getMe().then(console.log)
// f.getAccounts().then(console.log)
// f.getTeams().then(console.log)
// f.getProjects().then(console.log)
// f.getProject().then(console.log)
// f.getRoot().then(console.log)
// f.getAsset("107948bd-f78d-44c0-903d-c24971922c0a").then(console.log)
// f.getComment("04fd0ca7-966d-46d0-b036-042d7a71caef").then(console.log)
f.getCommentAsset("04fd0ca7-966d-46d0-b036-042d7a71caef").then(console.log)


// f.search("2_DONE")