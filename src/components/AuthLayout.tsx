
import { ReactNode } from 'react';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="w-full md:w-1/2 lg:w-7/12 bg-slate-800 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1471967183320-ee018f6e114a')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center max-w-md mx-auto">
          <Logo size="lg" className="mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">Collaborate on shopping lists</h1>
          <p className="text-slate-300 text-lg">
            Create shared shopping lists, add items, and track purchases with your friends and family.
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 lg:w-5/12 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
