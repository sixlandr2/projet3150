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

export const getLogements = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            `SELECT
                logements.id,
                logements.numero_unite,
                logements.etage,
                users.id AS locataire_id,
                users.first_name,
                users.last_name,
                users.email
            FROM logements
            LEFT JOIN locataires_logements
                ON locataires_logements.logement_id = logements.id
                AND locataires_logements.date_fin is NULL
            LEFT JOIN users
                ON users.id = locataires_logements.locataire_id
            WHERE logements.batiment_id = $1
            ORDER BY logements.numero_unite ASC`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const createLogement = async (req, res) => {
    const {id} = req.params;
    const {numero_unite, etage} = req.body;
    try {
        if (numero_unite?.trim()) {
            const existe = await pool.query(
                'SELECT id FROM logements WHERE batiment_id = $1 AND numero_unite = $2',
                [id, numero_unite.trim()]
            );
            if (existe.rows.length>0) {
                return res.status(400).json({error: "Ce numéro d'unité existe déjà dans ce bâtiment"});
            }
        }
        const result = await pool.query(
            'INSERT INTO logements (batiment_id, numero_unite, etage) VALUES ($1, $2, $3) RETURNING *',
            [id, numero_unite?.trim() || null, etage || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteLogement = async (req, res) => {
    const {id} = req.params;
    try {
        const locataireActif = await pool.query(
            'SELECT id FROM locataires_logements WHERE logement_id = $1 AND date_fin IS NULL',
            [id]
        );
        if (locataireActif.rows.length>0) {
            return res.status(400).json({error: "Impossible supprimer un logement avec un locataire actif"});
        }
        await pool.query('DELETE FROM logements WHERE id = $1', [id]);
        res.json({message: 'Logement supprimé'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};