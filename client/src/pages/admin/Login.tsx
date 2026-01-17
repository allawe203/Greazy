import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('greazy_admin_session', JSON.stringify({ 
          authenticated: true, 
          token: data.token,
          expiry: data.expiry 
        }));
        setLocation('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#f36e27] mb-2">GREAZY</h1>
          <p className="text-[#f5e6c7]/80">Admin Panel</p>
        </div>

        <div className="bg-[#2e2e2e] rounded-lg border border-[#3e3e3e] p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-[#f36e27]/10">
              <Lock className="w-8 h-8 text-[#f36e27]" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-[#f5e6c7] text-center mb-6">Enter Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                data-testid="admin-password-input"
                className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7] placeholder:text-[#606161] focus:border-[#f36e27] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="toggle-password-visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606161] hover:text-[#f5e6c7] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              data-testid="admin-login-button"
              className="w-full py-6 text-lg font-bold bg-[#f36e27] hover:bg-[#e05d1a]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
