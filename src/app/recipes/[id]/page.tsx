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

const HEADING_FONT = 'var(--font-quicksand), system-ui, sans-serif';
const BODY_FONT    = 'var(--font-nunito), system-ui, sans-serif';

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) notFound();

  const chip = difficultyColors[recipe.difficulty];

  return (
    <main style={{ backgroundColor: 'rgb(250, 247, 250)', minHeight: '100vh', paddingBottom: '4rem', fontFamily: BODY_FONT }}>
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
            fontFamily: BODY_FONT,
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
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 24px rgba(232, 164, 201, 0.15)',
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

        {/* Tinted title + metadata block — lighter echo of the catalog header band */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF0F7 0%, #FDF5FA 100%)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem 1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          <h1
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 5vw, 1.875rem)',
              color: '#1E1E1E',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
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
            }}
          >
            <span
              style={{
                backgroundColor: chip.bg,
                color: chip.color,
                padding: '3px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontFamily: BODY_FONT,
                fontWeight: 600,
                letterSpacing: '0.01em',
              }}
            >
              {recipe.difficulty}
            </span>
            <span style={{ color: '#6B6B6B', fontSize: '0.875rem', fontFamily: BODY_FONT }}>
              ⏱&nbsp;{recipe.prepTimeMinutes} min
            </span>
            <span style={{ color: '#6B6B6B', fontSize: '0.875rem', fontFamily: BODY_FONT }}>
              🍽&nbsp;{recipe.servings} porciones
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: BODY_FONT,
            color: '#3D3D3D',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
          }}
        >
          {recipe.description}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(232, 164, 201, 0.25)', marginBottom: '2rem' }} />

        {/* Ingredients */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#1E1E1E',
              letterSpacing: '-0.01em',
              marginBottom: '1rem',
            }}
          >
            Ingredientes
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
                  fontFamily: BODY_FONT,
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
              fontFamily: HEADING_FONT,
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#1E1E1E',
              letterSpacing: '-0.01em',
              marginBottom: '1.25rem',
            }}
          >
            Preparación
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
                    background: 'linear-gradient(135deg, #E8A4C9, #D48DB0)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontFamily: HEADING_FONT,
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
                    fontFamily: BODY_FONT,
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
