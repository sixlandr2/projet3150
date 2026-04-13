import express from 'express';
import { createBatiment, createLogement, deleteBatiment, deleteLogement, getBatiments, getLogements } from '../controllers/batimentsController.js';

const router = express.Router();

router.get('/', getBatiments);
router.post('/', createBatiment);
router.delete('/:id', deleteBatiment);

router.get('/:id/logements', getLogements);
router.post('/:id/logements', createLogement);
router.delete('/logements/:id', deleteLogement);

export default router;