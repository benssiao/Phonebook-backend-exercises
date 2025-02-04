const mongoose = require('mongoose')
require('dotenv').config()
const mongodbUrl = process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(mongodbUrl).then(result => {
  console.log('connected to MongoDB')
})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookEntrySchema = new mongoose.Schema({
  name: { type: String, minLength: 3 },
  number: { type: String, validate: function(number) {
    const regex = new RegExp('\\d{2,3}-\\d+')
    console.log(regex.test(number))
    return regex.test(number) && number.length - 1 >= 8 // number.length - 1 to account for hyphen
  } },
})

phonebookEntrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', phonebookEntrySchema)
