
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AvatarLetter from './ui/avatar-letter';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDistance } from 'date-fns';

interface GroupCardProps {
  group: Group;
  isSearch?: boolean;
  onJoinSuccess?: () => void;
}

export function GroupCard({ group, isSearch = false, onJoinSuccess }: GroupCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const formattedDate = formatDistance(
    new Date(group.createdAt),
    new Date(),
    { addSuffix: true }
  );

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await api.post(`/groups/${group.id}/join`, { password });
      toast.success(`Joined ${group.name} successfully!`);
      setPasswordDialogOpen(false);
      onJoinSuccess?.();
    } catch (error) {
      console.error('Failed to join group:', error);
      toast.error('Failed to join group. Incorrect password.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleClick = () => {
    if (isSearch) {
      setPasswordDialogOpen(true);
    } else {
      navigate(`/groups/${group.id}`);
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-4 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{group.name}</h3>
            <div className="flex items-center mt-2 text-sm text-slate-500">
              <span>Created {formattedDate}</span>
            </div>
          </div>

          {isSearch ? (
            <Button 
              variant="default" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setPasswordDialogOpen(true);
              }}
            >
              Join
            </Button>
          ) : (
            <div className="flex items-center">
              <span className="text-sm text-slate-500 mr-2">Owner:</span>
              <AvatarLetter 
                name={group.owner.name} 
                size="sm" 
              />
            </div>
          )}
        </div>
      </div>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join {group.name}</DialogTitle>
            <DialogDescription>
              Enter the group password to join.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleJoin} 
              disabled={isJoining || !password.trim()}
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GroupCard;
