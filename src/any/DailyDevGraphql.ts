export const DailyDevGraphql = `
query AnonymousFeed(
	$loggedIn: Boolean! = false
	$first: Int
	$after: String
	$ranking: Ranking
	$version: Int
	$supportedTypes: [String!] = ["article", "share"]
) {
	page: anonymousFeed(
		first: $first
		after: $after
		ranking: $ranking
		version: $version
		supportedTypes: $supportedTypes
	) {
		...FeedPostConnection
	}
}

fragment FeedPostConnection on PostConnection {
	pageInfo {
		hasNextPage
		endCursor
	}
	edges {
		node {
			...FeedPost
			...UserPost @include(if: $loggedIn)
		}
	}
}

fragment FeedPost on Post {
	id
	title
	createdAt
	image
	readTime
	source {
		...SourceShortInfo
	}
	sharedPost {
		...SharedPostInfo
	}
	permalink
	numComments
	numUpvotes
	commentsPermalink
	scout {
		...UserShortInfo
	}
	author {
		...UserShortInfo
	}
	trending
	tags
	type
	private
}

fragment SharedPostInfo on Post {
	id
	title
	image
	readTime
	permalink
	commentsPermalink
	summary
	createdAt
	private
	scout {
		...UserShortInfo
	}
	author {
		...UserShortInfo
	}
	type
	tags
	source {
		...SourceShortInfo
	}
}

fragment SourceShortInfo on Source {
	id
	handle
	name
	permalink
	description
	image
	type
	active
}

fragment UserShortInfo on User {
	id
	name
	image
	permalink
	username
	bio
}

fragment UserPost on Post {
	read
	upvoted
	commented
	bookmarked
}
`
