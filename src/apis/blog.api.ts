import {AxiosService} from "./axios.service.ts";
import {ApiConstant, Status} from '../constants/admin';
import {IBlogPost} from "../types";

interface IPostListResponse {
  success: boolean;
  data: IBlogPost[];
}

interface IPostDetailResponse {
  success: boolean;
  data: IBlogPost;
}

export class BlogApi {
  private static axiosInstance = AxiosService.getInstance();
  private static postsPath = ApiConstant.ENTITIES_PATH.POSTS;

  // NOTE: The axios interceptor unwraps response.data, so the result is
  // the raw API body: { success, data } — not an AxiosResponse wrapper.
  static async getPosts(status: Status): Promise<IPostListResponse> {
    const res = await this.axiosInstance.get<IPostListResponse>(`${this.postsPath}`, { params: { status } });
    // interceptor returns response.data directly (cast needed)
    return res as unknown as IPostListResponse;
  }

  static async getPostBySlug(slug: string): Promise<IPostDetailResponse> {
    const res = await this.axiosInstance.get<IPostDetailResponse>(`${this.postsPath}/slug/${slug}`);
    
    // Safety check: Don't show unpublished posts
    const postData = (res as unknown as IPostDetailResponse).data;
    if (postData && postData.status !== 1) {
      throw new Error("Bài viết chưa được xuất bản/đã bị ẩn.");
    }

    return res as unknown as IPostDetailResponse;
  }
}
