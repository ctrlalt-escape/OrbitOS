
import React, { useState } from 'react';

// Sample photos data
const samplePhotos = [
  {
    id: 1,
    title: "Mountain Landscape",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww",
    date: "2023-10-15"
  },
  {
    id: 2,
    title: "Sunset Beach",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D",
    date: "2023-09-22"
  },
  {
    id: 3,
    title: "City Skyline",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eSUyMHNreWxpbmV8ZW58MHx8MHx8fDA%3D",
    date: "2023-11-03"
  },
  {
    id: 4,
    title: "Forest Path",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9yZXN0fGVufDB8fDB8fHww",
    date: "2023-08-18"
  },
  {
    id: 5,
    title: "Northern Lights",
    url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9ydGhlcm4lMjBsaWdodHN8ZW58MHx8MHx8fDA%3D",
    date: "2023-12-05"
  },
  {
    id: 6,
    title: "Desert Sands",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzZXJ0fGVufDB8fDB8fHww",
    date: "2023-07-30"
  }
];

const PhotosApp = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof samplePhotos[0] | null>(null);
  const [view, setView] = useState<'grid' | 'detail'>('grid');

  const handlePhotoClick = (photo: typeof samplePhotos[0]) => {
    setSelectedPhoto(photo);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedPhoto(null);
    setView('grid');
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="bg-gray-200 p-2 flex justify-between items-center border-b border-gray-300">
        {view === 'detail' ? (
          <button 
            onClick={handleBack} 
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Photos
          </button>
        ) : (
          <div className="text-gray-800 font-medium">All Photos</div>
        )}
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors text-sm">Import</button>
          <button className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors text-sm">Share</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {view === 'grid' ? (
          <div className="grid grid-cols-3 gap-4">
            {samplePhotos.map(photo => (
              <div 
                key={photo.id} 
                className="aspect-square overflow-hidden rounded-md shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handlePhotoClick(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          selectedPhoto && (
            <div className="flex flex-col h-full">
              <h2 className="text-xl font-medium mb-2">{selectedPhoto.title}</h2>
              <p className="text-gray-500 mb-4">Taken on {selectedPhoto.date}</p>
              <div className="flex-1 flex items-center justify-center bg-black rounded-md overflow-hidden">
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.title} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PhotosApp;
