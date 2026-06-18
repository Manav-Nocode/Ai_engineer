import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useSearchParams } from "react-router-dom";

export type linksType = {
  self: string;
  git: string;
  html: string;
};
export type repoDetailedTypes = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  _links: linksType;
};

interface AppContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;

  userName: string | null;
  setUserName: (name: string | null) => void;

  selectedRepo: repoDetailedTypes[];
  setSelectedRepo: (repos: repoDetailedTypes[]) => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<repoDetailedTypes[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const url_userId = searchParams.get("user_id");
    if (url_userId) {
      localStorage.setItem("user_id", url_userId);
    }
  }, []);

  useEffect(() => {
    const url_userId = searchParams.get("user_id");
    const storedId = localStorage.getItem("userId");
    if (url_userId) {
      setUserId(url_userId);
    } else if (storedId) {
      setUserId(JSON.parse(storedId));
    }
  }, []);
  if (selectedRepo != null) {
    console.log(selectedRepo);
  }
  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        userName,
        setUserName,
        selectedRepo,
        setSelectedRepo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("Useapp must be inside provider");
  }
  return ctx;
}
