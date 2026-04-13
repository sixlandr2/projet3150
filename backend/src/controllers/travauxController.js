import { pool } from "../db.js";

export const getTravaux = async (req, res) => {
    const { proprietaire_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT
                travaux.id,
                travaux.titre,
                travaux.entrepreneur,
                travaux.description,
                travaux.batiment_id,
                travaux.logement_id,
                travaux.date_debut,
                travaux.date_fin,
                travaux.created_by,
                travaux.created_at,
                batiments.adresse
            FROM travaux
            JOIN batiments ON batiments.id = travaux.batiment_id
            WHERE batiments.proprietaire_id = $1
            ORDER BY travaux.date_debut ASC`,
            [proprietaire_id]
        );
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export const createTravail = async (req, res) => {
    const {titre, entrepreneur, description, batiment_id, logement_id, date_debut, date_fin, created_by} = req.body;
    if (!titre?.trim()) {
        return res.status(400).json({error:'Titre requis'});
    }
    if (!batiment_id) {
        return res.status(400).json({error: "L'adresse est requise"});
    }
    if (!date_debut) {
        return res.status(400).json({error: 'La date de début est requise'});
    }
    try {
        const result = await pool.query(
            `INSERT INTO travaux
                (titre, entrepreneur, description, batiment_id, logement_id, date_debut, date_fin, created_by)
            VALUES ($1, $2, $3, $4, $5, $6::timestamp, $7::timestamp, $8)
            RETURNING *`,
            [titre.trim(), entrepreneur?.trim() || null, description?.trim() || null, batiment_id, logement_id || null, date_debut, date_fin || null, created_by]
        );
        res.json(result.rows[0]);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

export const updateTravai = async (req, res)=>{
    const {id} = req.params;
    const {titre, entrepreneur, description, batiment_id, logement_id, date_debut, date_fin} = req.body;
    if(!titre?.trim()) {
        return res.status(400).json({error: 'Titre requis'});
    }
    try{
        const result = await pool.query(
            `UPDATE travaux SET
                titre = $1,
                entrepreneur = $2,
                description = $3,
                batiment_id = $4,
                logement_id = $5,
                date_debut = $6::timestamp,
                date_fin = $7::timestamp
            WHERE id = $8
            RETURNING *`,
            [titre.trim(), entrepreneur?.trim() || null, description?.trim() || null, batiment_id, logement_id || null, date_debut, date_fin || null, id]
        );
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteTravail = async (req, res) => {
    const {id} = req.params;
    try {
        await pool.query('DELETE FROM travaux WHERE id = $1', [id]);
        res.json({message: 'Travail supprimé'});
    } catch(err) {
        res.json({error: err.message});
    }
};