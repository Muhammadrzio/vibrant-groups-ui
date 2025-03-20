
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) return;
    
    setIsLoggingIn(true);
    
    try {
      await login(username, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to your Shopping List">
      <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoggingIn || !username || !password}
        >
          {isLoggingIn ? 'Signing In...' : 'Sign In'}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-slate-500">
            No account yet?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Create One
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
