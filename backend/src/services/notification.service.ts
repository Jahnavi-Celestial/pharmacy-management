import notificationRepository from "../repository/notification.repository.ts"

class NotificationService{
    async fetchAllNotification(userId: string){
        return await notificationRepository.findAllNotification(userId)
    }

    async markNotificationAsRead(userId: string){
        return await notificationRepository.update(userId)
    }
}

export default new NotificationService()