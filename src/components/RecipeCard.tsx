'use client';

import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Difficulty } from '@/models/Recipe';

type Props = {
  id: string;
  name: string;
  image: string;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  /** Seed value for the heart. The /favorites page passes true; the catalog
   *  omits it and relies on the AuthContext favoritedIds Set instead. */
  initialFavorited?: boolean;
  /** Called after a successful toggle so parents (e.g. /favorites) can update
   *  their own list without a re-fetch. */
  onToggle?: (id: string, nowFavorited: boolean) => void;
};

const difficultyChip: Record<Difficulty, { bg: string; color: string }> = {
  Easy:   { bg: '#D4EDDA', color: '#2D6A4F' },
  Medium: { bg: '#FFF3CD', color: '#856404' },
  Hard:   { bg: '#FFDDE1', color: '#842029' },
};

export default function RecipeCard({
  id,
  name,
  image,
  prepTimeMinutes,
  difficulty,
  initialFavorited = false,
  onToggle,
}: Props) {
  const router = useRouter();
  const { user, favoritedIds, addFavoriteId, removeFavoriteId } = useAuth();
  const chip = difficultyChip[difficulty];

  // Seed from the context Set (populated after auth) or the prop.
  // Catalog cards rely on the Set; /favorites cards pass initialFavorited={true}.
  const [favorited, setFavorited] = useState(() => favoritedIds.has(id) || initialFavorited);

  // Sync when the context Set updates (e.g. after the async favorites load on mount).
  useEffect(() => {
    setFavorited(favoritedIds.has(id) || initialFavorited);
  }, [favoritedIds, id, initialFavorited]);

  // Incrementing this key remounts the icon wrapper, which restarts the CSS
  // animation — ensures the pop plays on every click even in quick succession.
  const [animKey, setAnimKey] = useState(0);

  async function handleHeart(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      // Favorites require authentication — redirect rather than silently failing.
      router.push('/login');
      return;
    }

    setAnimKey((k) => k + 1); // restart the pop animation

    // Optimistic UI: flip the icon immediately so the tap feels instant.
    // On API failure we revert to the previous state.
    const next = !favorited;
    setFavorited(next);

    try {
      const res = await fetch('/api/favorites', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipeId: id }),
      });
      if (!res.ok) throw new Error('Request failed');

      // Keep the context Set in sync so other RecipeCards on the page
      // reflect the change without a full reload.
      if (next) addFavoriteId(id);
      else removeFavoriteId(id);

      onToggle?.(id, next);
    } catch {
      setFavorited(!next); // revert optimistic update
    }
  }

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 28px rgba(232, 164, 201, 0.18)',
        },
      }}
    >
      {/* Entire card is a link; the heart button breaks out via stopPropagation */}
      <Link
        href={`/recipes/${id}`}
        style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
      >
        <Box sx={{ position: 'relative', paddingTop: '62%', flexShrink: 0 }}>
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: '12px !important', pt: 1.5 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, lineHeight: 1.35, mb: 1, fontSize: '0.9375rem' }}
          >
            {name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={difficulty}
              size="small"
              
              sx={{
                backgroundColor: chip.bg,
                color: chip.color,
                fontWeight: 600,
                fontSize: '0.72rem',
                height: '20px',
                borderRadius: '999px',
                px: 0.25,
                 

              }}
            />
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontSize: '0.8rem' }}>
              {prepTimeMinutes} min
            </Typography>
          </Box>
        </CardContent>
      </Link>

      {/* Heart button — iOS-style floating pill */}
      <IconButton
        size="small"
        onClick={handleHeart}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 34,
          height: 34,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(1px)',
          borderRadius: '50%',
          boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.98)' },
          marginRight: 1,
          
        }}
      >
        {/* key change forces DOM remount → CSS animation restarts on every click */}
        <span
          key={animKey}
          style={{
            display: 'inline-flex',
            animation: animKey > 0 ? 'heart-pop 0.22s ease' : 'none',
          }}
        >
          {favorited ? (
            <FavoriteIcon sx={{ fontSize: 13, color: '#E8A4C9' }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 13, color: '#9E9E9E' }} />
          )}
        </span>
      </IconButton>
    </Card>
  );
}
