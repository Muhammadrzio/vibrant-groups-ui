
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronUp,
  User
} from 'lucide-react';
import AvatarLetter from './ui/avatar-letter';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [groupsExpanded, setGroupsExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div 
              className="flex items-center justify-between py-2 px-4 mb-2 hover:bg-slate-50 rounded-md cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center">
                <User size={18} className="mr-2 text-slate-500" />
                <span>Profile</span>
              </div>
            </div>

            <div 
              className="flex items-center justify-between py-2 px-4 mb-2 hover:bg-slate-50 rounded-md cursor-pointer"
              onClick={() => setGroupsExpanded(!groupsExpanded)}
            >
              <div className="flex items-center">
                <span>Groups</span>
              </div>
              {groupsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {groupsExpanded && (
              <div className="ml-4 space-y-1">
                {/* This will be populated dynamically */}
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full justify-start mt-4"
              onClick={() => navigate('/create-group')}
            >
              <span className="mr-2">+</span> Create Group
            </Button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center p-2 rounded-md hover:bg-slate-50 cursor-pointer">
                <AvatarLetter name={user?.name || 'User'} size="sm" />
                <div className="ml-2 flex-1 overflow-hidden">
                  <p className="truncate font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.username}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
