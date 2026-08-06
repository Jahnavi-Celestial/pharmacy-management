import cron from 'node-cron';
import AppDataSource from '../config/db.ts';
import { BatchStatus, MedicineBatch } from '../entities/medicineBatch.ts';
import { LessThan } from 'typeorm';
import { io } from '../index.ts';
import { Notification } from '../entities/notification.ts';

function expiryDateCron(){
    async function checkExpiryTask(){
        try{
            const medicineBatchRepo = AppDataSource.getRepository(MedicineBatch)
            const notificationRepo = AppDataSource.getRepository(Notification)

            const today = new Date()
            today.setHours(0,0,0,0)

            const targetDate = new Date(today)
            targetDate.setDate(today.getDate() + 30)

            const allReadyExpired = await medicineBatchRepo.find({
                where: {
                    expiryDate: LessThan(today),
                    status: BatchStatus.ACTIVE
                }
            })

            for(const expiredMedicine of allReadyExpired){
                expiredMedicine.status = BatchStatus.EXPIRED

                await medicineBatchRepo.save(expiredMedicine);
            }

            const goingToExpired = await medicineBatchRepo.find({
                where: {
                    expiryDate: targetDate
                },
                relations: {
                    users: true
                }
            })

            for(const batch of goingToExpired){
                if(!batch.users) continue;

                const notification = new Notification()
                notification.title = "Medicine Expiring Soon"
                notification.message = `Batch of ${batch.medicine.medicineName} is expiring in 30 days!`
                notification.user = batch.users
                notification.medicineId = batch.medicine.id
                
                const savedNotification = await notificationRepo.save(notification)

                const userId = batch.users.id
                io.to(userId).emit("new_notification", {
                    id: savedNotification.id,
                    title: savedNotification.title,
                    message: savedNotification.message,
                    medicineId: savedNotification.medicineId,
                    createdAt: savedNotification.createdAt,
                    isRead: savedNotification.isRead
                })
            }
        }
        catch(err: any){
            console.log('Error in running expiry date cron')
        }
    }

    cron.schedule('* * * * *', checkExpiryTask)
}

export default expiryDateCron