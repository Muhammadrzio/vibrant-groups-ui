
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { MainLayout } from '@/components/MainLayout';
import api from '@/lib/api';
import AvatarLetter from '@/components/ui/avatar-letter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Copy } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username);
      toast.success('Username copied to clipboard');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await api.delete('/users');
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-md animate-fadeIn">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-4 pb-6">
            <div className="flex flex-col items-center">
              <AvatarLetter 
                name={user?.name || 'User'} 
                size="lg" 
                className="mb-4"
              />
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-slate-500 mr-2">{user?.username}</span>
                  <button 
                    onClick={handleCopyUsername} 
                    className="text-slate-400 hover:text-primary"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="mt-2 inline-flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={() => logout()}>
              Sign Out
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount} 
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
