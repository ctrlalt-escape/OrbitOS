
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  url: string;
  featured?: boolean;
}

const GamesApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('featured');
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Sample game data
    const sampleGames: Game[] = [
      {
        id: '2048',
        name: '2048',
        description: 'Join the numbers and get to the 2048 tile!',
        thumbnail: 'https://play-lh.googleusercontent.com/F4cKjRmK54-xbADUmKBFo4bVJEWEJFYOGK0Z_r-n5nT9j5uyVWrTVxGfHFwzYSUlNrQ',
        category: 'Puzzle',
        url: 'https://play2048.co/',
        featured: true
      },
      {
        id: 'tetris',
        name: 'Tetris',
        description: 'Classic block-stacking puzzle game',
        thumbnail: 'https://play-lh.googleusercontent.com/za2Nu_qjMw5GzWfbzet4zeiZT1vW9vYgFEwxg5A__rEJaNALU9RGYXYBmMW8AJyo6Q',
        category: 'Puzzle',
        url: 'https://tetris.com/play-tetris',
        featured: true
      },
      {
        id: 'chess',
        name: 'Chess',
        description: 'Play chess online against the computer',
        thumbnail: 'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
        category: 'Board',
        url: 'https://www.chess.com/play/computer',
        featured: true
      },
      {
        id: 'snake',
        name: 'Snake',
        description: 'Classic snake game',
        thumbnail: 'https://play-lh.googleusercontent.com/V_P-NZ_constfYnIYMxrFzUHjIUe_0nbY9FjgaVtYdlhzTUkbRYZNgDCgIE9D-5N0d3M',
        category: 'Arcade',
        url: 'https://playsnake.org/',
      },
      {
        id: 'sudoku',
        name: 'Sudoku',
        description: 'Test your logic with Sudoku puzzles',
        thumbnail: 'https://play-lh.googleusercontent.com/bPz1guJ6FTlfLe5kcNUgzNlxV5658LBJ4tUQm7jBevsu2BhR8J8J4-kI0CRxyoBkug',
        category: 'Puzzle',
        url: 'https://sudoku.com/',
      },
      {
        id: 'minesweeper',
        name: 'Minesweeper',
        description: 'Classic Minesweeper game',
        thumbnail: 'https://play-lh.googleusercontent.com/95gx1jwUcimOEGjkTPiNiyk9lWAY_U62JRhLYwlgFsQezRbQiEXLJk26rqErMZOBqPU',
        category: 'Puzzle',
        url: 'https://minesweeper.online/',
      },
      {
        id: 'solitaire',
        name: 'Solitaire',
        description: 'Classic card game',
        thumbnail: 'https://play-lh.googleusercontent.com/fGFdtfBXJvCqU3VlLr_4sQHHmOba9vF-lNlNgeJOjZJnQrdJrQ8G0yvWAUcniFfPfg',
        category: 'Card',
        url: 'https://www.solitr.com/',
      },
      {
        id: 'pacman',
        name: 'Pac-Man',
        description: 'Classic arcade game',
        thumbnail: 'https://play-lh.googleusercontent.com/V-lvUzA5kK0Xw3zFz6Xg_39KxEiKZiGBGjGWNYEXcDQt5xgP0lfPL-hsEQHgQiVyig',
        category: 'Arcade',
        url: 'https://www.google.com/logos/2010/pacman10-i.html',
      },
    ];
    setGames(sampleGames);
  }, []);

  const filteredGames = searchQuery
    ? games.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : games;

  const featuredGames = games.filter(game => game.featured);

  const handlePlayGame = (game: Game) => {
    setActiveGame(game);
    setIsPlaying(true);
    toast.info(`Loading ${game.name}...`);
  };

  const handleExitGame = () => {
    setIsPlaying(false);
    setActiveGame(null);
  };

  // Categories
  const categories = Array.from(new Set(games.map(game => game.category)));

  return (
    <div className="flex flex-col h-full bg-navy-950">
      {isPlaying && activeGame ? (
        <div className="flex flex-col h-full">
          <div className="bg-navy-900 p-2 border-b border-navy-700 flex items-center justify-between">
            <h1 className="text-lg font-bold text-white">{activeGame.name}</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExitGame} 
              className="text-xs border-navy-600 bg-navy-900 text-white"
            >
              Exit Game
            </Button>
          </div>
          <div className="flex-1 w-full bg-white">
            <iframe 
              src={activeGame.url} 
              title={activeGame.name} 
              className="w-full h-full border-0" 
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="bg-navy-900 p-3 border-b border-navy-700 flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Games</h1>
            <div className="relative w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-navy-400" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-navy-400 h-9"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 border-b border-navy-800">
              <TabsList className="bg-navy-900 mt-2">
                <TabsTrigger value="featured" className="data-[state=active]:bg-navy-800">
                  Featured
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-navy-800">
                  All Games
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category} 
                    value={category.toLowerCase()} 
                    className="data-[state=active]:bg-navy-800"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="featured" className="flex-1 overflow-auto p-4 m-0">
              <h2 className="text-lg font-semibold text-white mb-3">Featured Games</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredGames.map((game) => (
                  <div key={game.id} className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700">
                    <div className="h-40 overflow-hidden bg-black">
                      <img 
                        src={game.thumbnail} 
                        alt={game.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">{game.name}</h3>
                        <span className="text-xs text-navy-300 bg-navy-900 px-2 py-0.5 rounded">
                          {game.category}
                        </span>
                      </div>
                      <p className="text-sm text-navy-200 mb-3 line-clamp-2">{game.description}</p>
                      <Button 
                        className="w-full"
                        onClick={() => handlePlayGame(game)}
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="flex-1 overflow-auto p-4 m-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredGames.map((game) => (
                  <TooltipProvider key={game.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700 flex flex-col h-full transition-transform hover:scale-105"
                          onClick={() => handlePlayGame(game)}
                        >
                          <div className="h-32 overflow-hidden bg-black">
                            <img 
                              src={game.thumbnail} 
                              alt={game.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="p-2 flex-1 flex flex-col">
                            <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">{game.name}</h3>
                            <div className="mt-auto">
                              <span className="text-xs text-navy-300 bg-navy-900 px-1.5 py-0.5 rounded">
                                {game.category}
                              </span>
                            </div>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{game.name}</p>
                        <p className="text-xs">{game.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent 
                key={category} 
                value={category.toLowerCase()} 
                className="flex-1 overflow-auto p-4 m-0"
              >
                <h2 className="text-lg font-semibold text-white mb-3">{category} Games</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {games
                    .filter(game => game.category === category)
                    .map((game) => (
                      <div key={game.id} className="bg-navy-800 rounded-xl overflow-hidden border border-navy-700">
                        <div className="h-32 overflow-hidden bg-black">
                          <img 
                            src={game.thumbnail} 
                            alt={game.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-white mb-2">{game.name}</h3>
                          <Button 
                            className="w-full"
                            size="sm"
                            onClick={() => handlePlayGame(game)}
                          >
                            Play
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default GamesApp;
