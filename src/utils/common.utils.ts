import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export class CommonUtils {
  static cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
}
