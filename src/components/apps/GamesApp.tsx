
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Grid2x2, ThumbsUp, Clock, Layout } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Game data
const games = [
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'The classic block-stacking puzzle game',
    thumbnail: 'https://assets-prd.ignimgs.com/2022/01/05/tetris-1-1641417331490.jpg',
    url: 'https://tetris.com/play-tetris',
    category: 'puzzle',
    featured: true
  },
  {
    id: '2048',
    name: '2048',
    description: 'Join the numbers to get to 2048',
    thumbnail: 'https://play-lh.googleusercontent.com/BkRfMTwRrm0tN0Iz0TPLZaIL7dnXKCBD3_2CGvUwrZnECCXUZJwg8pa_U-xQY5uFXtM',
    url: 'https://play2048.co/',
    category: 'puzzle',
    featured: true
  },
  {
    id: 'snake',
    name: 'Snake Game',
    description: 'Control a snake to eat apples and grow',
    thumbnail: 'https://play-lh.googleusercontent.com/V-lvUzA_fMn0J8qb76qQ4D6X83GN_gxM6yF2_pMMTiLC2jJiE_YgA6zGIbzlHg1jdA',
    url: 'https://www.google.com/fbx?fbx=snake_arcade',
    category: 'arcade',
    featured: false
  },
  {
    id: 'chess',
    name: 'Chess',
    description: 'Play classic chess against the computer',
    thumbnail: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
    url: 'https://www.chess.com/play/computer',
    category: 'board',
    featured: true
  },
  {
    id: 'wordle',
    name: 'Wordle',
    description: 'Guess the hidden five-letter word',
    thumbnail: 'https://play-lh.googleusercontent.com/Nl2OOS1mpKEc2Lk36lpULc_ROVBWv8PkAFQ_BbvDgAf99G4kWqVuQJ9jFyxXYDeqXNU',
    url: 'https://wordleunlimited.org/',
    category: 'word',
    featured: false
  },
  {
    id: 'pacman',
    name: 'Pac-Man',
    description: 'Classic arcade game with ghosts and dots',
    thumbnail: 'https://play-lh.googleusercontent.com/V-9RpgD-poA3L7YlEX8RgEMj3_epqRbMBpEF5fByA0zEWfz0Fau6kWBIvqwpodTrdg',
    url: 'https://www.google.com/logos/2010/pacman10-i.html',
    category: 'arcade',
    featured: true
  }
];

// Categories
const categories = [
  { id: 'all', name: 'All Games' },
  { id: 'puzzle', name: 'Puzzle' },
  { id: 'arcade', name: 'Arcade' },
  { id: 'board', name: 'Board' },
  { id: 'word', name: 'Word' },
  { id: 'action', name: 'Action' }
];

const GamesApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentGame, setCurrentGame] = useState<null | {id: string, name: string, url: string}>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Filter games based on search query and category
  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredGames = games.filter(game => game.featured);
  const recentGames = games.slice(0, 3); // Simulating recently played games

  const handlePlayGame = (game) => {
    setCurrentGame(game);
    setActiveTab('play');
  };

  const handleBack = () => {
    setCurrentGame(null);
    setActiveTab('featured');
  };

  const handleAddToFavorites = (gameId) => {
    toast.success('Added to favorites!');
  };

  return (
    <div className="flex flex-col h-full bg-navy-950">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-navy-700">
          <h2 className="text-lg font-semibold text-white">Game Center</h2>
          {!currentGame && (
            <TabsList className="bg-navy-900">
              <TabsTrigger value="featured" className="data-[state=active]:bg-navy-700 text-white">
                Featured
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-navy-700 text-white">
                All Games
              </TabsTrigger>
              <TabsTrigger value="recent" className="data-[state=active]:bg-navy-700 text-white">
                Recent
              </TabsTrigger>
            </TabsList>
          )}
        </div>

        {/* Game player */}
        <TabsContent value="play" className="flex-1 flex flex-col p-0 m-0">
          {currentGame && (
            <>
              <div className="bg-navy-900 p-2 border-b border-navy-700 flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="text-white hover:bg-navy-700"
                >
                  Back to Games
                </Button>
                <h3 className="ml-3 text-white">{currentGame.name}</h3>
              </div>
              <div className="flex-1 bg-black">
                <iframe
                  src={currentGame.url}
                  title={currentGame.name}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                ></iframe>
              </div>
            </>
          )}
        </TabsContent>

        {/* Featured games */}
        <TabsContent value="featured" className="flex-1 p-4 m-0 overflow-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">Featured Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredGames.map((game) => (
                <div key={game.id} className="bg-navy-800 rounded-lg overflow-hidden border border-navy-700">
                  <img 
                    src={game.thumbnail} 
                    alt={game.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-white">{game.name}</h4>
                    <p className="text-sm text-white/70 mb-3">{game.description}</p>
                    <div className="flex justify-between">
                      <Button 
                        onClick={() => handlePlayGame(game)}
                        className="bg-navy-600 hover:bg-navy-500"
                      >
                        Play Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-navy-600"
                        onClick={() => handleAddToFavorites(game.id)}
                      >
                        <ThumbsUp size={16} className="text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">Quick Play</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  className="bg-navy-800 rounded-lg p-3 text-center hover:bg-navy-700 transition-colors border border-navy-700"
                  onClick={() => handlePlayGame(game)}
                >
                  <img 
                    src={game.thumbnail} 
                    alt={game.name} 
                    className="w-16 h-16 object-cover mx-auto rounded-md mb-2"
                  />
                  <h5 className="text-sm font-medium text-white truncate">{game.name}</h5>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* All games */}
        <TabsContent value="all" className="flex-1 p-0 m-0 flex flex-col">
          <div className="p-3 border-b border-navy-700 bg-navy-900">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
                <Input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-white/60"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-9 ${view === 'grid' ? 'bg-navy-700' : 'bg-transparent'} border-navy-700 text-white`}
                  onClick={() => setView('grid')}
                >
                  <Grid2x2 size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-9 ${view === 'list' ? 'bg-navy-700' : 'bg-transparent'} border-navy-700 text-white`}
                  onClick={() => setView('list')}
                >
                  <Layout size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex overflow-x-auto space-x-2 mt-3 pb-1">
              {categories.map((category) => (
                <Button 
                  key={category.id}
                  variant="outline" 
                  size="sm"
                  className={`${selectedCategory === category.id ? 'bg-navy-700' : 'bg-transparent'} border-navy-700 text-white whitespace-nowrap`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <div key={game.id} className="bg-navy-800 rounded-lg overflow-hidden border border-navy-700">
                    <img 
                      src={game.thumbnail} 
                      alt={game.name} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-white">{game.name}</h4>
                      <p className="text-sm text-white/70 mb-3">{game.description}</p>
                      <Button 
                        onClick={() => handlePlayGame(game)}
                        className="w-full bg-navy-600 hover:bg-navy-500"
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGames.map((game) => (
                  <div key={game.id} className="flex bg-navy-800 rounded-lg overflow-hidden border border-navy-700">
                    <img 
                      src={game.thumbnail} 
                      alt={game.name} 
                      className="w-28 h-20 object-cover"
                    />
                    <div className="p-3 flex flex-1 justify-between items-center">
                      <div>
                        <h4 className="font-medium text-white">{game.name}</h4>
                        <p className="text-sm text-white/70">{game.description}</p>
                      </div>
                      <Button 
                        onClick={() => handlePlayGame(game)}
                        className="bg-navy-600 hover:bg-navy-500"
                      >
                        Play
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredGames.length === 0 && (
              <div className="text-center py-10 text-white/70">
                <p className="mb-3">No games found matching your search</p>
                <Button 
                  variant="outline" 
                  onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
                  className="border-navy-700 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Recent games */}
        <TabsContent value="recent" className="flex-1 p-4 m-0 overflow-auto">
          <h3 className="text-lg font-medium text-white mb-3">Recently Played</h3>
          
          {recentGames.length > 0 ? (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div key={game.id} className="flex bg-navy-800 rounded-lg overflow-hidden border border-navy-700">
                  <img 
                    src={game.thumbnail} 
                    alt={game.name} 
                    className="w-28 h-20 object-cover"
                  />
                  <div className="p-3 flex flex-1 justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">{game.name}</h4>
                      <div className="flex items-center text-sm text-white/60 mt-1">
                        <Clock size={14} className="mr-1" />
                        Last played 2 hours ago
                      </div>
                    </div>
                    <Button 
                      onClick={() => handlePlayGame(game)}
                      className="bg-navy-600 hover:bg-navy-500"
                    >
                      Play
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-white/70">
              <p>No recently played games</p>
              <Button 
                onClick={() => setActiveTab('all')}
                className="mt-3 bg-navy-600 hover:bg-navy-500"
              >
                Browse Games
              </Button>
            </div>
          )}
          
          <h3 className="text-lg font-medium text-white mb-3 mt-6">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-navy-800 p-3 rounded-lg border border-navy-700">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-white/70">Games Played</div>
            </div>
            <div className="bg-navy-800 p-3 rounded-lg border border-navy-700">
              <div className="text-2xl font-bold text-white">24 mins</div>
              <div className="text-sm text-white/70">Time Played Today</div>
            </div>
            <div className="bg-navy-800 p-3 rounded-lg border border-navy-700">
              <div className="text-2xl font-bold text-white">Tetris</div>
              <div className="text-sm text-white/70">Most Played Game</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamesApp;
