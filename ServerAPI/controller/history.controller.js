const db = require('../db'); 

//Добавить qr в историю
const addScanHistory = async (req, res) => {
    try {
        const { user_id, qr_code_id, qr_content } = req.body;

        if (!user_id || !qr_content) {
            return res.status(400).json({ message: 'user_id и qr_content обязательны' });
        }

        const result = await db.query(
            `
      INSERT INTO qr_scan_history (user_id, qr_code_id, qr_content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
            [user_id, qr_code_id || null, qr_content]
        );

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка addScanHistory:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
};

//Вывести историю qr
const getMyScanHistory = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: 'user_id обязателен' });
        }

        const result = await db.query(
            `
      SELECT 
        h.id,
        h.qr_code_id,
        h.qr_content,
        h.scanned_at
      FROM qr_scan_history h
      WHERE h.user_id = $1
      ORDER BY h.scanned_at DESC
      `,
            [user_id]
        );

        return res.json(result.rows);
    } catch (error) {
        console.error('Ошибка getMyScanHistory:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
};

//Удалить запись из истории
const deleteHistoryRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
      DELETE FROM qr_scan_history
      WHERE id = $1
      RETURNING *
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Запись не найдена' });
        }

        return res.json({ message: 'Запись удалена' });
    } catch (error) {
        console.error('Ошибка deleteHistoryRecord:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    addScanHistory,
    getMyScanHistory,
    deleteHistoryRecord
};
