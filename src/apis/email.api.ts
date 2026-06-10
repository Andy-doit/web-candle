import { IEmailBase } from "../types/email.type";
import {AxiosResponse} from 'axios';
import {AxiosService} from "./axios.service.ts";
export class EmailApi {
  private static axiosInstance = AxiosService.getInstance();
  private static emailPath = '/mail/send-mail';
  
  static async sendEmail(
    data: IEmailBase,
  ): Promise<AxiosResponse<IEmailBase>> {
    return this.axiosInstance.post(`${this.emailPath}`, data);
  }
}
