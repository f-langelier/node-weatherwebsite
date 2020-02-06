const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'https://api.darksky.net/forecast/31d705cdba10b2fe33f20af648f014ff/' + encodeURIComponent(lat) + ',' + encodeURIComponent(long)
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to forecast service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is a ' + body.currently.precipProbability + '% chance of rain.' + 'The low for today is: ' + body.daily.data[0].temperatureMin)
        }
    })
}

module.exports = forecast