import express from 'express';
import { createScene, executeScene } from '../controllers/sceneController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createScene);
router.post('/:id/execute', executeScene);

export default router;
