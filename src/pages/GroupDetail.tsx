
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/MainLayout';
import { ShoppingItem } from '@/components/ShoppingItem';
import { MemberItem } from '@/components/MemberItem';
import { Group, Item, Member } from '@/types';
import { toast } from 'sonner';
import api from '@/lib/api';
import AvatarLetter from '@/components/ui/avatar-letter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { MoreVertical, ShoppingCart, Plus, Settings, UserPlus, Trash, LogOut } from 'lucide-react';

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const isOwner = group?.owner?.id === user?.id;

  const fetchGroupData = async () => {
    if (!groupId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch group details
      const groupResponse = await api.get(`/groups/${groupId}`);
      setGroup(groupResponse.data);
      
      // Fetch group items
      const itemsResponse = await api.get(`/groups/${groupId}/items`);
      setItems(itemsResponse.data);
      
      // Fetch group members
      const membersResponse = await api.get(`/groups/${groupId}/members`);
      setMembers(membersResponse.data);
    } catch (error) {
      console.error('Failed to fetch group data:', error);
      toast.error('Failed to load group data');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim() || !groupId) return;
    
    try {
      setIsAddingItem(true);
      await api.post(`/groups/${groupId}/items`, {
        name: newItemName,
      });
      
      setNewItemName('');
      toast.success('Item added successfully');
      fetchGroupData();
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Failed to add item');
    } finally {
      setIsAddingItem(false);
      if (newItemInputRef.current) {
        newItemInputRef.current.focus();
      }
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await api.get(`/users/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser || !groupId) return;
    
    try {
      setIsAddingMember(true);
      await api.post(`/groups/${groupId}/members`, {
        userId: selectedUser.id,
      });
      
      toast.success(`Added ${selectedUser.name} to the group`);
      setAddMemberDialogOpen(false);
      setSelectedUser(null);
      setSearchTerm('');
      setSearchResults([]);
      fetchGroupData();
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add member');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupId) return;
    
    try {
      setIsDeletingGroup(true);
      await api.delete(`/groups/${groupId}`);
      
      toast.success('Group deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error('Failed to delete group');
      setIsDeletingGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    
    try {
      await api.delete(`/groups/${groupId}/leave`);
      
      toast.success('Left the group successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to leave group:', error);
      toast.error('Failed to leave group');
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Group Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold">{group?.name}</h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-sm text-slate-500 mr-2">Owner:</span>
              <AvatarLetter 
                name={group?.owner?.name || ''} 
                size="sm" 
              />
              <span className="ml-2 font-medium">{group?.owner?.name}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner ? (
                  <>
                    <DropdownMenuItem onClick={() => setAddMemberDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setDeleteGroupDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Group
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem 
                    onClick={handleLeaveGroup}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Leave Group
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shopping List Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Item Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4">Add a new item</h2>
              <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                  ref={newItemInputRef}
                  placeholder="What do you need to buy?"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1"
                  disabled={isAddingItem}
                />
                <Input
                  type="number"
                  min="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  className="w-20"
                  disabled={isAddingItem}
                />
                <Button 
                  type="submit" 
                  disabled={isAddingItem || !newItemName.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </form>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg shadow-sm animate-slideIn">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Items <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">{items.length}</span>
                  </h2>
                </div>
              </div>
              
              <div className="divide-y">
                {items.length > 0 ? (
                  items.map((item) => (
                    <ShoppingItem
                      key={item.id}
                      item={item}
                      groupId={groupId!}
                      onItemUpdate={fetchGroupData}
                      isOwner={isOwner}
                      currentUser={user!}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium">Your shopping list is empty</h3>
                    <p className="text-slate-500 mt-1">
                      Add items to your shopping list to stay organized and never forget what you need to buy.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm animate-slideIn">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    Members <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">{members.length}</span>
                  </h2>
                  
                  {isOwner && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAddMemberDialogOpen(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {members.map((member) => (
                  <MemberItem
                    key={member.id}
                    member={member}
                    groupId={groupId!}
                    isOwner={isOwner}
                    onMemberRemoved={fetchGroupData}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Member Dialog */}
        <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>
                Search and add users to your shopping list group.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearchUsers(e.target.value)}
                className="mb-4"
              />
              
              <div className="max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center p-3 rounded-md cursor-pointer ${
                          selectedUser?.id === user.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <AvatarLetter name={user.name} size="sm" />
                        <div className="ml-3">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <p className="text-center text-slate-500 p-4">No users found</p>
                ) : (
                  <p className="text-center text-slate-500 p-4">Start typing to search users</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setAddMemberDialogOpen(false);
                  setSelectedUser(null);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={isAddingMember || !selectedUser}
              >
                {isAddingMember ? 'Adding...' : 'Add Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Group Dialog */}
        <Dialog open={deleteGroupDialogOpen} onOpenChange={setDeleteGroupDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Group</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this group? This action cannot be undone and all items, members, and data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setDeleteGroupDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteGroup}
                disabled={isDeletingGroup}
              >
                {isDeletingGroup ? 'Deleting...' : 'Delete Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
