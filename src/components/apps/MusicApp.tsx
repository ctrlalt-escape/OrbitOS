
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

const MusicApp = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState([0]);
  const [showLibrary, setShowLibrary] = useState(true);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isShuffle, setIsShuffle] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const songs: Song[] = [
    {
      id: 's1',
      title: 'Interstellar',
      artist: 'Hans Zimmer',
      album: 'Cosmic Sounds',
      duration: '4:37',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's2',
      title: 'Digital Dreams',
      artist: 'Electric Wave',
      album: 'Neon Future',
      duration: '3:22',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's3',
      title: 'Starlight',
      artist: 'Lunar Eclipse',
      album: 'Night Sky',
      duration: '5:10',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's4',
      title: 'Ocean Waves',
      artist: 'Aqua Sound',
      album: 'Blue Planet',
      duration: '4:05',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's5',
      title: 'Mountain High',
      artist: 'Nature Beats',
      album: 'Wild Earth',
      duration: '3:45',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's6',
      title: 'City Lights',
      artist: 'Urban Rhythm',
      album: 'Metropolis',
      duration: '3:58',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's7',
      title: 'Desert Wind',
      artist: 'Sahara Sounds',
      album: 'Dunes',
      duration: '4:23',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    },
    {
      id: 's8',
      title: 'Forest Whispers',
      artist: 'Green Echo',
      album: 'Ancient Trees',
      duration: '5:33',
      cover: 'https://cdn-icons-png.flaticon.com/512/3094/3094918.png'
    }
  ];

  useEffect(() => {
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
  }, [songs]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev[0] + 0.5;
          if (newProgress >= 100) {
            handleNextSong();
            return [0];
          }
          return [newProgress];
        });
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setProgress([0]);
    setIsPlaying(true);
  };

  const toggleLike = (songId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setLiked(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(songId)) {
        newLiked.delete(songId);
      } else {
        newLiked.add(songId);
      }
      return newLiked;
    });
  };

  const handleNextSong = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    let nextIndex;
    
    if (isShuffle) {
      // Random song but not the current one
      nextIndex = Math.floor(Math.random() * (songs.length - 1));
      // Adjust if we got the current song
      if (nextIndex >= currentIndex) nextIndex += 1;
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }
    
    const nextSong = songs[nextIndex];
    setCurrentSong(nextSong);
    setProgress([0]);
  };

  const handlePrevSong = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    let prevIndex;
    
    if (progress[0] > 10) {
      // If more than 10% into song, restart current song
      prevIndex = currentIndex;
    } else {
      if (isShuffle) {
        // Random song but not the current one
        prevIndex = Math.floor(Math.random() * (songs.length - 1));
        // Adjust if we got the current song
        if (prevIndex >= currentIndex) prevIndex += 1;
      } else {
        // Previous song (or last song if at beginning)
        prevIndex = (currentIndex - 1 + songs.length) % songs.length;
      }
    }
    
    const prevSong = songs[prevIndex];
    setCurrentSong(prevSong);
    setProgress([0]);
  };

  const toggleRepeatMode = () => {
    setRepeatMode(current => {
      if (current === 'off') return 'all';
      if (current === 'all') return 'one';
      return 'off';
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const formatTime = (percentage: number) => {
    if (!currentSong) return '0:00';
    const durationParts = currentSong.duration.split(':');
    const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
    const currentSeconds = totalSeconds * (percentage / 100);
    
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = Math.floor(currentSeconds % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-navy-950 text-white">
      {/* Header */}
      <div className="border-b border-navy-800 p-3 flex justify-between items-center">
        <h2 className="text-lg font-medium">Music</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-white ${showLibrary ? 'bg-navy-800' : ''}`}
            onClick={() => setShowLibrary(true)}
          >
            Library
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-white ${!showLibrary ? 'bg-navy-800' : ''}`}
            onClick={() => setShowLibrary(false)}
          >
            Browse
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          {showLibrary ? (
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Library</h3>
              <div className="space-y-1">
                {songs.map((song) => (
                  <div 
                    key={song.id} 
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      currentSong?.id === song.id ? 'bg-navy-800' : 'hover:bg-navy-900'
                    }`}
                    onClick={() => handleSongSelect(song)}
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <img src={song.cover} alt={song.album} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{song.title}</div>
                      <div className="text-xs text-gray-400 truncate">{song.artist}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-gray-400 hover:text-white"
                        onClick={(e) => toggleLike(song.id, e)}
                      >
                        <Heart 
                          size={16} 
                          className={liked.has(song.id) ? 'fill-red-500 text-red-500' : ''} 
                        />
                      </button>
                      <span className="text-sm text-gray-400">{song.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-3">Browse</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Pop', 'Rock', 'Jazz', 'Hip Hop', 'Electronic', 'Classical'].map((genre) => (
                  <div key={genre} className="bg-navy-800 p-4 rounded-lg text-center cursor-pointer hover:bg-navy-700 transition-colors">
                    <h4 className="font-medium">{genre}</h4>
                    <p className="text-xs text-gray-400 mt-1">Explore</p>
                  </div>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold my-4">New Releases</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {songs.slice(0, 4).map((album) => (
                  <div key={album.id} className="group cursor-pointer">
                    <div className="aspect-square bg-navy-800 rounded-md mb-2 overflow-hidden">
                      <img src={album.cover} alt={album.album} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="font-medium truncate">{album.album}</div>
                    <div className="text-xs text-gray-400 truncate">{album.artist}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Now Playing Bar */}
      {currentSong && (
        <div className="border-t border-navy-800 p-3">
          <div className="flex items-center mb-2">
            <div className="flex flex-1 min-w-0">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                <img src={currentSong.cover} alt={currentSong.album} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-medium truncate">{currentSong.title}</div>
                <div className="text-xs text-gray-400 truncate">{currentSong.artist}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 text-white hover:bg-navy-800"
                onClick={toggleShuffle}
              >
                <Shuffle size={16} className={isShuffle ? 'text-blue-500' : ''} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 text-white hover:bg-navy-800"
                onClick={handlePrevSong}
              >
                <SkipBack size={16} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 text-white bg-navy-800 hover:bg-navy-700"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 text-white hover:bg-navy-800"
                onClick={handleNextSong}
              >
                <SkipForward size={16} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 text-white hover:bg-navy-800"
                onClick={toggleRepeatMode}
              >
                <Repeat size={16} className={repeatMode !== 'off' ? 'text-blue-500' : ''} />
              </Button>
            </div>
            
            <div className="flex items-center ml-4 w-32 space-x-2">
              <Volume2 size={16} className="text-gray-400" />
              <Slider
                className="w-24"
                value={volume}
                max={100}
                step={1}
                onValueChange={setVolume}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 w-8">{formatTime(progress[0])}</span>
            <Slider
              className="flex-1"
              value={progress}
              max={100}
              step={0.1}
              onValueChange={setProgress}
            />
            <span className="text-xs text-gray-400 w-8">{currentSong.duration}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicApp;
