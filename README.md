# enterprise-test-api

Una API desarrollada con [Express 4](http://expressjs.com/).


## correr localmente

Necesita tener instalado [Node.js](http://nodejs.org/) y [Heroku CLI](https://cli.heroku.com/).

## Endpoints

### /latest/{MONEDA}

Recibe un "simbolo" de moneda y retorna su valor con respecto a las demás

´´
https://enterprise-test-server.herokuapp.com/latest/USD
´´

### /latest/{BASE}/{VERSUS}

Recibe dos "simbolos" de moneda y retorna la tasa de cambio entre ellas

´´
https://enterprise-test-server.herokuapp.com/latest/USD/JPY
´´

### /historical/{BASE}/{VERSUS}?date={mm-dd-yyyy}

Recibe dos "simbolos" de moneda más una fecha y retorna la tasa de cambio de las monedas en la fecha establecida

´´
https://enterprise-test-server.herokuapp.com/historical/USD/JPY?date=5-15-2018
´´

### /historical/{BASE}/{VERSUS}?start={mm-dd-yyyy}&end={mm-dd-yyyy}

Recibe dos "simbolos" de moneda más dos fechas y retorna todas los valores de la tasa de cambio que hubieron entre las dos fechas

´´
https://enterprise-test-server.herokuapp.com/historical/USD/JPY?start=5-15-2018&end=5-29-2018
´´

## Notas

-Las monedas válidas son: USD, EUR, GBP, CAD, JPY, AUD.

-El api usado para obtener las tasas de cambio es [Foreign exchange rates API
with currency conversion](http://exchangeratesapi.io/).

-Se puede obtener cualquier tasa de cambio desde 1999.


## Documentación

Para más información acerca del uso de node.js en Heroku, puedes leer estos artículos:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
