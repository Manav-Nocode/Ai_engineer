import { useQuery } from "@tanstack/react-query";
import { getFileContent } from "../lib/fileContent";
export default function useFile(path: string) {
  return useQuery({
    queryKey: ["file", path],
    queryFn: () => getFileContent(path),
    enabled: false, // don't auto fetch
    // refetchOnWindowFocus: false, // Stop refetching when clicking back into the browser
    // staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes (won't trigger random refetches)
    retry: false,
  });
}
