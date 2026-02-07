export class ApiUtils {
  static getOrigin(domain: string): string {
    return `https://${domain}`;
  }

  static getUrl(): string {
    return import.meta.env.VITE_BASE_URL;
  }
}
