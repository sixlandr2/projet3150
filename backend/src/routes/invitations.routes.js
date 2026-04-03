import express from 'express';
import { accepterInvitation, creerInvitation } from '../controllers/invitationsController.js';

const router = express.Router();
router.post('/creer', creerInvitation);
router.post('/accepter', accepterInvitation);
export default router;