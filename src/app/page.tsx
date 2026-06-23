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
        <h1
          style={{
            fontWeight: 700,
            fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
            color: '#1E1E1E',
            letterSpacing: '-0.025em',
            marginBottom: '0.3rem',
          }}
        >
          Sweet Treats
        </h1>
        <p
          style={{
            color: '#6B6B6B',
            fontSize: '1rem',
            marginBottom: '2.25rem',
          }}
        >
          Handpicked dessert recipes to satisfy every craving.
        </p>

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
