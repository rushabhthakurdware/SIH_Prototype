const Device = require("../models/Device.js");

const saveDevice = async (deviceId) => {
    let device = await Device.findOne({ deviceId });
    if (!device) {
        device = await Device.create({ deviceId });
    }
    return device;
};

module.exports = {
    saveDevice,
};
