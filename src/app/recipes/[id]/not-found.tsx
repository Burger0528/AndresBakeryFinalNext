import Link from 'next/link';

export default function RecipeNotFound() {
  return (
    <main
      style={{
        backgroundColor: '#FAF9F7',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍰</p>
        <h1
          style={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#1E1E1E',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}
        >
          Recipe not found
        </h1>
        <p style={{ color: '#6B6B6B', fontSize: '0.9375rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          This recipe doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#E8A4C9',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0.6rem 1.5rem',
            borderRadius: '10px',
            textDecoration: 'none',
          }}
        >
          ← Back to catalog
        </Link>
      </div>
    </main>
  );
}
