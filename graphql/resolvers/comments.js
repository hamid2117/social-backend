const { UserInputError, AuthenticationError } = require('apollo-server-errors')
const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

module.exports = {
  Mutation: {
    //  arrow function
    async createComment(_, { body, postId }, context) {
      const user = checkAuth(context)
      if (body.trim() == '') {
        throw new UserInputError('comments', {
          error: { body: 'comments not be empty' },
        })
      }
      const post = await Post.findById(postId)
      if (post) {
        //overwriting post
        post.comments.unshift({
          body, //es6
          username: user.username,
          createdAt: new Date().toISOString(),
        })
        await post.save()
        return post
      } else throw new Error('Cannot able to find this post')
    },
    deleteComment: async (_, { delId, commentId }, context) => {
      const { username } = checkAuth(context)
      const post = await Post.findById(delId)
      if (post) {
        const commentIndex = await post.comments.findIndex(
          (c) => c.id === commentId
        ) // give you index
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1)
          await post.save()
          return post
        } else {
          throw new AuthenticationError('Action not allowed')
          //only owner can delete it
        }
      } else throw new UserInputError('Post not found')
    },
    async LikePost(_, { postId }, context) {
      const { username, id } = checkAuth(context)
      const post = await Post.findById(postId)
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //remove like
          post.likes = post.likes.filter((like) => like.username !== username)
        } else {
          post.likes.push({
            username,
            id,
            createdAt: new Date().toISOString(),
          })
        }
        await post.save()
        return post
      } else throw new UserInputError('post not found ')
    },
  },
}
