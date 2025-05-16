
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Play, Pause, Volume2, Volume1, VolumeX, SkipForward, SkipBack, Maximize, MinusCircle } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  source: string;
  duration: string;
}

const VideoApp = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Sample Video Library
  const videoLibrary: VideoItem[] = [
    {
      id: 'big-buck-bunny',
      title: 'Big Buck Bunny',
      description: 'A short animated film by the Blender Institute',
      thumbnail: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '9:56'
    },
    {
      id: 'elastic-sea',
      title: 'Elastic Sea',
      description: 'Animated ocean waves',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '10:53'
    },
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'Another animation from the Blender Foundation',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Sintel_movie_poster.jpg/800px-Sintel_movie_poster.jpg',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: '14:48'
    },
    {
      id: 'tears-of-steel',
      title: 'Tears of Steel',
      description: 'Sci-fi short film',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Tears_of_Steel_poster.jpg/800px-Tears_of_Steel_poster.jpg',
      source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: '12:14'
    }
  ];

  const filteredVideos = videoLibrary.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setActiveTab('player');
    
    // Reset player
    setCurrentTime(0);
    setIsPlaying(false);
    
    // Need to wait for video to load
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.volume = volume;
        setIsPlaying(true);
        videoRef.current.play();
      }
    }, 100);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    
    // Update mute state based on volume
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume > 0 ? volume : 0.5;
        setVolume(volume > 0 ? volume : 0.5);
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleTimeChange = (newValue: number[]) => {
    const newTime = newValue[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => setCurrentTime(video.currentTime);
    const videoEnded = () => setIsPlaying(false);
    const getDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('ended', videoEnded);
    video.addEventListener('loadedmetadata', getDuration);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('ended', videoEnded);
      video.removeEventListener('loadedmetadata', getDuration);
    };
  }, [videoRef.current, selectedVideo]);

  return (
    <div className="flex flex-col h-full bg-navy-950">
      <div className="bg-navy-900 p-3 border-b border-navy-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Video Player</h1>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 bg-navy-800 border-navy-700 text-white placeholder:text-navy-400 h-8"
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="border-navy-700 hover:bg-navy-700 text-white"
            onClick={() => setActiveTab('library')}
          >
            Library
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Video Player Tab */}
        <TabsContent value="player" className="flex-1 overflow-hidden m-0 flex flex-col">
          {selectedVideo ? (
            <div className="flex-1 flex flex-col bg-black" ref={videoContainerRef}>
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src={selectedVideo.source}
                  className="max-w-full max-h-full"
                  onClick={togglePlay}
                  playsInline
                />
              </div>
              
              <div className="bg-navy-900 p-2 border-t border-navy-700">
                <div className="mb-2">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleTimeChange}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-navy-300 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime -= 10;
                      }}
                    >
                      <SkipBack size={18} />
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-white hover:bg-navy-800"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={() => {
                        if (videoRef.current) videoRef.current.currentTime += 10;
                      }}
                    >
                      <SkipForward size={18} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
                    </Button>
                    
                    <div className="w-24">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={toggleFullscreen}
                    >
                      <Maximize size={18} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-navy-950">
                <h2 className="text-lg font-bold text-white mb-1">{selectedVideo.title}</h2>
                <p className="text-sm text-navy-300">{selectedVideo.description}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-navy-300 mb-4">No video selected</p>
                <Button onClick={() => setActiveTab('library')}>Browse Library</Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="flex-1 overflow-auto m-0 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="bg-navy-800 rounded-lg overflow-hidden border border-navy-700 cursor-pointer hover:border-navy-500 transition-colors"
                  onClick={() => handlePlayVideo(video)}
                >
                  <div className="aspect-video bg-black relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                      <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-white mb-1">{video.title}</h3>
                    <p className="text-xs text-navy-300 line-clamp-2">{video.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-navy-300 mb-2">No videos found matching "{searchQuery}"</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="border-navy-700 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoApp;
