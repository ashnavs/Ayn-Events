import React from 'react';

const ImageGrid = () => {
  // Sample images array
  const images = [
    'https://avatars.mds.yandex.net/i?id=5e91b4b1c2ca1d65daa7558e8d9ca83d95de19ac-10449875-images-thumbs&n=13', 
    'https://avatars.mds.yandex.net/i?id=ec09948b7bf217712931d5720b960d44f4d78919-8498375-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=c3124cc76bf3970ffcb78a421f631fac-4236738-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=70b36004418e5fff05c1c05f356335df-4268363-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=5e91b4b1c2ca1d65daa7558e8d9ca83d95de19ac-10449875-images-thumbs&n=13', 
    'https://avatars.mds.yandex.net/i?id=ec09948b7bf217712931d5720b960d44f4d78919-8498375-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=c3124cc76bf3970ffcb78a421f631fac-4236738-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=70b36004418e5fff05c1c05f356335df-4268363-images-thumbs&n=13',

  ]

  return (
    <div className="bg-[#F8F4EF] min-h-screen p-4 flex flex-col items-center">
      <div className="grid grid-cols-4 gap-4 max-w-6xl">
        {images.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
            <img src={image} alt={`Event ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <button className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 rounded-md">View More</button>
    </div>
  );
};

export default ImageGrid;
