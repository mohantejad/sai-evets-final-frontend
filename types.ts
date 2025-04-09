export interface UserType {
    id: number;
    username: string;
    email: string;
  }
  
  export type EventType = {
    id: number;
    title: string;
    description: string;
    city: string;
    date: string;
    created_by: string;
    image: string;
    event_category: string;
  };