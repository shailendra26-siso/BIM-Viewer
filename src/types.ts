export interface GisParameters {
  container: HTMLDivElement;
  accessToken: string;
  zoom: number;
  center: [number, number];
  pitch: number;
  bearing: number;
  buildings: Building[];
}

export interface Model {
  name: string;
  id: string;
  image?: string;
  downloadUrl?: string;
}

export interface Building {
  uid: string;
  userID: string;
  lat: number;
  lng: number;
  name: string;
  models: Model[];
}

export interface modelListArray {
  uid: string;
  userID: string;
  lat: number;
  lng: number;
  name: string;
  models: Model[];
}

export interface LngLat {
  lng: number;
  lat: number;
}

export interface Tool {
  name: string;
  active: boolean;
  icon: any;
  action: (...args: any) => void;
}

export interface Floorplan {
  name: string;
  id: string;
}

export interface Property {
  name: string;
  value: string;
}
