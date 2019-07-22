const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const https = require('https');
const app = express()
const PORT = process.env.PORT || 5000

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};


app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json());

app.locals.monedas = {
  "USD":"USD", 
  "EUR":"EUR", 
  "GBP":"GBP", 
  "CAD":"CAD", 
  "JPY":"JPY", 
  "AUD":"AUD"
}

  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.get('/', (req, res) => res.render('pages/index'))
  //Inciso 1
  app.get('/latest/:moneda',(req,res)=>{
    if (app.locals.monedas[req.params.moneda]){
      https.get('https://api.exchangeratesapi.io/latest?base='+req.params.moneda, data =>{
        let datos = ''
        data.on('data', (chunk) => {
          datos += chunk
        })
        data.on('end', () => {
          let send = JSON.parse(datos)
          for (let i in send.rates){
            if (!app.locals.monedas[i]){
              delete send.rates[i]
            }
          }
          res.send(send)
        })
      })
    }else{
      res.send({"err":"No se ha encontrado la moneda o no existe"})
    }
  })//segundo inciso
  .get('/latest/:base/:versus', (req, res)=>{
    if (app.locals.monedas[req.params.base]){
      if (app.locals.monedas[req.params.versus]){
        https.get('https://api.exchangeratesapi.io/latest?base='+req.params.base, data=>{
          let datos = ''
            data.on('data', (chunk) => {
              datos += chunk
            })
            data.on('end', () =>{
              let temp = JSON.parse(datos)
              let send = {
                "base":req.params.base,
                "versus":req.params.versus,
                "date":temp.date
              }
              for (let i in temp.rates){
                if (i == req.params.versus){
                  send["rate"] = temp.rates[i]
                }
              }
              res.send(send)
            })
        })
        console.log(req.params)
      }else{
        res.send({"err":"No se ha encontrado la moneda o no existe"})
      }
    }else{
      res.send({"err":"No se ha encontrado la moneda o no existe"})
    }
  })//tercer y cuarto inciso
  .get('/historical/:base/:versus', (req, res)=>{
    if (app.locals.monedas[req.params.base]){
      if (app.locals.monedas[req.params.versus]){
        if (req.query.date){
          calcular(req.query.date, req.query.date)
        }else{
          if (req.query.start && req.query.end){//yyyy-mm-dd -----> mm-dd-yyyy
            calcular(req.query.start, req.query.end)
          }else{
            res.send({"err":"Los parámetros enviados son inválidos"})
          }
        }
      }else{
        res.send({"err":"No se ha encontrado la moneda o no existe"})
      }
    }else{
      res.send({"err":"No se ha encontrado la moneda o no existe"})
    }

    function convertir(cadena){
      let temp = [3]
      let tempstr = [3]
      temp = cadena.split("-")
      tempstr[0] = temp[2]
      tempstr[1] = temp[0]
      tempstr[2] = temp[1]
      return tempstr[0]+'-'+tempstr[1]+'-'+tempstr[2];
    }

    function calcular(start, end){
      https.get('https://api.exchangeratesapi.io/history?start_at='+convertir(start)+'&end_at='+convertir(end)+'&base='+req.params.base, data =>{
        let datos = ''
        data.on('data', (chunk) => {
          datos += chunk
        })
        data.on('end', () =>{
          let temp = JSON.parse(datos)
          let send = {
            "base": req.params.base,
            "versus": req.params.versus,
            "start": start,
            "end": end,
            "rates": {}
          }
          for (let i in temp.rates){
            for (let j in temp.rates[i]){
              if (j == req.params.versus){
                console.log(temp.rates[i][j])
                send["rates"][i] = temp.rates[i][j]
              }
            }
                  
          }
          res.send(send)
        })
      })
    }
  })
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
