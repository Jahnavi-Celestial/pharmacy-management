import { Router } from "express";
import notificationController from "../controller/notification.controller.ts";

export const router = Router()

router.get('/notifications', notificationController.fetchAllNotification)

router.put('/notifications/mark-all-read', notificationController.markNotificationAsRead)