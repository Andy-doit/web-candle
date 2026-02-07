import {AxiosResponse} from 'axios';
import {AxiosService} from "./axios.service.ts";
import {ApiConstant} from '../constants/admin';
import {IProductBase} from "../types";

export class ProductApi {
  private static axiosInstance = AxiosService.getInstance();
  private static productPath = ApiConstant.ENTITIES_PATH.PRODUCTS;

  static async getAllProducts(query: unknown): Promise<AxiosResponse<IProductBase[]>> {
    return this.axiosInstance.get(`${this.productPath}`, {params: {query}});
  }

  static async getProductById(id: string | number): Promise<AxiosResponse<IProductBase>> {
    return this.axiosInstance.get(`${this.productPath}/${id}`);
  }

  static async getProductByCategory(id: string): Promise<AxiosResponse<IProductBase[]>> {
    return this.axiosInstance.get(`${this.productPath}/by-category-id/${id}`);
  }
}
