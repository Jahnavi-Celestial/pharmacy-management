import AppDataSource from "../config/db.ts"
import { Notification } from "../entities/notification.ts"

const notificationRepo = AppDataSource.getRepository(Notification)

class NotificationRepository{
    async findAllNotification(userId: string){
        return notificationRepo.find({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: { user: true },
            order: { createdAt: "DESC" },
        })
    }

    async update(userId: string){
        return notificationRepo.update(
            { user: {id: userId}, isRead: false }, 
            { isRead: true }
        )
    }
}

export default new NotificationRepository()