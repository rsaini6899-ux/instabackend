const Notification = require('../model/notification'); 
const { sendNotification } = require('../app');


module.exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ }).sort({ createdAt: -1 })
        res.status(200).json({ success: true, notifications });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error })
      }
}

module.exports.readNotification = async (req, res) => {
    try {
        const { notificationId } = req.params
        const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true })

        if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' });
        }
    
        res.status(200).json({ success: true, message: 'Notification updated successfully', notification })
      } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Failed to update notification', error })
      }
}

module.exports.deleteNotification = async (req, res) => {
    const {notificationId} = req.params
    try {
        const notification = await Notification.findByIdAndDelete(notificationId)
    
        if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' })
        }
    
        res.status(200).json({ success: true, message: 'Notification deleted successfully' })
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete notification', error })
      }
}
