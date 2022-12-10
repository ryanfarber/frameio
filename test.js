







const Frameio = require("./src")
let f = new Frameio({
	token: process.env.FRAMEIO_TOKEN,
	teamId: process.env.ALIENBOYFILMS_TEAM_ID,
	projectId: process.env.OLIVERTREEUNIVERSE_PROJECT_ID,
	accountId: process.env.FRAMEIO_ACCOUNT_ID
})




// f.getMe().then(console.log)
// f.getAccounts().then(console.log)
// f.getTeams().then(console.log)
// f.getProjects().then(console.log)
// f.getProject().then(console.log)
// f.getRoot().then(console.log)
f.getAsset("59ce370e-2bc3-4edb-a7bb-c42e83dd4c46").then(console.log)


// f.search("2_DONE")