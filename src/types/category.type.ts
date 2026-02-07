export interface ICategoryBase {
  id: number
  name: string
  creator: string
  image_url: string
  parent_uuid: string
  createdDate: string
  modifiedDate: string
  status: boolean
}

export interface IProductBase {
  id: string
  sku: string
  name: string
  description: string
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
}