const { text } = require("express");
const db = require("../../models/index");
class ContactService {
  async createConTact({ fullName, email, phone, text }) {
    try {
      const contact = await db.Contact.create({
        fullName,
        email,
        phone,
        text,
      });
      return contact;
    } catch (error) {
      console.error("Có lỗi khi tạo :", error.message);
      throw new Error("Không tạo được liên hệ");
    }
  }

  async searchContact({ query }) {
    try {
      const contacts = await db.Contact.find({
        $or: [
          { fullName: { $regex: query, $options: 'i' } },
          { text: { $regex: query, $options: 'i' } }
        ]
      });
  
      return contacts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllContacts() {
    try {
      const contacts = await db.Contact.findAll();
      return contacts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getContactById(id) {
    try {
      const contact = await db.Contact.findOne({ where: { id } });
      return contact;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateContact(id, { fullName, email, phone, text }) {
    try {
      const contact = await db.Contact.findByPk(id);

      if (!contact) {
        return null;
      }

      const updatedContact = await contact.update({
        fullName,
        email,
        phone,
        text,
      });
      return updatedContact;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteContact(id) {
    try {
      const contact = await db.Contact.findByPk(id);

      if (!contact) {
        return null;
      }

      await contact.destroy();
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ContactService();
