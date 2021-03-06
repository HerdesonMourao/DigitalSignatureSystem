import { Router } from 'express';
import { CreateKey } from '../controllers/CreateKeyController';
import { CreateMessageEncrypted, ReadMessageDecrypted } from '../controllers/CreateMessageController';
import { SendPublicKey } from '../controllers/SendPublicKeyController';

const routes = Router();

routes.post("/generate-key", CreateKey);
routes.post("/send-public-key", SendPublicKey);
routes.post("/create-message", CreateMessageEncrypted);
routes.get("/decrypt-message", ReadMessageDecrypted);

export default routes;