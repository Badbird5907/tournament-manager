"use client";

import type { Subject } from "@badbird5907/auth-commons";
import { createContext, useContext } from "react";

export const SubjectContext = createContext<Subject | null>(null);

export function useSession() {
  const subject = useContext(SubjectContext);
  return subject;
}

export const SubjectProvider = ({ children, value }: { children: React.ReactNode, value: Subject | null }) => {
  return (
    <SubjectContext.Provider value={value}>
      {children}
    </SubjectContext.Provider>
  )
}
