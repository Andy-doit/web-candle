export interface ICategoryBase {
  id: number
  name: string
  description: string
  creator: string
  image_url: string
  parent_uuid: string
  note1: string | null
  note2: string | null
  note3: string | null
  createdDate: string
  modifiedDate: string
  status: number
}

export interface IProductBase {
  id: string
  sku: string
  name: string
  description: string
  short_description: string
  price: number
  status: number // 1 | 0 (backend đang trả number)
  images: string[]
  category_ids: string[]
  note1: string | null
  note2: string | null
  note3: string | null
  createdAt: string // ISO date
  updatedAt: string // ISO date
  categories: ICategoryBase[]
  variants?: IVariant[];
}

export interface IBannerBase {
  id: string
  title: string
  description: string
  image: string
  button_link: string
  background_color: string
  status: number
  position: number
}

export interface IVariant {
  id: string;
  product_id: string;
  name: string;
  images: string[];
}
