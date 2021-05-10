const postsresolvers = require('./posts')
const usersresovlers = require('./users')
const commentsresovlers = require('./comments')

module.exports = {
  Post: {
    likeCount: (parent) => {
      //  console.log(parent)
      return parent.likes.length
    },
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsresolvers.Query,
  },
  Mutation: {
    ...commentsresovlers.Mutation,
    ...usersresovlers.Mutation,
    ...postsresolvers.Mutation,
  },
  Subscription: {
    ...postsresolvers.Subscription,
  },
}

// DX   developer experince
