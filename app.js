const { name } = require('ejs')
const express = require('express')
const path = require('path')
const app = express()
const port = 3001

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public' )))

app.get('/', (req, res) => res.render('index'))
app.get('/tcp', (req, res) => res.render('tcp'))
app.get('/dashboard', (req, res) => res.render('dashboard'))
app.get('/transportpermits', (req, res) => res.render('transport_permits'))
app.get('/decoder', (req, res) => res.render('decoder'))
app.get('/orderofpayment/:name', (req, res) => {
    const name = req.params.name;
    res.render('./templates/order_of_payment', {name: name})
});

app.listen(port, () => console.log(`App is listening on http://localhost:3001/`))