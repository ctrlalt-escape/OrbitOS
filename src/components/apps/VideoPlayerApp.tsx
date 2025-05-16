
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize } from 'lucide-react';

const videos = [
  {
    id: 'beach',
    title: 'Beach Sunset',
    description: 'Beautiful sunset at the beach',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'mountain',
    title: 'Mountain View',
    description: 'Scenic view of mountains',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'forest',
    title: 'Forest Walk',
    description: 'Peaceful walk through the forest',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'city',
    title: 'City Lights',
    description: 'Night view of city lights',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

const VideoPlayerApp = () => {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState('library');

  const handlePlayPause = () => {
    const video = document.getElementById('video-player') as HTMLVideoElement;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    const video = document.getElementById('video-player') as HTMLVideoElement;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    setDuration(video.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = document.getElementById('video-player') as HTMLVideoElement;
    const seekTime = parseFloat(e.target.value);
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleSelectVideo = (video) => {
    setCurrentVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    const videoEl = document.getElementById('video-player') as HTMLVideoElement;
    if (videoEl) {
      videoEl.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col h-full bg-navy-950 text-white">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-navy-800">
          <h2 className="text-lg font-semibold">Video Player</h2>
          <TabsList className="bg-navy-900">
            <TabsTrigger value="library" className="data-[state=active]:bg-navy-700">
              Library
            </TabsTrigger>
            <TabsTrigger value="explore" className="data-[state=active]:bg-navy-700">
              Explore
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="library" className="flex-1 flex flex-col p-0 m-0 overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row">
            <div className="lg:w-3/4 bg-black relative flex flex-col">
              <video
                id="video-player"
                src={currentVideo.src}
                className="w-full h-full max-h-[calc(100vh-230px)] lg:max-h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleLoadedMetadata}
              />
              
              <div className="bg-navy-900 p-2 border-t border-navy-700">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-navy-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={() => {
                        const idx = videos.findIndex(v => v.id === currentVideo.id);
                        const prevIdx = (idx - 1 + videos.length) % videos.length;
                        handleSelectVideo(videos[prevIdx]);
                      }}
                    >
                      <SkipBack size={18} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={() => {
                        const idx = videos.findIndex(v => v.id === currentVideo.id);
                        const nextIdx = (idx + 1) % videos.length;
                        handleSelectVideo(videos[nextIdx]);
                      }}
                    >
                      <SkipForward size={18} />
                    </Button>
                    
                    <span className="text-xs text-white/70">
                      {formatTime(currentTime)} / {formatTime(duration || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-navy-800"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-navy-800"
                    >
                      <Maximize size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/4 p-3 border-l border-navy-700 overflow-y-auto">
              <h3 className="text-sm font-semibold mb-3">Playlist</h3>
              <div className="space-y-2">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className={`flex items-start p-2 rounded-lg cursor-pointer ${
                      currentVideo.id === video.id ? 'bg-navy-700' : 'hover:bg-navy-800'
                    }`}
                    onClick={() => handleSelectVideo(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">{video.title}</p>
                      <p className="text-xs text-white/60">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explore" className="flex-1 p-4 m-0 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-navy-800 p-3 rounded-lg">
              <h3 className="font-medium mb-2">Popular Videos</h3>
              <p className="text-sm text-white/70">Discover trending videos from around the web</p>
              <Button variant="outline" className="mt-3 bg-navy-700 border-navy-600">
                Browse Popular
              </Button>
            </div>
            
            <div className="bg-navy-800 p-3 rounded-lg">
              <h3 className="font-medium mb-2">Categories</h3>
              <p className="text-sm text-white/70">Browse videos by category</p>
              <Button variant="outline" className="mt-3 bg-navy-700 border-navy-600">
                View Categories
              </Button>
            </div>
            
            <div className="bg-navy-800 p-3 rounded-lg">
              <h3 className="font-medium mb-2">Upload Video</h3>
              <p className="text-sm text-white/70">Share your own videos with the community</p>
              <Button variant="outline" className="mt-3 bg-navy-700 border-navy-600">
                Upload
              </Button>
            </div>
            
            <div className="bg-navy-800 p-3 rounded-lg">
              <h3 className="font-medium mb-2">Saved Videos</h3>
              <p className="text-sm text-white/70">Access your saved video collection</p>
              <Button variant="outline" className="mt-3 bg-navy-700 border-navy-600">
                View Saved
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoPlayerApp;
