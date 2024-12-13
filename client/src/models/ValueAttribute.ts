interface IValueAttribute {
    id: number
    attributeId: number
    productSlug: string
    value: string
    createdAt: Date
    updatedAt: Date
    productData: {
        id: number;
        categoryId: number;
        manufacturerId: number;
        name: string;
        slug: string;
        price: number;
        discount: number;
        img: string;
        stock: number;
        visible: boolean;
        hot: number;
        createdAt: Date;
        updatedAt: Date;
    }
    attributeData: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

class ValueAttribute implements IValueAttribute {
    id: number
    attributeId: number
    productSlug: string
    value: string
    createdAt: Date
    updatedAt: Date
    productData: {
        id: number;
        categoryId: number;
        manufacturerId: number;
        name: string;
        slug: string;
        price: number;
        discount: number;
        img: string;
        stock: number;
        visible: boolean;
        hot: number;
        createdAt: Date;
        updatedAt: Date;
    }
    attributeData: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }

    constructor(id: number, attributeId: number, productSlug: string, value: string, createdAt: Date, updatedAt: Date, productData: {
        id: number;
        categoryId: number;
        manufacturerId: number;
        name: string;
        slug: string;
        price: number;
        discount: number;
        img: string;
        stock: number;
        visible: boolean;
        hot: number;
        createdAt: Date;
        updatedAt: Date;
    }, attributeData: {
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = id
        this.attributeId = attributeId
        this.productSlug = productSlug
        this.value = value
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.productData = productData
        this.attributeData = attributeData
    }

}



export default ValueAttribute