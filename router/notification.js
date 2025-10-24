const express = require('express')
const router = express.Router()
const {notification, getAllNotifications, readNotification, deleteNotification} = require('../controller/notification');

const { sendNotification } = require('../app')
const Notification = require('../model/notification')


router.post('/send', async (req, res) => {
    const { userId, message } = req.body;

    try {
        await sendNotification(userId, message);
        res.status(200).json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send notification', error });
    }
})

router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
    }
})

router.put('/notifications-read/:userId', async (req, res) => {
    const { userId } = req.params; // Extract userId from the request parameters

    try {
        // Update all unread notifications (isRead: false) to isRead: true
        const result = await Notification.updateMany(
            { userId, isRead: false }, // Condition: Only unread notifications for this user
            { isRead: true }          // Update: Set isRead to true
        );

        // Return success response with the count of updated notifications
        res.status(200).json({
            success: true,
            message: 'Notifications marked as read successfully',
            updatedCount: result.modifiedCount, // Number of updated documents
        });
    } catch (error) {
        console.error(error);
        // Handle errors and return an error response
        res.status(500).json({
            success: false,
            message: 'Failed to mark notifications as read',
            error,
        });
    }
})

router.get('/notifications-unread/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const unreadNotifications = await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            notifications: unreadNotifications 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch unread notifications', 
            error 
        });
    }
})

module.exports = router