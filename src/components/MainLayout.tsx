
import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Group } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [groupsExpanded, setGroupsExpanded] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  const fetchGroups = async () => {
    try {
      setIsLoadingGroups(true);
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      setIsCreating(true);
      await api.post('/groups', {
        name: newGroupName,
        password: newGroupPassword,
      });
      toast.success(`Group "${newGroupName}" created successfully`);
      setCreateDialogOpen(false);
      setNewGroupName('');
      setNewGroupPassword('');
      fetchGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

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
                {isLoadingGroups ? (
                  <div className="text-sm text-slate-500 py-1">Loading...</div>
                ) : groups.length > 0 ? (
                  groups.map((group) => (
                    <div 
                      key={group.id}
                      className="py-1 px-2 text-sm hover:bg-slate-50 rounded cursor-pointer"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      {group.name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 py-1">No groups yet</div>
                )}
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full justify-start mt-4"
              onClick={() => setCreateDialogOpen(true)}
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

      {/* Create Group Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new shopping list group to share with others.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="group-name" className="text-sm font-medium">
                Group Name
              </label>
              <Input
                id="group-name"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="group-password" className="text-sm font-medium">
                Password (Optional)
              </label>
              <Input
                id="group-password"
                type="password"
                placeholder="Create a password for private groups"
                value={newGroupPassword}
                onChange={(e) => setNewGroupPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGroup}
              disabled={isCreating || !newGroupName.trim()}
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MainLayout;
