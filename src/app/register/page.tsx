'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister() {
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Create account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Join the dessert community
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              value={name}
              fullWidth
              onChange={(e) => setName(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />
            <Button
              variant="contained"
              fullWidth
              disabled={submitting}
              onClick={handleRegister}
              sx={{
                borderRadius: 3,
                py: 1.2,
                fontWeight: 600,
                backgroundColor: '#E8A4C9',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#D48DB0', boxShadow: 'none' },
              }}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ textAlign: 'center', mt: 2.5, color: 'text.secondary' }}
          >
            Already have an account?{' '}
            <Typography
              component={Link}
              href="/login"
              variant="body2"
              sx={{ color: '#E8A4C9', fontWeight: 600, textDecoration: 'none' }}
            >
              Sign in
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
