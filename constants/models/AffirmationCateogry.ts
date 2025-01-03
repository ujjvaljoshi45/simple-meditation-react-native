import { View } from "react-native";

export interface AffirmationCategory {
  title: string;
  data: GalleryPreviewData[];
}

export interface GalleryPreviewData {
  id: number;
  text: string;
  image: any;
}
