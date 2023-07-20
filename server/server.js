import app from './app.js';
//const server = require("http").Server(app);
//const io = require("socket.io")(server);
//const clientPG = require('../server/DB/connect.js');
import pkg from 'pg';
//import fetch from 'node-fetch';
//const mqtt = require('mqtt');
//const CryptoJS = require("crypto-js");
//const fetch = require('node-fetch');
//const Buffer = require('buffer').Buffer
import { readFile } from 'fs';
//const FormData = require('form-data');
//const { execFile } = require('child_process');
import Odoo from 'odoo';



const io = require('socket.io')(3007, {
  cors: {
    origin: '*',
  }
});


// Puerto de escucha servidor
let port = 24172 || process.env.PORT;
app.listen(port, () => {
  console.log("server is running in port " + port);
});


let odoo;
let connectOdoo = false;
let arrayDevices = []; // array de dispositivos que van a leerse de arrayData.json
let intervalTime = 3000; 




//########################  Lee datos de conexion a Odoo alojados en odooData.json  ########################
/*
function connectingOdoo(){
  let dataOdooConnect = [];
  readFile('odooData.json', (err, data) => {
    if (!err) {
      if (data != undefined && data != null && data != '') {
        console.log('odooData :'+data);
        dataOdooConnect = JSON.parse(data);        
      }      
    } else {
      console.log('odooData error: '+err);
    }
  });
  setTimeout(() => { // Espera que se lean los datos de conexion a Odoo.
    console.log('');
    console.log('Creando instancia de Odoo con data: '+JSON.stringify(dataOdooConnect));
    console.log('');
    if (odoo instanceof Odoo) {
      odoo.disconnect();
    }
    odoo = new Odoo({
      host: dataOdooConnect.host,
      port: parseInt(dataOdooConnect.puerto), 
      database: dataOdooConnect.baseDatos,
      username: dataOdooConnect.usuario,
      password: dataOdooConnect.contrasena
    }); 
    
    odoo.connect(function (err) {
      if (err) { 
        if (odoo instanceof Odoo) {
          console.log('odoo es una instancia de Odoo!');
          odoo.disconnect();
        }
        return console.log('Error conectando con Odoo: '+JSON.stringify(err.data.name));
      } else {
        connectOdoo = true;
        return console.log('Conectado al Servidor de Odoo!');
      }
    });      

  }, 500);
}
*/
function connectingOdoo() {
  readFile('odooData.json', (err, data) => {
    if (err) {
      console.log('odooData error: ' + err);
      return;
    }

    let dataOdooConnect = JSON.parse(data);
    console.log('Creando instancia de Odoo con data: ' + JSON.stringify(dataOdooConnect));
    /*
    if (odoo instanceof Odoo) {
      odoo.end(function (err) {
        if (err) { return console.log(err); }
        console.log('Disconnected from Odoo server.');
      });
    }
    */
    odoo = new Odoo({
      host: dataOdooConnect.host,
      port: parseInt(dataOdooConnect.puerto), 
      database: dataOdooConnect.baseDatos,
      username: dataOdooConnect.usuario,
      password: dataOdooConnect.contrasena
    });
    
    odoo.connect(function (err) {
      if (err) { 
        /*
        if (odoo instanceof Odoo) {
          console.log('odoo es una instancia de Odoo!');
          odoo.disconnect();
        }
        */
        // return console.log('Error conectando con Odoo: '+JSON.stringify(err.data.name));
      } else {
        connectOdoo = true;
        // return console.log('Conectado al Servidor de Odoo!');
      }
    });
  });
}

//##################################################################################################





//#######################Lee array.json de dispositivos y setea intervalTime  ######################
async function readArrayDevicesAndSetIntervalTime(){
  readFile('arrayData.json', (err, data) => {
    if (!err) {
      if (data != undefined && data != null && data != '') {
        arrayDevices = JSON.parse(data);
        if (arrayDevices.length > 0) {
          intervalTime = arrayDevices.length * 10000;
        }        
      }      
    } else {
      console.log('Read file error: '+err);
    }
  });
}
//##################################################################################################






//########################  Formateador de fechas de Odoo y de BBDD local  ########################
function formatFecha (fecha) {

  if (fecha.name == 'odoo') {
    const date = Date.parse(fecha.date);
    //const timeZone = "America/Argentina/Buenos_Aires"; // esta da +3
    const timeZone = "America/Belize"; // esta da ok

    const formatter = new Intl.DateTimeFormat('fr-CA', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const formattedDate = formatter.format(date).replace(/ h | min /gi, ":").replace(/ s|,/gi, "");
    return formattedDate;
  }

  if (fecha.name == 'local') {
    const date = Date.parse(fecha.date);
    //const timeZone = "America/Argentina/Buenos_Aires"; // esta da +3
    //const timeZone = "America/Belize"; // esta da -3
    const timeZone = "Africa/Monrovia"; // esta da 0

    const formatter = new Intl.DateTimeFormat('fr-CA', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const formattedDate = formatter.format(date).replace(/ h | min /gi, ":").replace(/ s|,/gi, "");
    return formattedDate;
  }
}
//##################################################################################################


//###########################  Para mostrar fecha corregida en consola  ############################
function ShowConsoleFecha(fechaRecibida){
  //console.log(fechaRecibida);
  let regex = /\s[0-9]{2}/i;  
  let hora = `${parseInt(fechaRecibida.slice(11, 13))}`;
  if (hora == 0) {
    hora = ' 24';
    fechaRecibida = fechaRecibida.replace(regex, hora);
  }
  if (hora == 1) {
    hora = ' 25';
    fechaRecibida = fechaRecibida.replace(regex, hora);
  }
  if (hora == 2) {
    hora = ' 26';
    fechaRecibida = fechaRecibida.replace(regex, hora);
  }
  if (hora == 3) {
    hora = ' 27';
    fechaRecibida = fechaRecibida.replace(regex, hora);
  }
  //console.log(fechaRecibida);
  if (hora.length < 2) {
    hora = ` 0${parseInt(fechaRecibida.slice(11, 13))-3}`;
    //console.log('1*'+hora);
  } else {
    hora = ` ${parseInt(fechaRecibida.slice(11, 13))-3}`;
    //console.log('2*' + hora);
  }
  let fechaConvert = fechaRecibida.replace(regex, hora);
  //console.log(fechaConvert);
  return fechaConvert;
}
//#################################################################################################





//###########################  función Odoo DB connect and get products  ##########################
async function queryOdoo(ultimActualizLocal) {
  //console.log('ultimActualizLocal: ' + ultimActualizLocal);
  let productos = [];
  try {
    await new Promise((resolve, reject) => {
      let params = {
        ids: [],
        domain: [['write_date', '>', ultimActualizLocal], ['id', '!=', '1'], ['id', '!=', '2']],
        fields: ['default_code', 'sale_ok', 'name', 'list_price', 'tax_string', 'barcode', 'to_weight', 'categ_id', 'write_date'],
        order: 'id',
        limit: 10000,
        offset: 0,
      };

      odoo.search_read('product.template', params, async function (err, products) {
        if (err) {
          reject('Error trayendo productos de Odoo: ' + JSON.stringify(err.message));
        } else {
          console.log('Retornando products...');
          productos = await products;
          resolve();
        }        
      });
    });
    return productos;
  } catch (error) {
    throw new Error(error);
  }
}
//#################################################################################################






//#####################   función local DB connect and get last updated  ##########################
const connectLocalDB = async(ip, name)=>{
  const { Client } = pkg;

  const configDB = {
    user: 'systel',
    host: ip,
    port: '5432',
    password: 'Systel#4316',
    database: 'cuora'      
  }

  const client = new Client(configDB);

  try{
    await client.connect();  
    const last = await getLastUpdated(client, name);
    client.end();
    return last;
  } catch (err){
    console.error('Falló la conexión con la BBDD de '+name);
    return false;
    client.end();
  } 
  
}
//#########################################################################################################






//#############################  Trae último actualizado de BBDD local  ####################################
const getLastUpdated = async(client, name)=>{
  try {
    let resultQueryLastUpdated = await client.query("SELECT MAX(updated) FROM public.product");
    let lastDateProduct = Object.values(resultQueryLastUpdated.rows[0]);
    let fechaLocal = { name: 'local', date: lastDateProduct };
    let ultimActualizLocal = formatFecha(fechaLocal);

    console.log(`Ultimo producto, en BBDD local de ${name}, actualizado el: ${ShowConsoleFecha(ultimActualizLocal)}`); // (hay que restarle tres horas para saber la hora real que tiene el producto)'); // Le aumento tres horas a la hora del último producto cargado en BBDD local porque el servidor de Odoo tiene tres horas más en su configuración regional entonces cuando busco un producto más nuevo que el último cargado en la BBDD local, me trae todos los de las últimas tres horas.
    // El error está en la api de Odoo. la base de datos tiene bien la hora pero la API de Odoo, cuando recibe la hora para crear la query que le pega a su BBDD, la parsea a UTC 0.
    client.end();
    return ultimActualizLocal;
  } catch (e) {
    //console.log(e);
    console.log(`No se pudo traer el ultimo producto de la BBDD local de ${name}`);
    //console.log(e);
    client.end();
  }
}
//###########################################################################################################





//##################   función actualiza los dispositivos con los datos traidos de Odoo  ####################
const updateDevice = async (ip, name, products, callback) => {
  const { Client } = pkg;

  const configDB = {
    user: 'systel',
    host: ip,
    port: '5432',
    password: 'Systel#4316',
    database: 'cuora',
    //statement_timeout: 20000,
  }

  const client = new Client(configDB);
  await client.connect();

  try {
    for (const product of products) {
      await client.query(`select create_product_vicl($1, $2, $3, $4, $5, $6)`, [product.default_code, product.name, product.list_price, product.barcode, product.to_weight, product.write_date]);
      console.log(`Producto ${product.name} actualizado en BBDD local de ${name}`);
    }
    callback(null);
  } catch (error) {
    callback(`No se pudieron cargar los productos en la BBDD local de ${name}. Error: ${error}`);
  } finally {
    await client.end();
  }
};
//###########################################################################################################
 




// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ejecución automática &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
(() => {
  
  //connectingOdoo();
  
  io.on('connection', (socket) => { // ver si esto no va a provocar una interrupción ya que solo se ejecuta el codigo si primero se establece la conexion con webSockets
    console.log('WebSocket conectado al cliente');

    connectingOdoo();
    readArrayDevicesAndSetIntervalTime();

    setTimeout(() => { // espera la conexion con Odoo y espera que lea la cantidad de dispositivos
      console.log('Inicia intervalo en: '+intervalTime);      

      const intervalId = setInterval(() => {// Este time debe ser Array.length * 10000 

        if (connectOdoo === false) {
          let message = 'false';
          socket.emit('isConnectedToOdoo', message);
          clearInterval(intervalId);
        }
        
        //console.clear();         
  
        console.log('Intervalo actualizado a: '+intervalTime);
  
        //************** Lee array.json de dispositivos y setea intervalTime **************
        readArrayDevicesAndSetIntervalTime();
        //*********************************************************************************      
    
        if (arrayDevices.length < 1) {
          console.log('No hay dispositivos cargados!');
        } else {
          arrayDevices.map(async (elem) => {
            console.log('Dispositivo cargado: ' + elem.name);
            let ip = elem.ip;
            let name = elem.name;
            let pro = [];// array de productos traidos desde Odoo ( se actualiza llamando a "queryOdoo(ultimActualizLocal)" )
            //***************** Ultimo producto actualizado en BBDD local **********************
            let ultimActualizLocal = await connectLocalDB(ip, name);
            //**********************************************************************************
    
            let connected = false;
            let message = {ip: ip, connected: connected};
            if (ultimActualizLocal !== false){ // Si pudo conectarse al dispositivo y pudo traer el último producto actualizado...
              connected = true;
              message = {ip: ip, connected: connected};
              socket.emit('isConnected', message); //Pinto de color verde las IPs en el front.
    
              //***************** trayendo productos a actualizar desde Odoo *********************
              try {
                pro = await queryOdoo(ultimActualizLocal);
              } catch (error) {
                console.log(error);
              }
              //**********************************************************************************


              //==================================================================================
              //================ test return fields product (Borrar despues de prueba) ===========
              //==================================================================================
              if (pro.length > 0) {
                console.log('Hay productos');                                
                for (const product of pro) {
                  console.log(' ');
                  console.log('=============================================================================');                  
                  if (product.tax_string !== ' ' && product.tax_string !== '' && product.tax_string !== null && product.tax_string !== undefined) {
                    console.log('Producto con IVA: '+product.tax_string);
                    console.log(' ');
                    let iva = product.tax_string;
                    let newiva = iva.split(' ');
                    let precioConIva = newiva[1].replace('$', '').replace('.', '').replace(',', '.');
                    product.list_price = precioConIva;                    
                  } else {
                    console.log('Producto sin IVA: (= $ '+product.list_price+')');
                    console.log(' ');
                  }
                  if (product.sale_ok !== ' ' && product.sale_ok !== '' && product.sale_ok !== null && product.sale_ok !== undefined) {
                      if (product.sale_ok == true) {
                        product.sale_ok = 'Y';
                      } 
                      if (product.sale_ok == false) {
                        product.sale_ok = 'N';
                      }                 
                  }
                  if (product.to_weight !== ' ' && product.to_weight !== '' && product.to_weight !== null && product.to_weight !== undefined) {
                    if (product.to_weight === true) {
                      product.to_weight = '0';
                    } 
                    if (product.to_weight === false) {
                      product.to_weight = '1';
                    }
                  }
                  if (product.categ_id !== ' ' && product.categ_id !== '' && product.categ_id !== null && product.categ_id !== undefined) {
                    let depto = product.categ_id.toString();
                    let newdepto = depto.split(',');
                    let department = newdepto[1];
                    product.categ_id = department;                    
                  }

                  product.to_weight = parseInt(product.to_weight);
                  product.default_code = parseInt(product.default_code);
                  product.list_price = parseFloat(product.list_price);
                  
                  console.log(`product_id: ${product.default_code}\nisactive: ${product.sale_ok}\nproduct_name: ${product.name}\nprice_list: ${product.list_price}\nprimary_barcode_flag_data: ${product.barcode}\nattribute: ${product.to_weight}\ndepartment: ${product.categ_id}\nupdated: ${ShowConsoleFecha(product.write_date)}`);
                  console.log('=============================================================================');
                }
              }
              //==================================================================================
              //==================================================================================
              //==================================================================================


              /*
              if (pro.length > 0) {
                console.log('Hay productos');
                //************  Actualización de productos en dispositivo  *********************
                updateDevice(ip, name, pro, (err) => {
                  if (err) {
                    console.error(`Hubo un error: ${err}.`);
                  } else {
                    console.log('Todos los productos se actualizaron correctamente');
                  }
                });
              } else {
                console.log(`NO hay productos por actualizar ${name}.`);
              }
              */    
            } else {
              message = {ip: ip, connected: connected};
              socket.emit('isConnected', message); //Pinto de color rojo las IPs en el front.
            }
            
          });// arrayDevices.map()
        }
      }, intervalTime); // setInterval() // Este time debe ser Array.length * 10000      

    }, 1000); // setTimeout que espera la conexion con Odoo y espera que lea la cantidad de dispositivos    
  
    socket.on('disconnect', () => {
      console.log('WebSocket desconectado');
      socket.disconnect();
    });
  });  
})();
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& FIN ejecución automática &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&