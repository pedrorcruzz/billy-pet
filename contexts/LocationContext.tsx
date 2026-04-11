import * as Location from "expo-location";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
  street?: string;
  neighborhood?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}

export interface SavedAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationContextValue {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<UserLocation | null>;
  savedAddress: SavedAddress | null;
  saveAddress: (address: SavedAddress) => void;
  clearSavedAddress: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);

  const requestLocation = useCallback(async (): Promise<UserLocation | null> => {
    setLoading(true);
    setError(null);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setError(
          "Permissão de localização negada. Habilite nas configurações para usar este recurso.",
        );
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const reverse = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const place = reverse[0];
      const userLocation: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        street: place?.street ?? undefined,
        neighborhood: place?.district ?? place?.subregion ?? undefined,
        city: place?.city ?? place?.subregion ?? undefined,
        region: place?.region ?? undefined,
        postalCode: place?.postalCode ?? undefined,
      };

      setLocation(userLocation);
      return userLocation;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível obter sua localização.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAddress = useCallback((address: SavedAddress) => {
    setSavedAddress(address);
  }, []);

  const clearSavedAddress = useCallback(() => {
    setSavedAddress(null);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        requestLocation,
        savedAddress,
        saveAddress,
        clearSavedAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}

export { LocationContext };
