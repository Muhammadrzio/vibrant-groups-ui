
import { useState } from 'react';
import { Item, User } from '@/types';
import { Button } from './ui/button';
import { Trash, ShoppingCart } from 'lucide-react';
import AvatarLetter from './ui/avatar-letter';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDistance } from 'date-fns';

interface ShoppingItemProps {
  item: Item;
  groupId: string;
  onItemUpdate: () => void;
  isOwner: boolean;
  currentUser: User;
}

export function ShoppingItem({ item, groupId, onItemUpdate, isOwner, currentUser }: ShoppingItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const formattedCreatedDate = formatDistance(
    new Date(item.createdAt),
    new Date(),
    { addSuffix: true }
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsDeleting(true);
      await api.delete(`/groups/${groupId}/items/${item.id}`);
      toast.success('Item deleted successfully');
      onItemUpdate();
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleBought = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsBuying(true);
      if (item.bought) {
        await api.delete(`/groups/${groupId}/items/${item.id}/unbuy`);
        toast.success('Item marked as not bought');
      } else {
        await api.post(`/groups/${groupId}/items/${item.id}/buy`);
        toast.success('Item marked as bought');
      }
      onItemUpdate();
    } catch (error) {
      console.error('Failed to update item status:', error);
      toast.error('Failed to update item status');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-0 ${item.bought ? 'bg-slate-50' : 'bg-white'}`}>
      <div className="flex items-center">
        <AvatarLetter 
          name={item.name} 
          size="sm" 
          className="mr-3"
        />
        <div>
          <h3 className={`font-medium ${item.bought ? 'text-slate-500 line-through' : ''}`}>
            {item.name}
          </h3>
          <div className="text-xs text-slate-500 mt-1">
            Created by {item.createdBy.name} {formattedCreatedDate}
            {item.bought && item.boughtBy && (
              <span className="ml-2">
                • Bought by {item.boughtBy.name} {item.boughtAt && formatDistance(new Date(item.boughtAt), new Date(), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant={item.bought ? "outline" : "default"}
          size="sm"
          onClick={handleToggleBought}
          disabled={isBuying}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {item.bought ? 'Unbuy' : 'Buy'}
        </Button>
        
        {(isOwner || currentUser.id === item.createdBy.id) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ShoppingItem;
