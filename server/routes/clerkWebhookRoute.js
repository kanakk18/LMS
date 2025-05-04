import express from 'express';
import { updateRoleToEducator} from '../controllers/educatorController.js';

const educatorRouter = express.Router();

// Clerk webhook route
educatorRouter.get('/update-role', updateRoleToEducator)
export default educatorRouter;
