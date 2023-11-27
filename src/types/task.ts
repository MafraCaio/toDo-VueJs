export interface Task {
  id?: number;
  title: string;
  description: string;
  comments: string;
  priority: string;
  user_id: number;
  order?: number;
}
