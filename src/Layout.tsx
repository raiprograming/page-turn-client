import { useEffect, useState } from 'react'
import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { AccountCircle, HomeOutlined, LibraryBooksOutlined, NewspaperOutlined, PersonOutlined } from '@mui/icons-material'
import './App.css'
import { Outlet, useNavigate } from 'react-router'
import PageturnIcon from './assets/pageturn-text-icon.svg';
import { useAppSelector } from './store/hooks'
import { useLayout } from './use-layout'

const navItems = [
  { label: 'Home', icon: <HomeOutlined /> },
  { label: 'Read', icon: <LibraryBooksOutlined /> },
  { label: 'Intelligence', icon: <NewspaperOutlined /> },
  { label: 'Profile', icon: <PersonOutlined /> },
]

const formatBottomLabel = (label: string) => label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()

function Layout() {
  const navigate = useNavigate()
  const userInfo = useAppSelector((state) => state.user.userInfo)
  const { handleNavItemClick, isNavItemActive } = useLayout()
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth < 768
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        bgcolor: '#f3f4f6',
        color: 'text.primary',
        position: 'relative',
      }}
    >
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid #e5e7eb',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
      >
        <Toolbar sx={isMobile ? { justifyContent: 'space-between', px: 1 } : { justifyContent: 'flex-start', px: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={PageturnIcon} alt="Page Turn Icon" style={{ width: '170px', height: '50px' }} />
          </Box>

          {isMobile ? (
            <IconButton color="inherit" aria-label="account" onClick={() => navigate('/profile')}>
              {userInfo?.picture ? <Avatar src={userInfo.picture} sx={{ width: 28, height: 28 }} /> : <AccountCircle />}
            </IconButton>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, ml: 3 }}>
                {navItems.map((item) => (
                  <Typography
                    key={item.label}
                    variant="body1"
                    onClick={() => handleNavItemClick(item.label)}
                    sx={{
                      cursor: 'pointer',
                      color: isNavItemActive(item.label) ? 'var(--primary-color)' : 'inherit',
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <IconButton color="inherit" aria-label="account" onClick={() => navigate('/profile')}>
                  {userInfo?.picture ? <Avatar src={userInfo.picture} sx={{ width: 32, height: 32 }} /> : <AccountCircle />}
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          pt: { xs: 10, md: 12 },
          pb: { xs: isMobile ? 12 : 4, md: 4 },
          px: { xs: 2, md: 3 },
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          bgcolor: '#f3f4f6',
          color: 'text.primary',
          textAlign: 'left',
        }}
      >
        <Outlet />
      </Box>

      {isMobile ? (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'white', color: 'text.primary', zIndex: 1100, borderTop: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => handleNavItemClick(item.label)}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                  color: isNavItemActive(item.label) ? 'var(--primary-color)' : '#9e9e9e',
                }}
              >
                {item.icon}
                <Typography variant="caption">{formatBottomLabel(item.label)}</Typography>
              </Button>
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default Layout;

