interface IContacts {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;


}

class Contacts implements IContacts {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, fullName: string, email: string, phone: string, text: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default Contacts