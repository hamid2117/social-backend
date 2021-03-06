const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    // to get data from users collection
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
})

module.exports = model('Post', postSchema) //Post will become posts
