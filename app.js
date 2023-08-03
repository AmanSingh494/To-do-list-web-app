/* eslint-disable n/no-path-concat */
const express = require('express')
const bodyParser = require('body-parser')
// const date = require(`${__dirname}/date.js`)
const _ = require('lodash')
const mongoose = require('mongoose')
const app = express()

// setting up mongoose
main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/To-do-list-DB')
}
const itemSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  }
})
const item = mongoose.model('ListItem', itemSchema)

const listSchema = new mongoose.Schema({
  name: { type: 'string', required: true },
  items: [itemSchema]
})
const lists = mongoose.model('List', listSchema)
const defaultItems = [
  { name: 'Do Inner Engineering' },
  { name: 'Buy Basketball and shoes' },
  { name: 'Do coding' }
]

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// deploying static files
app.use(express.static('public'))
// setting up ejs
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
  try {
    const itemsInDB = await item.find()
    if (itemsInDB.length === 0) {
      item.insertMany(defaultItems)
      res.redirect('/')
    } else {
      res.render('list', {
        // listTitle: day,
        newListItems: itemsInDB,
        CustomListName: '/',
        ListName: 'Today'
      })
    }
  } catch (err) {
    console.error(err)
  }
})

app.post('/', async (req, res) => {
  const addedItem = _.upperFirst(req.body.addItem)
  const listName = await req.body.list
  if (listName === 'Today') {
    await item.create({ name: addedItem })
    res.redirect('/')
  } else {
    await lists.updateOne(
      { name: listName },
      { $push: { items: { name: addedItem } } }
    )
    res.redirect(`/${listName}`)
  }
})

app.get('/:customListName', async (req, res) => {
  console.log('triggered get customList route')
  const customListName = _.upperFirst(req.params.customListName)
  console.log(customListName)
  try {
    if ((await lists.findOne({ name: customListName })) === null) {
      await lists.create({ name: customListName, items: defaultItems })
      console.log('list created successfully')
      res.redirect(`/${customListName}`)
    } else {
      console.log('LIST NAME ALREADY INCLUDED')
      const itemsInDB = await lists.findOne({ name: customListName })
      res.render('list', {
        newListItems: itemsInDB.items,
        // CustomListName: customListName,
        ListName: customListName
      })
    }
  } catch (err) {
    console.log(err)
  }
})
app.post('/options', async (req, res) => {
  try {
    // delete part
    const deleteItemId = req.body.delete
    const listName = req.body.ListName
    if (listName === 'Today') {
      await item.deleteOne({ _id: deleteItemId })
      res.redirect('/')
    } else {
      await lists.updateOne(
        { name: listName },
        { $pull: { items: { _id: deleteItemId } } }
      )
      res.redirect(`/${listName}`)
    }
  } catch (err) {
    console.log(err)
  }
})
app.post('/edit', (req, res) => {
  console.log(req.body.NewListItem)
})
app.listen('3000', () => console.log('server is running at port 3000'))
