import { Router } from 'express';
import { route } from 'express/lib/application';
import { CreateKey } from '../controllers/CreateKeyController';

const routes = Router();

routes.post("/generated", CreateKey);

export default routes;