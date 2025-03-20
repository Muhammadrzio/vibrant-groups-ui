
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MainLayout } from '@/components/MainLayout';
import { GroupCard } from '@/components/GroupCard';
import { Group } from '@/types';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Search } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchResults, setSearchResults] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyGroups = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to load your groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await api.get(`/groups/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search groups:', error);
      toast.error('Failed to search groups');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchMyGroups();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-slate-500 mt-1">Manage your shopping lists in one place</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Search Results Section */}
        {searchQuery && (
          <div className="mb-8 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            
            {isSearching ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((group) => (
                  <GroupCard 
                    key={group.id} 
                    group={group} 
                    isSearch={true}
                    onJoinSuccess={fetchMyGroups}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-slate-500">No groups found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* My Groups Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Groups</h2>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-slate-500">You don't have any groups yet.</p>
              <Button 
                onClick={() => document.dispatchEvent(new CustomEvent('open-create-group'))}
                className="mt-4"
              >
                Create Your First Group
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
