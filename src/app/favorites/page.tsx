'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
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
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: '#1E1E1E', letterSpacing: '-0.025em', mb: 0.5 }}
        >
          My Favorites
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', mb: 3.5 }}>
          Your saved dessert collection.
        </Typography>

        {recipes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>🍰</Typography>
            <Typography
              variant="body1"
              sx={{ color: '#6B6B6B', mb: 3, maxWidth: 360, mx: 'auto' }}
            >
              No favorites yet — tap the bookmark on any dessert to save it.
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              sx={{
                backgroundColor: '#E8A4C9',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 3,
                px: 3,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#D48DB0', boxShadow: 'none' },
              }}
            >
              Browse recipes
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
