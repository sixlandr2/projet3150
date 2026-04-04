import express from 'express';
import { createBatiment, deleteBatiment, getBatiments } from '../controllers/batimentsController.js';

const router = express.Router();

router.get('/', getBatiments);
router.post('/', createBatiment);
router.delete('/:id', deleteBatiment);
export default router;