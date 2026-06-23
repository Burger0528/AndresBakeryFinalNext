'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/context/AuthContext';

// Mirrors RecipeListItem from recipe.service — defined inline so this client
// component does not import a server-only module.
type FavoriteRecipe = {
  id: string;
  name: string;
  image: string;
  prepTimeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
};

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<FavoriteRecipe[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Wait for the auth state to resolve before deciding what to do.
    if (authLoading) return;

    // Client-side guard. The API is the real server-side gate; this redirect
    // avoids flashing the page content to unauthenticated users.
    if (!user) {
      router.replace('/login');
      return;
    }

    setFetching(true);
    fetch('/api/favorites', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setRecipes(data.recipes ?? []))
      .catch(() => setRecipes([]))
      .finally(() => setFetching(false));
  }, [user, authLoading, router]);

  function handleToggle(id: string, nowFavorited: boolean) {
    // Remove the card from the list immediately on un-favorite rather than
    // re-fetching — avoids a round-trip and feels instant to the user.
    if (!nowFavorited) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  }

  if (authLoading || fetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#E8A4C9' }} />
      </Box>
    );
  }

  return (
    <main style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>

        {/* Tinted header band — same treatment as the catalog */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FEF0F7 0%, #FDF5FA 100%)',
            borderRadius: 3,
            p: { xs: '1.25rem 1.25rem', sm: '1.75rem 2rem' },
            mb: 3.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
          }}
        >
          <CakeOutlinedIcon sx={{ fontSize: 28, color: '#E8A4C9', flexShrink: 0, mt: 0.25 }} />
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#1E1E1E', letterSpacing: '-0.02em', mb: 0.25 }}
            >
              Mis Favoritos
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
              Tu colección de postres guardada.
            </Typography>
          </Box>
        </Box>

        {recipes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: '#FEF0F7',
                mb: 2.5,
              }}
            >
              <FavoriteIcon sx={{ fontSize: 32, color: '#E8A4C9' }} />
            </Box>
            <Typography
              variant="body1"
              sx={{ color: '#6B6B6B', mb: 3, maxWidth: 380, mx: 'auto', lineHeight: 1.6 }}
            >
              Aún no tienes favoritos — toca el corazón para empezar tu colección dulce.
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              sx={{
                backgroundColor: '#E8A4C9',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 50,
                px: 3.5,
                py: 1,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#D48DB0', boxShadow: 'none' },
              }}
            >
              Ver recetas
            </Button>
          </Box>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                initialFavorited={true}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
