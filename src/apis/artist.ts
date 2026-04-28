import axios from "axios";

export type Artist = {
  id: number;
  initial: string;
  name: string;
  subName: string;
};

export const getArtists = async (): Promise<Artist[]> => {
  const { data } = await axios.get<{ artists: Artist[] }>("/api/artists");
  return data.artists;
};//일단 msw로 구현