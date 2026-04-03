import { pool } from '../db.js';

export const getAnnonces = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM annonces ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createAnnonce = async (req, res) => {
    const { titre, contenu, date_publication, date_expiration, batiment_id, created_by, confirmation_reception, adresse } =req.body;
    try {
        const result = await pool.query(
            `INSERT INTO annonces
                (titre, contenu, date_publication, date_expiration, batiment_id, created_by, confirmation_reception, adresse)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING*`,
            [titre, contenu, date_publication, date_expiration, batiment_id, created_by, confirmation_reception, adresse]
        );
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteAnnonce = async (req, res) => {
    const {id} = req.params;
    try {
        await pool.query('DELETE FROM annonces WHERE id = $1', [id]);
        res.json({ message: 'Annonce supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateAnnonce = async (req, res) => {
    const {id} = req.params;
    const {titre, contenu, date_publication, date_expiration, confirmation_reception, adresse} = req.body;
    try {
        const result = await pool.query(
            `UPDATE annonces SET titre=$1, contenu=$2, date_publication=$3, date_expiration=$4, confirmation_reception=$5, adresse=$6 WHERE id=$7 RETURNING *`,
            [titre, contenu, date_publication, date_expiration, confirmation_reception, adresse, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};