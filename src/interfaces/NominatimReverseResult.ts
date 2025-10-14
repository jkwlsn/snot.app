interface NominatimReverseResult {
  features: {
    properties: {
      geocoding: {
        district: string;
        city: string | null;
        town: string | null;
        village: string | null;
        country: string;
      };
    };
  }[];
}

export type { NominatimReverseResult };
