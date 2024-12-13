interface IManufacturer {
    id: number;
    categoryId: number;
    name: string;
    img: string;
    slug: string;
    visible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

class Manufacturer implements IManufacturer {
    id: number;
    categoryId: number;
    name: string;
    img: string;
    slug: string;
    visible: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, categoryId: number, name: string, img: string, slug: string,visible: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.img = img;
        this.slug = slug;
        this.visible = visible;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Manufacturer