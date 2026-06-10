import { AxiosResponse } from 'axios';
import { AxiosService } from './axios.service.ts';
import { IVariant } from '../types';

export class VariantApi {
  private static axiosInstance = AxiosService.getInstance();
  private static path = 'variants';

  static async getByProductId(product_id: string): Promise<AxiosResponse<IVariant[]>> {
    return this.axiosInstance.get(`${this.path}`, { params: { product_id } });
  }
}
