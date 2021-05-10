const Post = require('./../../models/Post')
const { AuthenticationError, UserInputError } = require('apollo-server')
const checkAuth = require('./../../util/check-auth')
module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      } catch (error) {
        console.log(error)
      }
    },
    async getPost(_, { idpost }) {
      try {
        const post = await Post.findById(idpost)
        if (post) {
          return post
        } else {
          throw new Error('There is no post')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    //* Make sure only logined user can create post
    //! people make mistake by adding auth middleware for express itself (thats means that would run on each request EVEN on none protected routes)

    //TODO : We will add third argu in appolloserver called context
    async createPost(_, { cBody }, context) {
      const user = checkAuth(context)
      // console.log(user)
      // got data from token || authorize
      if (cBody.trim() == '') {
        throw new Error('Post must not be empty')
      }
      const creationPost = new Post({
        body: cBody,
        username: user.username,
        id: user.id,
        createdAt: new Date().toISOString(),
      })
      const post = await creationPost.save()
      //subcribtion code
      context.pubsub.publish('NEW_POST', {
        newPost: post,
      })
      return post
    },

    async deletePost(_, { delId }, context) {
      const user = checkAuth(context)
      try {
        const post = await Post.findById(delId)

        if (user.username === post.username) {
          //idhr error h
          await post.delete()
          return 'Post was deleted'
        } else {
          throw new AuthenticationError('There is an error')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
    },
  },
}
