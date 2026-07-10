import { useEffect, useState } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { AccountCircle, HomeOutlined, LibraryBooksOutlined, MenuBook, NewspaperOutlined, PersonOutlined } from '@mui/icons-material'
import './App.css'

const navItems = [
  { label: 'Home', icon: <HomeOutlined /> },
  { label: 'Read', icon: <LibraryBooksOutlined /> },
  { label: 'News', icon: <NewspaperOutlined /> },
  { label: 'Profile', icon: <PersonOutlined /> },
]

const formatBottomLabel = (label: string) => label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()

function App() {
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
    <Box sx={{ flexGrow: 1, pb: isMobile ? 10 : 0, minHeight: '100vh', bgcolor: '#f3f4f6' }}>
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid #e5e7eb', top: 0, left: 0, right: 0, zIndex: 1200 }}>
        <Toolbar sx={isMobile ? { justifyContent: 'space-between', px: 1 } : { justifyContent: 'flex-start', px: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MenuBook />
            <Typography variant="h6" component="div">
              Page Turn
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton color="inherit" aria-label="account">
              <AccountCircle />
            </IconButton>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, ml: 3 }}>
                {navItems.map((item) => (
                  <Typography key={item.label} variant="body1">
                    {item.label}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <IconButton color="inherit" aria-label="account">
                  <AccountCircle />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'white', color: 'text.primary', zIndex: 1100, borderTop: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                sx={{ 
                  minWidth: 'auto', px: 1, 
                  display: 'flex', flexDirection: 'column', gap: 0.25,
                  color: item.label === "Home" ? '#e65100' : "#9e9e9e"
                }}
              >
                {item.icon}
                <Typography variant="caption">{formatBottomLabel(item.label)}</Typography>
              </Button>
            ))}
          </Box>
        </Box>
      ) : null}

      <Box sx={{ p: 3, pt: isMobile ? 10 : 3 }}>
        <Typography variant="h4">Welcome</Typography>
        <Typography variant="body1">
          {isMobile ? 'Mobile layout enabled' : 'Desktop layout enabled'}
        </Typography>
      </Box>
    </Box>
  )
}

export default App
