
import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary rounded-lg">
        <SparklesIcon className="w-6 h-6 text-primary-foreground" />
      </div>
      <h1 className="text-xl font-bold font-montserrat text-foreground">
        AI Studio
      </h1>
    </div>
  );
};

export default Logo;
