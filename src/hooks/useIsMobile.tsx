"use client"
import { useEffect, useState } from "react";

const useIsMobile = (defaultWidth = 768) => {
  const [width, setWidth] = useState(window.innerWidth);
  
  const handleWindowSizeChange = () => setWidth(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  return (width <= defaultWidth);
}

export default useIsMobile