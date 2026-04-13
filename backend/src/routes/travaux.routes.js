import express from 'express';
import { createTravail, deleteTravail, getTravaux, updateTravai } from '../controllers/travauxController.js';

const router = express.Router();

router.get('/', getTravaux);
router.post('/', createTravail);
router.delete('/:id', deleteTravail);
router.put('/:id', updateTravai);

export default router;