/** src
 * @module 
 */
require("dotenv").config({path: "../.env"})
const axios = require("axios")
const axios2 = require("axios")
const {Team, Project, Asset, Comment} = require("./schemas.js")
const Logger = require("@ryanforever/logger").v2




/** @class 
 * @arg {object} config
 * @arg {string} config.token - frame.io API token
 * @arg {string} config.teamId
 * @arg {string} config.projectId
 * @arg {string} config.accountId
 */
class Frameio {
	constructor(config = {}) {

		let debug
		if (!config.debug) debug = false
		const logger = new Logger("frame.io", {debug})
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
			logger.debug("getting me...")
			let res = await axios.get("/me").catch(error)
			let data = res.data
			return data
		}

		this.getTeams = async function() {
			logger.debug("getting teams...")
			let res = await axios.get("/teams").catch(error)
			let data = res.data
			// console.log(data[0])
			data = data.map(x => new Team(x))
			return data
		}

		this.getProjects = async function(teamId, config = {}) {
			logger.debug("getting projects...")
			teamId = teamId || this.teamId
			let req = {
				url: `/teams/${teamId}/projects`,
				method: "GET",
				params: {}
			}

			if (config.showArchived) req.params["filter[archived]"] = "all"

			let res = await axios(req).catch(error)
			let data = res.data

			data = data.map(x => new Project(x))
			return data
		}

		this.getProject = async function(projectId) {
			logger.debug(`getting project ${projectId}...`)
			projectId = projectId || this.projectId
			if (!projectId) throw new Error("MISSING_PROJECT_ID")
			let url = `/projects/${projectId}`
			let res = await axios.get(url).catch(error)
			let data = res.data
			// console.log(data)
			data = new Project(data)
			return data

		}

		this.getAsset = async function(assetId) {
			logger.debug(`getting asset ${assetId}...`)
			if (!assetId) throw new Error("MISSING_ASSET_ID")
			let url = `assets/${assetId}`
			let res = await axios.get(url).catch(error)
			let raw = res.data
			let data = new Asset(raw)
			return data
		}

		this.search = async function(query, filter = {}) {
			logger.debug(`searching...`)
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
			return data
		}

		this.getRoot = async function(config = {}) {
			logger.debug("getting root...")
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
			return data
		}


		this.getComment = async function(commentId) {
			logger.debug("getting comment...")
			if (!commentId) throw new ERROR("MISSING_COMMENT_ID")

			let res = await axios.get(`/comments/${commentId}`)
			let raw = res.data

			let data = new Comment(raw)
			return data
		}

		this.getCommentAsset = async function(commentId) {
			logger.debug("getting comment and asset...")
			if (!commentId) throw new ERROR("MISSING_COMMENT_ID")

			let comment = await this.getComment(commentId)
			let asset = await this.getAsset(comment.assetId)
			console.log(asset.raw)
			let output = {comment, asset}
			return output
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