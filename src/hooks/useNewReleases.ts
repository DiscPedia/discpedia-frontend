import { useEffect, useState } from "react";

import { getNewReleases, type NewRelease } from "../apis/aladin";

type NewReleaseState = {
  items: NewRelease[];
  loading: boolean;
  error: string | null;
};

const defaultState: NewReleaseState = {
  items: [],
  loading: true,
  error: null,
};

let cachedItems: NewRelease[] | null = null;
let pendingRequest: Promise<NewRelease[]> | null = null;

const fetchNewReleaseItems = async (size: number) => {
  if (cachedItems) {
    return cachedItems;
  }

  if (!pendingRequest) {
    pendingRequest = getNewReleases({ page: 0, size })
      .then((data) => {
        cachedItems = data.items;
        return data.items;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }

  return pendingRequest;
};

export const useNewReleases = (size = 20): NewReleaseState => {
  const [state, setState] = useState<NewReleaseState>(() => {
    if (cachedItems) {
      return {
        items: cachedItems,
        loading: false,
        error: null,
      };
    }

    return defaultState;
  });

  useEffect(() => {
    let ignore = false;

    const loadNewReleases = async () => {
      try {
        setState((prev) => ({
          ...prev,
          loading: !cachedItems,
          error: null,
        }));

        const items = await fetchNewReleaseItems(size);

        if (!ignore) {
          setState({
            items,
            loading: false,
            error: null,
          });
        }
      } catch {
        if (!ignore) {
          setState({
            items: [],
            loading: false,
            error: "Failed to load new releases",
          });
        }
      }
    };

    void loadNewReleases();

    return () => {
      ignore = true;
    };
  }, [size]);

  return state;
};
