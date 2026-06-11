import {AxiosResponse} from 'axios';
import {AxiosService} from "./axios.service.ts";
import {ApiConstant, Status} from '../constants/admin';
import {ICategoryBase} from "../types";

export class CategoryApi {
  private static axiosInstance = AxiosService.getInstance();
  private static categoryPath = ApiConstant.ENTITIES_PATH.CATEGORIES;

  static async getAllCategories(query: unknown): Promise<AxiosResponse<ICategoryBase[]>> {
    return this.axiosInstance.get(`${this.categoryPath}`, {params: {query}});
  }

  static async getCategoriesWithParents(): Promise<AxiosResponse<ICategoryBase[]>> {
    return this.axiosInstance.get(`${this.categoryPath}/with-parents`, { params: { _t: Date.now() } });
  }

  static async getCategoryByParentId(id: string): Promise<AxiosResponse<ICategoryBase[]>> {
    return this.axiosInstance.get(`${this.categoryPath}/children/${id}`);
  }

  static async getCategoryByStatus(status: Status): Promise<AxiosResponse<ICategoryBase[]>> {
    return this.axiosInstance.get(`${this.categoryPath}`, { params: { status } });
  }
}
