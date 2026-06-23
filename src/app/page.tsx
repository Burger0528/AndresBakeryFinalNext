import { getAllRecipes } from '@/services/recipe.service';
import RecipeCard from '@/components/RecipeCard';

export default async function CatalogPage() {
  const recipes = await getAllRecipes();

  return (
    <main style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 0',
        }}
      >
        {/* Tinted header band — soft pink block that anchors the page identity */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF0F7 0%, #FDF5FA 100%)',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            marginBottom: '2.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <span
            style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}
            aria-hidden="true"
          >
          </span>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-quicksand), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
                color: '#1E1E1E',
                letterSpacing: '-0.02em',
                marginBottom: '0.35rem',
                lineHeight: 1.15,
              }}
            >
              Sweet Desserts
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-nunito), system-ui, sans-serif',
                color: '#6B6B6B',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
              }}
            >
              Made whith love by Riwi's Bakery. 
            </p>
          </div>
        </div>

        {recipes.length === 0 ? (
          <p style={{ color: '#6B6B6B', fontSize: '1rem' }}>
            No recipes yet — run <code>npm run seed</code> to get started.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
