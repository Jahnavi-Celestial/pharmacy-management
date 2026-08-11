import notificationRepository from "../repository/notification.repository.ts";

class NotificationService{
    async fetchAllNotification(userId: string){
        return await notificationRepository.findAllNotification(userId);
    }

    async markNotificationAsRead(userId: string, id?: any){
        return await notificationRepository.update(userId, id);
    }
}

export default new NotificationService();