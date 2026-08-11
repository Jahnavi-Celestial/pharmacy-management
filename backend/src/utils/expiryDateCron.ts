import cron from 'node-cron';
import AppDataSource from '../config/db.ts';
import { BatchStatus, MedicineBatch } from '../entities/medicineBatch.ts';
import { LessThan, LessThanOrEqual } from 'typeorm';
import { Notification } from '../entities/notification.ts';

function expiryDateCron(){
    async function checkExpiryTask(){
        try{
            const medicineBatchRepo = AppDataSource.getRepository(MedicineBatch);
            const notificationRepo = AppDataSource.getRepository(Notification);

            const today = new Date();
            today.setHours(0,0,0,0);

            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + 30);

            const todayISOString = today.toISOString().split('T')[0];
            const targetDateISOString = targetDate.toISOString().split('T')[0];

            const allReadyExpired = await medicineBatchRepo.find({
                where: {
                    expiryDate: LessThan(todayISOString as any),
                    status: BatchStatus.ACTIVE
                }
            });

            for(const expiredMedicine of allReadyExpired){
                expiredMedicine.status = BatchStatus.EXPIRED;

                await medicineBatchRepo.save(expiredMedicine);
            }

            const goingToExpired = await medicineBatchRepo.find({
                where: {
                    expiryDate: LessThanOrEqual(targetDateISOString as any),
                    status: BatchStatus.ACTIVE
                },
                relations: {
                    users: true, 
                    medicine: true
                }
            });

            for(const batch of goingToExpired){
                if(!batch.users) continue;

                const notification = new Notification();
                notification.title = "Medicine Expiring Soon";
                notification.message = `Batch of ${batch.medicine.medicineName} is expiring in 30 days!`;
                notification.user = batch.users;
                notification.medicineId = batch.medicine.id;
                notification.batchId = batch.id;
                
                await notificationRepo.save(notification);
            }
        }
        catch(err: any){
            console.log(`Error in running expiry date cron ${err.message}`);
        }
    }

    cron.schedule('0 0 * * *', checkExpiryTask);
}

export default expiryDateCron;