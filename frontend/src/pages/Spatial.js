import React from 'react';

const Spatial = () => {
  return (
    <div className="w-screen h-screen">
      <iframe
        className="w-full h-full"
        src="https://www.spatial.io/embed/favorite_gnat199s-Hi-Fi-Place-660a81c9b078cda070b5a410?share=7400456488705104419&autoplay=1"
        title="Spatial Embed"
        allow="accelerometer; gyroscope; microphone; camera; vr"
        allowFullScreen
      />
    </div>
  );
};

export default Spatial;
