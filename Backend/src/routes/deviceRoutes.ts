import express from 'express';
import { getDevices, toggleDevice } from '../controllers/deviceController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getDevices);
router.post('/toggle', toggleDevice);

export default router;
