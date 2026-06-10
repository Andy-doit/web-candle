export class ApiUtils {
  static getOrigin(domain: string): string {
    return `https://${domain}`;
  }

  static getUrl(): string {
    return import.meta.env.VITE_BASE_URL;
    // return `${window.location.origin}/api`;
  }
  static getImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = import.meta.env.VITE_IMAGE_BASE_URL || 'https://misscandle.com.vn';
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}
