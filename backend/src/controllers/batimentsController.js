import { pool } from "../db.js";

export const getBatiments = async(req, res)=> {
    const {proprietaire_id} = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM batiments WHERE proprietaire_id = $1 ORDER BY created_at DESC',
            [proprietaire_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const createBatiment = async (req, res) => {
    const {adresse, ville, province, code_postal, numero_taxe_municipale, proprietaire_id} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO batiments (adresse, ville, province, code_postal, numero_taxe_municipale, proprietaire_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [adresse, ville, province, code_postal, numero_taxe_municipale, proprietaire_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteBatiment = async (req, res) => {
    const {id} = req.params;
    try {
        await pool.query(
            'DELETE FROM batiments WHERE id = $1',
            [id]
        );
        res.json({message: 'Batiment supprimé'});
    } catch (err) {
        res.status(500).json({error:err.message});
    }
};