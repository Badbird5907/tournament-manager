"use client";
import React, { createContext, useContext, useRef } from "react";

const ContentSizeContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export const ContentSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  return <ContentSizeContext.Provider value={targetRef}>
    <div ref={targetRef} className="w-full h-full">
      {children}
    </div>
  </ContentSizeContext.Provider>;
};

export const useContentSize = () => {
  return useContext(ContentSizeContext);
};

