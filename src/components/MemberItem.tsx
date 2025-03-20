
import { Member } from '@/types';
import AvatarLetter from './ui/avatar-letter';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface MemberItemProps {
  member: Member;
  groupId: string;
  isOwner: boolean;
  onMemberRemoved: () => void;
}

export function MemberItem({ member, groupId, isOwner, onMemberRemoved }: MemberItemProps) {
  const { user } = useAuth();
  const isCurrentUser = member.user.id === user?.id;

  const handleRemoveMember = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isCurrentUser && !isOwner) {
      try {
        await api.delete(`/groups/${groupId}/leave`);
        toast.success('You left the group');
        onMemberRemoved();
      } catch (error) {
        console.error('Failed to leave group:', error);
        toast.error('Failed to leave group');
      }
      return;
    }

    try {
      await api.delete(`/groups/${groupId}/members/${member.id}`);
      toast.success(`Removed ${member.user.name} from the group`);
      onMemberRemoved();
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-md">
      <div className="flex items-center">
        <AvatarLetter 
          name={member.user.name} 
          size="sm" 
        />
        <div className="ml-3">
          <p className="font-medium">{member.user.name}</p>
          <p className="text-sm text-slate-500">{member.user.username}</p>
        </div>
      </div>
      
      {(isOwner || isCurrentUser) && !isOwner && member.user.id !== member.group.owner.id && (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-slate-400 hover:text-destructive hover:bg-destructive/10"
          onClick={handleRemoveMember}
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}

export default MemberItem;
