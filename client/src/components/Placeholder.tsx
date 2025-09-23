import React from 'react';
import myGif from '../../public/amogus.gif';

const Placeholder: React.FC = () => {
  return (
    <div className="px-6 py-20 p-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <img src={myGif} alt="A descriptive alt text for the gif" />
    </div>
  );
};

export default Placeholder;