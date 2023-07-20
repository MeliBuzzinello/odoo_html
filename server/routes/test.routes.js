import { Router } from "express";
import * as controller from "../controllers/test.controllers.js";
const router = Router();

/*
router.post('/login', authControll.login);
router.post('/showDevices', authControll.showDevices);
router.get('/loadFile', authControll.loadFile);
router.post('/upload', authControll.upload);
router.post('/download', authControll.download);
router.get('/healthcheck', checkControll.healthcheck);
router.post('/getLogContent', authControll.getLogContent);
router.post('/lastDownload', authControll.lastDownload);
*/

router.get('/', controller.home);
router.post('/loader', controller.postLoader);
router.get('/loader', controller.getLoader);
router.get('/getData', controller.getData);
router.post('/loaDevices', controller.loaDevices);
router.post('/deleteDevices', controller.deleteDevices);

export default router;