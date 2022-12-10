/** src
 * @module 
 */
require("dotenv").config({path: "../.env"})
const axios = require("axios")
const axios2 = require("axios")
const {Team, Project, Asset} = require("./schemas.js")



/** @class 
 * @arg {object} config
 * @arg {string} config.token - frame.io API token
 * @arg {string} config.teamId
 * @arg {string} config.projectId
 * @arg {string} config.accountId
 */
class Frameio {
	constructor(config = {}) {

		const token = config.token
		this.token = config.token
		this.teamId = config.teamId
		this.projectId = config.projectId
		this.accountId = config.accountId
		if (!token) throw new Error("missing token")
		axios.defaults.baseURL = "https://api.frame.io/v2"
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

		const self = this

		this.getAccounts = async function() {
		
			let res = await axios.get("/accounts").catch(error)
			let data = res.data
			return data
		}

		this.getMe = async function() {
			let res = await axios.get("/me").catch(error)
			let data = res.data
			return data
		}

		this.getTeams = async function() {
			let res = await axios.get("/teams").catch(error)
			let data = res.data
			// console.log(data[0])
			data = data.map(x => new Team(x))
			return data
		}

		this.getProjects = async function(teamId, config = {}) {
			teamId = teamId || this.teamId
			let req = {
				url: `/teams/${teamId}/projects`,
				method: "GET",
				params: {}
			}

			if (config.showArchived) req.params["filter[archived]"] = "all"

			let res = await axios(req).catch(error)
			let data = res.data
			console.log(data)
			data = data.map(x => new Project(x))
			console.log(data)
		}

		this.getProject = async function(projectId) {
			projectId = projectId || this.projectId
			if (!projectId) throw new Error("MISSING_PROJECT_ID")
			let url = `/projects/${projectId}`
			let res = await axios.get(url).catch(error)
			let data = res.data
			// console.log(data)
			data = new Project(data)
			return data

		}

		this.getRoot = async function(config = {}) {
			let project = await this.getProject()
			let rootAssetId = project.rootAssetId

			let req = {
				url: `/assets/${rootAssetId}/children`,
				method: "GET",
				// params: {
				// 	type: ["folder", "file"]
				// }
			}

			let res = await axios(req).catch(error)
			let data = res.data
			data = data.map(x => new Asset(x))
			console.log(data)
		}

		this.search = async function(query, filter = {}) {
			let req = {
				url: "/search/assets",
				method: "GET",
				params: {
					account_id: this.accountId,
					project_id: this.projectId,
					team_id: this.teamId,
					query,
					// q: query
					...filter
				}
			}
			let res = await axios(req).catch(error)
			let data = res.data
			data = data.map(x => new Asset(x))
			console.log(data)
		}


		this.getAsset = async function(assetId) {
			if (!assetId) throw new Error("MISSING_ASSET_ID")
			let url = `assets/${assetId}`
			let res = await axios.get(url).catch(error)
			let raw = res.data
			let data = new Asset(raw)
			// console.log(data.raw)
			return data
		}






		function error(err) {
			let data = err?.response?.data
			let message
			if (!data) message = err
			else {
				let errors = data.errors
				let messages = errors.map(x => `${x.status}: ${x.detail}`)
				message = messages.join("")
			}

			throw new Error(message)
		}

	}
}



module.exports = Frameio