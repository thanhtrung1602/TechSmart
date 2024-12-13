interface IProductVariants {
    id: number
    productSlug: string
    romId: number
    colorId: number
    createdAt: Date
    updatedAt: Date
    productData: {
        id: number
        categoryId: number
        manufacturerId: number
        name: string
        slug: string
        price: number
        discount: number
        img: string
        stock: number
        visible: boolean
        hot: number
        createdAt: Date
        updatedAt: Date
    }
    romData: {
        id: number
        romValue: string
        price: number
        createdAt: Date
        updatedAt: Date
    }
    colorData: {
        id: number
        colorValue: string
        img: string
        createdAt: Date
        updatedAt: Date
    }
}

class ProductVariants implements IProductVariants {
    id: number
    productSlug: string
    romId: number
    colorId: number
    createdAt: Date
    updatedAt: Date
    productData: {
        id: number
        categoryId: number
        manufacturerId: number
        name: string
        slug: string
        price: number
        discount: number
        img: string
        stock: number
        visible: boolean
        hot: number
        createdAt: Date
        updatedAt: Date
    }
    romData: {
        id: number
        romValue: string
        price: number
        createdAt: Date
        updatedAt: Date
    }
    colorData: {
        id: number
        colorValue: string
        img: string
        createdAt: Date
        updatedAt: Date
    }
    constructor(id: number, productSlug: string, romId: number, colorId: number, createdAt: Date, updatedAt: Date, productData: {
        id: number
        categoryId: number
        manufacturerId: number
        name: string
        slug: string
        price: number
        discount: number
        img: string
        stock: number
        visible: boolean
        hot: number
        createdAt: Date
        updatedAt: Date
    }, romData: {
        id: number
        romValue: string
        price: number
        createdAt: Date
        updatedAt: Date
    }, colorData: {
        id: number
        colorValue: string
        img: string
        createdAt: Date
        updatedAt: Date
    }) {
        this.id = id
        this.productSlug = productSlug
        this.romId = romId
        this.colorId = colorId
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.productData = productData
        this.romData = romData
        this.colorData = colorData
    }
}

export default ProductVariants