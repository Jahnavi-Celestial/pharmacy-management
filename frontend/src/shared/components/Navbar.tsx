import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import NotificationMenu from '../../features/Notification/components/NotificationMenu';

interface NavbarProps {
  socket: any; 
}

export default function Navbar({ socket }: NavbarProps){
  const pages = ['home', 'inventory']
  const {logoutUser, userRole} = useAuth()
  const navigate = useNavigate()
  
  const [activePage, setActivePage] = useState<string>('Home')
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handlePageClick = (pageName: string) => {
    setActivePage(pageName)
    setMobileOpen(false)
    navigate(`/${pageName}`)
  }

  const handleLogout = () => {
    logoutUser()
  }

  return (
    <AppBar position='absolute' sx={{ bgcolor: '#ffffff', color: '#333333', m: 0, p: 0, boxShadow: 1, zIndex: 1201 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospitalIcon sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            PharmaSys
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
          {pages.map((page) => (
            <Typography key={page} onClick={() => handlePageClick(page)}
              sx={{
                cursor: 'pointer',
                fontWeight: '500',
                color: activePage === page ? '#1976d2' : '#555555',
                '&:hover': { color: '#1976d2' },
              }}
            >
              {page}
            </Typography>
          ))}

          {userRole === "ADMIN" && <NotificationMenu socketInstance={socket} />}
          
          <Button variant="outlined" color="primary" size="small" sx={{ textTransform: 'none' }} onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={handleDrawerToggle} color="inherit">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

      </Toolbar>

      <Drawer
        anchor="top"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} 
      >
        <Box sx={{ p: 2, bgcolor: '#ffffff' }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', my: 2 }}>
            {pages.map((page) => (
              <Typography
                component="div"
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  fontWeight: '500',
                  color: activePage === page ? '#1976d2' : '#555555',
                  textAlign: 'center'
                }}
              >
                {page}
                <Divider sx={{width: "100vw"}}/>
              </Typography>
            ))}

            <Button variant="contained" fullWidth sx={{ mt: 2, textTransform: 'none', bgcolor: "#1976d2" }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>

        </Box>
      </Drawer>
    </AppBar>
  )
}
