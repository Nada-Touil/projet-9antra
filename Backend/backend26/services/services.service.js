const Service = require('../models/service.model');

module.exports.createService = async (data) => {
  const service = new Service(data);
  return await service.save();
};

module.exports.getAllServices = async () => {
  return await Service.find();
};

module.exports.getAvailableServices = async () => {
  return await Service.find({ disponible: true });
};

module.exports.getServiceById = async (id) => {
  return await Service.findById(id);
};

module.exports.updateService = async (id, updateData) => {
  return await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports.deleteService = async (id) => {
  return await Service.findByIdAndDelete(id);
};
