import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export const signup = async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body;
    try {
        const existe = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existe.rows.length > 0) return res.status(400).json({ error: 'Courriel déjà utilisé' });
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
            [email, hash, first_name, last_name, role]
        );
        const token = jwt.sign({ id:result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'Courriel introuvable'});
        const valid = await bcrypt.compare(password, result.rows[0].password);
        if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
        const token = jwt.sign({ id: result.rows[0].id, role: result.rows[0].role }, process.env.JWT_SECRET, {expiresIn: '7d' });
        res.json({token, user: { id: result.rows[0].id, email: result.rows[0].email, first_name: result.rows[0].first_name, last_name: result.rows[0].last_name, role: result.rows[0].role} });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};