// schemas.js


const humanize = require("humanize-duration")

class Schema {
	constructor(raw) {
		this.raw = undefined
		Object.defineProperty(this, "raw", {get(){return raw}})
	}

	calculateStorage(bytes) {
		return {
			MB: parseFloat((bytes / 1000000).toFixed(2)),
			GB: parseFloat((bytes / 1000000000).toFixed(2))
		}
	}

	calculateDuration(seconds) {
		return humanize(seconds * 1000, {maxDecimalPoints: 2})
	}
}



class Team extends Schema {
	constructor(raw = {}) {
		super(raw)
		this.name = raw.name
		this.bio = raw.bio
		this.id = raw.id
		this.accountId =  raw.account_id
		this.creatorId = raw.creator_id
		this.numProjects = raw.project_count
		this.numFiles = raw.file_count
		this.numMembers = raw.member_count
		this.numCollaborators = raw.collaborator_count
		this.storageGB = this.calculateStorage(raw.storage).GB
		this.storageMB = this.calculateStorage(raw.storage).MB
		this.storageBytes = raw.storage
		this.avatarUrl = raw.image_256
		this.uploadUrl = raw.upload_url
	}
}


class Project extends Schema {
	constructor(raw = {}) {
		super(raw)
		this.name = raw.name
		this.archived = (raw.archive_status == "archived") ? true : false
		this.id = raw.id
		this.teamId = raw.team_id
		this.numFiles = raw.file_count
		this.numFolders = raw.folder_count
		this.numCollaborators = raw.collaborator_count
		this.ownerId = raw.owner_id
		this.description = raw.description
		this.updatedAt = raw.updated_at
		this.isPrivate = raw.private
		this.storageGB = this.calculateStorage(raw.storage).GB
		this.storageMB = this.calculateStorage(raw.storage).MB
		this.storageBytes = raw.storage
		this.rootAssetId = raw.root_asset_id
	}
}


class Asset extends Schema {
	constructor(raw = {}) {
		super(raw)
		this.name = raw.name
		this.type = raw.type
		this.label = raw.label
		this.filetype = raw.filetype
		this.description = raw.description
		this.fps = raw.fps
		this.duration = this.calculateDuration(raw.duration)
		this.id = raw.id
		this.parentId = raw.parent_id
		this.creatorId = raw.creator_id
		this.projectId = raw.project_id
		this.teamId = raw.team_id
		this.accountId = raw.account_id
		this.numViews = raw.view_count
		this.numComments = raw.comment_count
		this.numVersions = raw.versions
		this.numItems = raw.public_item_count
		this.filesizeGB = this.calculateStorage(raw.filesize).GB
		this.uploadedAt = raw.uploaded_at
		this.updatedAt = raw.updated_at
		this.coverUrl = raw.cover
	}
}










module.exports = {Team, Project, Asset}