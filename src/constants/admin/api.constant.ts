export class ApiConstant {

  static readonly ENTITIES_PATH = {
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
  }

  static readonly HTTP_STATUS_CODE = {
    UNAUTHORIZED: 401,
    UNPROCESSABLE_CONTENT: 422,
  } as const;

  static readonly QUERY_DATA = {
    SKIP_DEFAULT: 0,
    LIMIT_DEFAULT: 10,
    LIMIT_MAX: 100,
  } as const;

  static readonly REQUEST_METHOD = {
    DELETE: 'delete',
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
  } as const;

  static readonly TIME_DEFAULT = {
    TIMEOUT_REQUEST: 30,
    TIME_LOGIN_DELAY: 60,
  } as const;
}
