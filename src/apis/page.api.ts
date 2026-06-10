import { ApiConstant, Status } from "../constants/admin";
import { IPageBase } from "../types/page.type";
import { AxiosService } from "./axios.service";

interface IPageListResponse {
  success: boolean;
  data: IPageBase[];
}

interface IPageDetailResponse {
  success: boolean;
  data: IPageBase;
}

export class PageApi {
    private static axiosInstance = AxiosService.getInstance();
    private static pagePath = ApiConstant.ENTITIES_PATH.PAGES;

    static async getPages(status: Status): Promise<IPageListResponse> {
        const res = await this.axiosInstance.get<IPageListResponse>(`${this.pagePath}`, { params: { status } });
        // interceptor returns response.data directly (cast needed)
        return res as unknown as IPageListResponse;
    }

    static async getPageBySlug(slug: string): Promise<IPageDetailResponse> {
        const res = await this.axiosInstance.get<IPageDetailResponse>(`${this.pagePath}/slug/${slug}`);

        // Safety check: Don't show unpublished posts
        const postData = (res as unknown as IPageDetailResponse).data;
        if (postData && postData.status !== 1) {
        throw new Error("Bài viết chưa được xuất bản/đã bị ẩn.");
        }

        return res as unknown as IPageDetailResponse;
    }
}