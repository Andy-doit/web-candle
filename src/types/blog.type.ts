export interface IBlogPost {
  id: string;
  title: string;
  image: string;
  short_text: string;
  status: number;
  body: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface IBlogPostResponse {
  success: boolean;
  data: IBlogPost[];
}

export interface IBlogPostDetailResponse {
  success: boolean;
  data: IBlogPost;
}
