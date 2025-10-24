const express = require('express')
const router = express.Router()

router.post('/create', async (req, res) => {
    const { userId, type, data } = req.body;

    try {
        const newReport = new Report({ userId, type, data });
        await newReport.save();
        res.status(201).json({ success: true, message: 'Report created successfully', report: newReport });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create report' });
    }
})

router.get('/get', async (req, res) => {
    const { userId, type, startDate, endDate } = req.query;

    try {
        const filters = {};
        if (userId) filters.userId = userId;
        if (type) filters.type = type;
        if (startDate && endDate) {
            filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const reports = await Report.find(filters).sort({ createdAt: -1 });
        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
})

module.exports = router