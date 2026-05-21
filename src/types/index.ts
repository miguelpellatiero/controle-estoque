export interface ProductWithRelations {
  id: string
  name: string
  sku: string
  quantity: number
  category: {
    id: string
    name: string
  }
  address: {
    id: string
    fullAddress: string
    status: string
  } | null
  photos: {
    id: string
    url: string
    takenAt: Date
  }[]
  countLogs: {
    id: string
    previousQty: number
    newQty: number
    countedAt: Date
    user: {
      name: string
    }
  }[]
}

export interface WarehouseWithAddresses {
  id: string
  name: string
  addressTemplate: string[]
  addresses: {
    id: string
    fullAddress: string
    status: string
    addressParts: Record<string, string>
  }[]
}
