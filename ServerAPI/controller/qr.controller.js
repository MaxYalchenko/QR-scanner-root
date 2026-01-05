const pool = require('../db');

//Создать qr код
const createQrCode = async (req, res) => {
  try {
    const { qr_content, user_id } = req.body;

    if (!qr_content || !user_id) {
      return res.status(400).json({
        message: 'qr_content and user_id are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO qrcodes (qr_content, user_id)
       VALUES ($1, $2)
       RETURNING id, qr_content`,
      [qr_content, user_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('createQrCode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Получить qr код
const getMyQrCodes = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const result = await pool.query(
      `SELECT id, qr_content
       FROM qrcodes
       WHERE user_id = $1
       ORDER BY id DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('getMyQrCodes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Изменить qr код
const updateMyQrCodes = async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceType, serialNumber, status, deliveryDate } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'QR code id is required' });
    }

    const selectResult = await pool.query(
      `SELECT qr_content
       FROM qrcodes
       WHERE id = $1`,
      [id]
    );

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    let qrData;
    try {
      qrData = JSON.parse(selectResult.rows[0].qr_content);
    } catch (err) {
      qrData = {};
    }

    if (deviceType !== undefined) qrData.deviceType = deviceType;
    if (serialNumber !== undefined) qrData.serialNumber = serialNumber;
    if (status !== undefined) qrData.status = status;
    if (deliveryDate !== undefined) qrData.deliveryDate = deliveryDate;

    const updateResult = await pool.query(
      `UPDATE qrcodes
       SET qr_content = $1
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(qrData), id]
    );

    console.log('Updated QR:', updateResult.rows[0]);
    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('updateMyQrCodes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Удалить qr код
const deleteQrCode = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'QR code id is required' });
    }

    // Удаляем запись по id
    const result = await pool.query(
      `DELETE FROM qrcodes
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.json({ message: 'QR-код удалён', deleted: result.rows[0] });
  } catch (error) {
    console.error('deleteQrCode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createQrCode,
  getMyQrCodes,
  updateMyQrCodes,
  deleteQrCode
};
