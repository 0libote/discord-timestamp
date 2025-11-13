import React, { useState } from 'react';

const TooltipContext = React.createContext();

export function Tooltip({ children }) {
  const [show, setShow] = useState(false);

  return (
    <TooltipContext.Provider value={{ show, setShow }}>
      <div
        className="relative flex items-center"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ children }) {
  return <>{children}</>;
}

export function TooltipContent({ children, className }) {
  const { show } = React.useContext(TooltipContext);
  return (
    <>
      {show && (
        <div
          className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 text-sm text-white bg-gray-800 dark:bg-black rounded-md shadow-lg z-10 ${className}`}
        >
          {children}
        </div>
      )}
    </>
  );
}
