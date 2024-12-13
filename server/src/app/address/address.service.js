const { where } = require("sequelize");
const db = require("../../models/index");

class AddressService {
  async createAddress({
    province,
    ward,
    district,
    street,
    userId,
    name,
    phone,
  }) {
    try {
      const [created, address] = await db.Addresses.findOrCreate({
        where: {
          province,
          ward,
          district,
          street,
          userId,
          name,
          phone,
        },
      });
      return address;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllAddresses() {
    try {
      const addresses = await db.Addresses.findAll();
      return addresses;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAddressById(id) {
    try {
      const address = await db.Addresses.findOne({ where: { id } });
      return address;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateAddress(
    id,
    { province, ward, district, street, userId, name, phone }
  ) {
    try {
      const updatedAddress = await db.Addresses.update(
        {
          province,
          ward,
          district,
          street,
          userId,
          name,
          phone,
        },
        {
          where: {
            id,
          },
        }
      );
      return updatedAddress;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteAddress(id) {
    try {
      const address = await db.Addresses.findByPk(id);
      if (!address) {
        return null;
      }
      await address.destroy();
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAddressesByUser(id) {
    try {
      const addressByUser = await db.Addresses.findAll({
        where: {
          userId: id,
        },
      });
      return addressByUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AddressService();
