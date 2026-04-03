import express from 'express';
import { createAnnonce, deleteAnnonce, getAnnonces, updateAnnonce } from '../controllers/annoncesController.js';

const router = express.Router();

router.get('/', getAnnonces);
router.post('/', createAnnonce);
router.delete('/:id', deleteAnnonce);
router.put('/:id', updateAnnonce);

export default router;