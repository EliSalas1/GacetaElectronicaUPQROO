export interface ArticleInterface {
  id: number,
  title: string,
  author: string,
  category: string,
  createdAt: string,
  content: string,
  status: string,
  publishedAt: string | null
}