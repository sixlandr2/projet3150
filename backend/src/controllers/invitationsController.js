import crypto from 'crypto';
import { pool } from "../db.js";

const genererCode = ()=> crypto.randomBytes(4).toString('hex').toUpperCase();

export const creerInvitation = async (req, res)=> {
    const {email, batiment_id, proprietaire_id} = req.body;
    try {
        const code = genererCode();
        const result = await pool.query(
            'INSERT INTO invitations (code, email, batiment_id, proprietaire_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [code, email, batiment_id, proprietaire_id]
        );
        res.json({code: result.rows[0].code});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const accepterInvitation = async (req, res)=> {
    const {code, user_id} = req.body;
    try {
        const inv = await pool.query(
            'SELECT * FROM invitations WHERE code = $1 AND statut = $2 AND expires_at > NOW()',
            [code, 'en_attente']
        );
        if(inv.rows.length === 0) return res.status(400).json({error: 'Code invalide ou expiré'});

        await pool.query('UPDATE invitations SET statut = $1 WHERE code = $2', ['acceptee', code]);
        res.json({message: 'Invitation acceptée', batiment_id: inv.rows[0].batiment_id});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};