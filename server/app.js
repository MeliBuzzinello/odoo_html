import express, { json, urlencoded } from "express";
import { join } from "path";
import morgan from "morgan";
//const bodyParser = require('body-parser'); 
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
// const rutas
import testRoutes from './routes/test.routes';

const app = express();

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', join(__dirname, './views'));
app.use(express.static(__dirname+'/public'));

// middlewares
app.use(json({limit: "100mb"}));
//app.use(bodyParser.json()); //se comenta porque ya uso express.json() que hace lo mismo.
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(cors({origin: '*'}));
// middleware de seguridad
app.use(helmet());
// middleware de compresion http
app.use(compression());

// rutas principales
app.use('/', testRoutes);

app.use((req, res, next) => {
    console.log(`Se recibió una solicitud ${req.method} para la ruta ${req.url}`);
    next();
});



export default app;
