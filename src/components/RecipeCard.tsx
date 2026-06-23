'use client';

import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
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
  /** Seed value for the bookmark. The /favorites page passes true; the catalog
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

  // Initialise from the context Set (populated after auth) or the prop.
  // Catalog cards rely on the Set; /favorites cards pass initialFavorited={true}.
  const [favorited, setFavorited] = useState(() => favoritedIds.has(id) || initialFavorited);

  // Sync whenever the context Set updates (e.g. after the async favorites load
  // on mount — the Set starts empty and fills in once /api/favorites responds).
  useEffect(() => {
    setFavorited(favoritedIds.has(id) || initialFavorited);
  }, [favoritedIds, id, initialFavorited]);

  async function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      // Favorites require authentication — send the guest to login.
      router.push('/login');
      return;
    }

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

      // Keep the context Set in sync so every other RecipeCard on the page
      // (e.g. catalog) reflects the change without a full reload.
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
          boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Entire card is a link; the bookmark button breaks out via stopPropagation */}
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
                height: 20,
                borderRadius: '5px',
              }}
            />
            <Typography variant="caption" sx={{ color: '#6B6B6B', fontSize: '0.8rem' }}>
              {prepTimeMinutes} min
            </Typography>
          </Box>
        </CardContent>
      </Link>

      <IconButton
        size="small"
        onClick={handleBookmark}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 32,
          height: 32,
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(6px)',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.96)' },
        }}
      >
        {favorited ? (
          <BookmarkIcon sx={{ fontSize: 17, color: '#E8A4C9' }} />
        ) : (
          <BookmarkBorderIcon sx={{ fontSize: 17, color: '#1E1E1E' }} />
        )}
      </IconButton>
    </Card>
  );
}
