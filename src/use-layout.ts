import { useLocation, useNavigate } from 'react-router'

const navPaths: Record<string, string> = {
  Home: '/',
  Read: '/read',
  Intelligence: '/intelligence',
  Profile: '/profile',
}

export const useLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleNavItemClick = (label: string) => {
    const path = navPaths[label]
    if (path) {
      navigate(path)
    }
  }

  const isNavItemActive = (label: string) => pathname === navPaths[label]

  return { handleNavItemClick, isNavItemActive }
}
