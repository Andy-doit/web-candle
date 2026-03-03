import {AxiosResponse} from 'axios';
import {AxiosService} from "./axios.service.ts";
import {ApiConstant, Status} from '../constants/admin';
import {IBannerBase, IProductBase} from "../types";

export class ProductApi {
  private static axiosInstance = AxiosService.getInstance();
  private static productPath = ApiConstant.ENTITIES_PATH.PRODUCTS;
  private static bannerPath = ApiConstant.ENTITIES_PATH.BANNERS;

  static async getBanners(): Promise<AxiosResponse<IBannerBase[]>> {
    return this.axiosInstance.get(`${this.bannerPath}`);
  }

  static async getBannerById(id: string | number): Promise<AxiosResponse<IBannerBase>> {
    return this.axiosInstance.get(`${this.bannerPath}/${id}`);
  }

  static async getAllProducts(query: unknown): Promise<AxiosResponse<IProductBase[]>> {
    return this.axiosInstance.get(`${this.productPath}`, {params: {query}});
  }

  static async getProductById(id: string | number): Promise<AxiosResponse<IProductBase>> {
    return this.axiosInstance.get(`${this.productPath}/${id}`);
  }

  static async getProductByCategory(id: string): Promise<AxiosResponse<IProductBase[]>> {
    return this.axiosInstance.get(`${this.productPath}/by-category-id/${id}`);
  }

  static async getCategoryByStatus(status: Status): Promise<AxiosResponse<IProductBase[]>> {
    return this.axiosInstance.get(`${this.productPath}`, { params: { status } });
  }
}
