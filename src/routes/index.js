import { Router } from 'express';
import { CreateKey } from '../controllers/CreateKeyController';

const routes = Router();

routes.post("/generated", CreateKey);

export default routes;