import {AxiosResponse} from 'axios';
import {AxiosService} from "./axios.service.ts";
import {ApiConstant} from '../constants/admin';
import {ICategoryBase} from "../types";

export class CategoryApi {
  private static axiosInstance = AxiosService.getInstance();
  private static categoryPath = ApiConstant.ENTITIES_PATH.CATEGORIES;

  static async getAllCategories(query: unknown): Promise<AxiosResponse<ICategoryBase[]>> {
    return this.axiosInstance.get(`${this.categoryPath}`, {params: {query}});
  }
}
