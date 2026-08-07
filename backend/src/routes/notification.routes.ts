import { Router } from "express";
import notificationController from "../controller/notification.controller.ts";
import { authorizeRoles } from "../middleware/authRole.middleware.ts";
import { UserRole } from "../entities/users.ts";

export const router = Router()

router.get('/notifications', authorizeRoles(UserRole.ADMIN), notificationController.fetchAllNotification)

router.put('/notifications/mark-all-read', authorizeRoles(UserRole.ADMIN), notificationController.markNotificationAsRead)

router.put('/notifications/read/:id', authorizeRoles(UserRole.ADMIN), notificationController.markSingleAsRead)
