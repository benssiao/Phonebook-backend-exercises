const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('missing password')
  process.exit(1)
}

const password = process.argv[2]
const url =process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', phonebookEntrySchema)

if (process.argv.length === 3) {

  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
    process.exit(1)
  })
    .catch(error => {
      console.log('error in getting all users', error)
      mongoose.connection.close()
      process.exit(1)
    })
}
else {

  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const newUser = new Entry({
    name: newName,
    number: newNumber,
  })

  newUser.save().then(result => {
    console.log(`added ${newName} with number ${newNumber} to phonebook`)
    mongoose.connection.close()
  }).
    catch(error => {
      console.log('error in creating user:', error)
      mongoose.connection.close()
    })


}
