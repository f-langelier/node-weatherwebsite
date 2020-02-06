// Core Modules
const path = require('path')
// NPM Modules
const express = require('express')
const hbs = require('hbs')
// Files
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

// Create Express application
const app = express()
const port = process.env.PORT || 3000

// Define Paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views locations
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory to serve
app.use(express.static(publicPath))

// Routes
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Fred'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Fred'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Fred',
        helpText: 'This is the help Page'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Fred',
        errorMessage: 'Help article not found'
    })
})

// External Weather Calls
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, place_name} = {}) => {
        if (error) {
            //return stops the function
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location: place_name,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
    console.log(req.query)
})

// 404 Route
app.get('*', (req, res) => {
    res.send({
        forecast: 'Rain, pourin',
        name: 'Fred'
    })
})

// Start server on port + Startup function 
app.listen(port, () => {
    console.log('Server is running on port ' + port)
})
