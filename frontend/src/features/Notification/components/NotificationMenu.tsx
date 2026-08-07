import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton, Menu, Box, Typography, Button, Divider, List, ListItem, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { notificationApi } from "../api/notificationApi";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  medicineId: string;
  createdAt: string;
  isRead: boolean;
  batchId: string;
}

interface NotificationMenuProps {
  socketInstance: any; 
}

export const NotificationMenu= ({ socketInstance }: NotificationMenuProps) => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const open = Boolean(anchorEl)

  const fetchNotifications = async () => {
    try{
      const response = await notificationApi.getNotifications()
      setNotifications(response?.data?.data || response?.data || response || [])
    } 
    catch(err){
      console.error("Failed to load notifications:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()

    if(socketInstance){
      socketInstance.on("new_notification", (newNotif: NotificationItem) => {
        setNotifications((prev) => [newNotif, ...prev])
      })
    }

    return () => {
      if(socketInstance){
        socketInstance.off("new_notification")
      }
    }
  }, [socketInstance])

  const handleOpen = (e: any) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkAllRead = async () => {
    try{
      await notificationApi.markAllRead()
      setNotifications([])
      handleClose()
    } 
    catch(err){
      console.error("Error marking notifications read:", err)
    }
  }

  const handleNotificationClick = async (item: NotificationItem) => {
    try{
      await notificationApi.markOneRead(item.id)
    
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
      handleClose();
    
      navigate(`/inventory/${item.batchId}`);
    } 
    catch(err){
      console.error("Failed to mark notification read on server:", err)
      navigate(`/inventory/${item.batchId}`)
      handleClose()
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: "#555555" }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { width: 340, maxHeight: 450, borderRadius: 2, mt: 1.5, boxShadow: 3 },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={handleMarkAllRead} sx={{ textTransform: "none", fontWeight: 600 }}>
              Mark all as read
            </Button>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ py: 4, px: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No new alerts or expiring batches.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, overflowY: "auto", maxHeight: 350 }}>
            {notifications.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  component="li"
                  onClick={() => handleNotificationClick(item)}
                  sx={{
                    alignItems: "flex-start",
                    gap: 1,
                    backgroundColor: item.isRead ? "transparent" : "action.hover",
                    "&:hover": { backgroundColor: "action.selected" },
                    py: 1.5,
                  }}
                >
                  {!item.isRead && (
                    <CircleIcon color="primary" sx={{ fontSize: 10, mt: 0.8, flexShrink: 0 }} />
                  )}
                  <ListItemText
                    primary={item.title}
                    secondary={item.message}
                    primaryTypographyProps={{ variant: "subtitle2", fontWeight: item.isRead ? 500 : 700 }}
                    secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>
    </>
  )
}

export default NotificationMenu
