import { News } from './news.entity';

export type NewsBody = Pick<
  News,
  'title' | 'content' | 'desc' | 'cover' | 'recommend' | 'push_date'
>;
