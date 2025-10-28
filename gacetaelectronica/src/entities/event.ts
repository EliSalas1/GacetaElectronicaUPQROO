export interface EventInterface {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  shortDescription: string;
  longDescription: string;
  status?: string;
}