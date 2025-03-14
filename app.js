const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public' )))

app.get('/', (req, res) => res.render('index'))
app.get('/tcp', (req, res) => res.render('tcp'))
app.get('/dashboard', (req, res) => res.render('dashboard'))
app.get('/decoder', (req, res) => res.render('decoder'))
app.get('/orderofpayment', (req, res) => res.render('./templates/order_of_payment'));

app.listen(port, () => console.log(`App is listening on http://localhost:3000/`))