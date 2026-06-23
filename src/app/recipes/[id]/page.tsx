import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeById } from '@/services/recipe.service';
import type { Difficulty } from '@/models/Recipe';

// In Next.js 15+, route params are async — must be awaited before use
type Props = { params: Promise<{ id: string }> };

const difficultyColors: Record<Difficulty, { bg: string; color: string }> = {
  Easy:   { bg: '#D4EDDA', color: '#2D6A4F' },
  Medium: { bg: '#FFF3CD', color: '#856404' },
  Hard:   { bg: '#FFDDE1', color: '#842029' },
};

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) notFound();

  const chip = difficultyColors[recipe.difficulty];

  return (
    <main style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '1.75rem 1.5rem 0' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#6B6B6B',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            textDecoration: 'none',
          }}
        >
          ← Back to recipes
        </Link>

        {/* Hero image */}
        <div
          style={{
            position: 'relative',
            paddingTop: '56%',
            borderRadius: '18px',
            overflow: 'hidden',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
          }}
        >
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 780px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            color: '#1E1E1E',
            letterSpacing: '-0.025em',
            marginBottom: '0.85rem',
            lineHeight: 1.2,
          }}
        >
          {recipe.name}
        </h1>

        {/* Metadata row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              backgroundColor: chip.bg,
              color: chip.color,
              padding: '3px 11px',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            {recipe.difficulty}
          </span>
          <span style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>
            ⏱&nbsp;{recipe.prepTimeMinutes} min
          </span>
          <span style={{ color: '#6B6B6B', fontSize: '0.875rem' }}>
            🍽&nbsp;{recipe.servings} servings
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            color: '#3D3D3D',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
          }}
        >
          {recipe.description}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)', marginBottom: '2rem' }} />

        {/* Ingredients */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#1E1E1E',
              letterSpacing: '-0.015em',
              marginBottom: '1rem',
            }}
          >
            Ingredients
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '0.55rem 2rem',
            }}
          >
            {recipe.ingredients.map((ingredient, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  color: '#3D3D3D',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#E8A4C9', fontWeight: 700, lineHeight: '1.5', flexShrink: 0 }}>•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section>
          <h2
            style={{
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#1E1E1E',
              letterSpacing: '-0.015em',
              marginBottom: '1.25rem',
            }}
          >
            Steps
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1.1rem',
                  alignItems: 'flex-start',
                }}
              >
                {/* Numbered circle */}
                <span
                  style={{
                    flexShrink: 0,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#E8A4C9',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginTop: '2px',
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    margin: 0,
                    color: '#3D3D3D',
                    fontSize: '0.9375rem',
                    lineHeight: 1.65,
                  }}
                >
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

      </div>
    </main>
  );
}
