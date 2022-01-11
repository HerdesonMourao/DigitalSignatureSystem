import { Router } from 'express';
import { CreateKey } from '../controllers/CreateKeyController';
import { SendPublicKey } from '../controllers/SendPublicKeyController';

const routes = Router();

routes.post("/generate-key", CreateKey);
routes.post("/send-public-key", SendPublicKey);

export default routes;