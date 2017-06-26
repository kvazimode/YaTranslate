const https = require('https')
const http = require('http')
const fs = require('fs')
const url = require('url')
const key = require('./key')
var file = "index.html"
var data = ""
var linkStart = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='
var linkEnd = '&lang=en-ru'
var parsed = ''

fs.readFile(file, (err, buf) => {
    if(err)
        console.log(err)
    else
        data = buf
        console.log("> Page loaded")
})

function onRequiest(request, response){
    console.log("---------------")
    word =  url.parse(request.url, true).query.word

    if (request.url === '/favicon.ico' || word === (undefined || '')){
        response.end()}
    else{
        console.log('> You asked to translate: ' + word)
        https.get(linkStart + key.key + '&text=' + word + linkEnd, (res) => {
            console.log('> Asking Yandex..')
            var raw = ''
            res.on('data', (chunk) => raw += chunk)
            res.on('end', () => {
                parsed = JSON.parse(raw)
                console.log('> Translation is: ' + parsed.text)
                response.writeHead(200, {"Content-Type": "text/html"})
                response.write(data + '<p>Перевод таков: ' + parsed.text + '</p></body></html>')
                response.end()
            })
        })
        }
}

http.createServer(onRequiest).listen(8087)
console.log("> Server created")
