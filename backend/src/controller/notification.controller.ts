import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import notificationService from "../services/notification.service.ts";

class NotificationController {
    async fetchAllNotification(req: AuthRequest, res: Response) {
        try{
            const userId: string = req.user!.id
            const result = await notificationService.fetchAllNotification(userId)

            res.status(200).json({data: result})
        }
        catch(err: any){
            return res.json({error: err.message})
        }
    }

    async markNotificationAsRead(req: AuthRequest, res: Response){
        try{
            const userId: string = req.user!.id
            const result = await notificationService.markNotificationAsRead(userId)

            res.status(200).json({message: 'Successfully mark all notification as read'})
        }
        catch(err: any){
            return res.json({error: err.message})
        }
    }
}

export default new NotificationController()
