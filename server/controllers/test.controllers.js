import { Console } from 'console';

const fs = require('fs');
//const path = require("path");
//import { clientMQTT } from "../server.js";
//import { pool } from '../DB/repository/connect'
//import { server } from '../server'
//import { eventEmitter } from '../server'
//import CryptoAES from 'crypto-js/aes';
//import CryptoENC from 'crypto-js/enc-utf8';
//import { randomUUID } from "crypto";

//const archiver = require('archiver');

async function getDataFromArchiveJson() {
  fs.readFile('arrayData.json', (err, data) => {
      if (!err) {
        if (data != undefined && data != null && data != '') {
          console.log('data desde getDataFromArchiveJson():'+data);
          return data;          
        } else {
          return null;
        }      
      } else {
        console.log('Read file error: '+err);
      }
    });
}



export const home = (req, res) => {
  console.log('Renderizando home.ejs....');
  return res
      .header('Access-Control-Allow-Origin', '*')
      .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;")
      .status(200).render('home.ejs');           
}




export const postLoader = (req, res) => {
  console.log('Renderizando loader.ejs....(POST)');
  let data = req.body;
  console.log('Data recibida desde form: '+ JSON.stringify(data));
  console.log('');

  fs.writeFile('odooData.json', JSON.stringify(data), (err) => {
    if (!err) {
      console.log('Se creó o sobreescribió el archivo odooData.json');
    } else {
      console.log('No se pudo crear o sobrescribir el archivo odooData.json');
    }
  });

  return res
      .header('Access-Control-Allow-Origin', '*')
      .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;")
      .status(200).json({ status: 200, message: 'ok' });           
}




export const getLoader = (req, res) => {
  //console.log('Renderizando loader.ejs....(GET)');

  return res
      .header('Access-Control-Allow-Origin', '*')
      .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;")
      .status(200).render('loader.ejs');           
}




export const getData = async (req, res) => {
  try { 
    let arrayData =[];   
    fs.readFile('arrayData.json', (err, data) => {
      if (!err) {
        if (data != undefined && data != null && data != '') {
          //console.log('data :'+data);
          arrayData = JSON.parse(data);
          return res
            .header('Access-Control-Allow-Origin', '*')
            .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            .set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
            .status(200)
            .json(arrayData);          
        }      
      } else {
        console.log('Read arrayData.json error: '+err);
      }
    });    
  } catch (err) {
    console.log('Read arrayData.json error: ' + err);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
}





export const loaDevices = async (req, res) => {
    let dataBody = req.body;
    let arrayData = [];
    //console.log('Datos recibidos desde front: '+JSON.stringify(dataBody));
    

    //######################################################### Lee arrayData.json
    fs.readFile('arrayData.json', (err, data) => {
      if (!err) {
        if (data != undefined && data != null && data != '') {
          arrayData = JSON.parse(data);
        }      
      } else {
        console.log('Read arrayData.json, en loaDevices, error: '+err);
      }
    });
    


    //######################################################### Agrega dataBody a arrayData.json

    setTimeout(() => {
      arrayData.push(dataBody);
    }, 500);

    setTimeout(() => {
    //######################################################### Crea nuevo arrayData.json
      fs.writeFile('arrayData.json', JSON.stringify(arrayData), (err) => {
        if (!err) {
          console.log('Se creó o sobreescribió el archivo arrayData.json');
        } else {
          console.log('No se pudo crear o sobrescribir el archivo arrayData.json');
        }
      });
    }, 1000);
    
    
    return res
    .header('Access-Control-Allow-Origin', '*')
    //.set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    .status(200).json({status: 200, message: 'Ok'});               
}





export const deleteDevices = async (req, res) => {
    let dataBody = req.body;
    let arrayData = [];
    console.log('Datos recibidos desde front: '+JSON.stringify(dataBody));
    

    //######################################################### Lee arrayData.json
    fs.readFile('arrayData.json', (err, data) => {
      if (!err) {
        if (data != undefined && data != null && data != '') {
          arrayData = JSON.parse(data);
        }      
      } else {
        console.log('Read file error: '+err);
      }
    });

    setTimeout(() => {
      arrayData = arrayData.filter((elem) => elem.name != dataBody.name);
    }, 500);


    setTimeout(() => {
    //######################################################### Crea nuevo arrayData.json
      fs.writeFile('arrayData.json', JSON.stringify(arrayData), (err) => {
        if (!err) {
          console.log('Se creó o sobreescribió el archivo arrayData.json');
        } else {
          console.log('No se pudo crear o sobrescribir el archivo arrayData.json');
        }
      });
    }, 1000);

    return res
    .header('Access-Control-Allow-Origin', '*')
    //.set("Content-Security-Policy", "script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    .status(200).json({status: 200, message: 'Ok'});
}
