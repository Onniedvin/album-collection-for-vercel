require('dotenv').config()

const SESSION_SECRET = process.env.SESSION_SECRET
const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
  SESSION_SECRET
}
