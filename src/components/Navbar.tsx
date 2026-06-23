'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
        color: '#1E1E1E',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 56, sm: 60 },
        }}
      >
        {/* Brand — cake icon + name */}
        <Box
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            textDecoration: 'none',
            color: '#1E1E1E',
          }}
        >
          <CakeOutlinedIcon sx={{ fontSize: 22, color: '#E8A4C9', flexShrink: 0 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}
          >
           Riwi's Bakery
          </Typography>
        </Box>

        {/* Render nothing auth-related while hydrating to avoid flicker */}
        {!loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  href="/favorites"
                  sx={{ color: '#6B6B6B', fontWeight: 500, borderRadius: 3 }}
                >
                  Favorites
                </Button>
                <Typography
                  variant="body2"
                  sx={{ color: '#6B6B6B', px: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  Hi, {user.name.split(' ')[0]}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  sx={{
                    color: '#E8A4C9',
                    borderColor: '#E8A4C9',
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 2.5,
                    '&:hover': {
                      borderColor: '#D48DB0',
                      color: '#D48DB0',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/favorites"
                  sx={{ color: '#6B6B6B', fontWeight: 500, borderRadius: 3 }}
                >
                  Favorites
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  sx={{ color: '#6B6B6B', fontWeight: 500, borderRadius: 3 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  sx={{
                    backgroundColor: '#E8A4C9',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 2.5,
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#D48DB0', boxShadow: 'none' },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
