const HostelServices = require('../../model/hostel/hostel.function');
const { uploadFile, DeleteFile } = require("../../utils/fileUpload");

const hostelAdd = async (req, res) => {
    try {
        const { name, address, country, state, city, nearByLocation, pinCode, contactNumber } = req.body

        const hostelData = { name, address, country, state, city, nearByLocation, contactNumber, pinCode }
        let hostel = HostelServices.hostelCreate(hostelData)

        if (req.files) {
            const hostelLogo = req.files["logo"];
            console.log("first", hostelLogo);
            if (hostelLogo) {
                const extensions = [".png", ".jpg", ".jpeg"];
                const fileLink = await uploadFile(hostelLogo, extensions);
                // console.log(fileLink);
                const data = {
                    image: {
                        name: hostelLogo.name,
                        url: fileLink,
                    },
                };
                hostel = await HostelServices.findUserByIdAndUpdate(hostel._id, data);
            }
        }
        res.json({
            status: 200,
            response: "Hostel Created",
            hostel,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message })

    }
}

const hostelFindById = async (req, res) => {
    try {
        const { hostelId } = req.params
        let hostel = HostelServices.findHostelByIdAndUserId(hostelId, req.user._id)
        res.json({
            status: 200,
            response: "Single Hostel View",
            hostel,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message })

    }
}
const updateHostel = async (req, res) => {
    try {
        const { hostelId } = req.params
        const { name, address, country, state, city, nearByLocation, pinCode, contactNumber } = req.body
        const hostelData = { name, address, country, state, city, nearByLocation, contactNumber, pinCode }
        let hostel = await HostelServices.findUserByIdAndUpdate(hostelId, hostelData);

        if (req.files) {
            const hostelLogo = req.files["logo"];
            console.log("first", hostelLogo);
            if (hostelLogo) {
                const extensions = [".png", ".jpg", ".jpeg"];
                const fileLink = await uploadFile(hostelLogo, extensions);
                // console.log(fileLink);
                const data = {
                    image: {
                        name: hostelLogo.name,
                        url: fileLink,
                    },
                };
                hostel = await HostelServices.findUserByIdAndUpdate(hostel._id, data);
            }
        }
        res.json({
            status: 200,
            response: "Hostel Data updated",
            hostel,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message })

    }
}


module.exports = { hostelAdd, hostelFindById, updateHostel }