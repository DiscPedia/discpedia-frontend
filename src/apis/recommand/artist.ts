import { call } from "../auth/ApiService";

export type Artist = {
  id: number;
  initial: string;
  name: string;
  subName: string;
};

export const getArtists = async (): Promise<Artist[]> => {
  const data = (await call("/api/artists", "GET")) as { artists: Artist[] };
  return data.artists;
};