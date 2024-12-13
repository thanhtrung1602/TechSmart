import Attribute from "./Attribute";
import Categories from "./Categories";

interface ICategoryAttribute {
    id: number;
    categoryId: number;
    attributeId: number;
    createdAt: Date;
    updatedAt: Date;
    categoryData: Categories,
    attributeData: Attribute,
}

export default class CategoryAttribute implements ICategoryAttribute {
    id: number;
    categoryId: number;
    attributeId: number;
    createdAt: Date;
    updatedAt: Date;
    categoryData: Categories;
    attributeData: Attribute;

    constructor(id: number, categoryId: number, attributeId: number, createdAt: Date, updatedAt: Date, categoryData: Categories, attributeData: Attribute) {
        this.id = id;
        this.categoryId = categoryId;
        this.attributeId = attributeId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.categoryData = categoryData;
        this.attributeData = attributeData;
    }
}