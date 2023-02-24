const HostelServices = require('../../model/hostel/hostel.function');

// const hostelAdd = async (req, res) => {
//     try {
//         const { name, address, country, state, city, nearByLocation, pinCode, contactNumber } = req.body

//         const hostelData = { name, address, country, state, city, nearByLocation, contactNumber, pinCode }
//         let hostel = HostelServices.hostelCreate(hostelData)

//         if (req.files) {
//             const hostelLogo = req.files["logo"];
//             console.log("first", hostelLogo);
//             if (hostelLogo) {
//                 const extensions = [".png", ".jpg", ".jpeg"];
//                 const fileLink = await uploadFile(hostelLogo, extensions);
//                 // console.log(fileLink);
//                 const data = {
//                     image: {
//                         name: hostelLogo.name,
//                         url: fileLink,
//                     },
//                 };
//                 hostel = await HostelServices.findUserByIdAndUpdate(hostel._id, data);
//             }
//         }
//         res.json({
//             status: 200,
//             response: "Hostel Created",
//             hostel,
//         });
//     } catch (err) {
//         res.json({ status: 400, response: err.message })

//     }
// }
const updateHostel = async (req, res) => {
    try {
        const { hostelId } = req.params
        const { active, verify } = req.body
        let hostelData ={ active, verify }
        let hostel = await HostelServices.findUserByIdAndUpdate(hostelId, hostelData);
        res.json({
            status: 200,
            response: "Hostel Status Change",
            hostel,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message })

    }
}
//Admin View
const adminHostelFindById = async (req, res) => {
    try {
        const { hostelId } = req.params
        let hostel = HostelServices.findHostelById(hostelId)
        res.json({
            status: 200,
            response: "Single Hostel View",
            hostel,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message })

    }
}
const adminAllHostelFind = async (req, res) => {
    try {
        let hostel = HostelServices.viewAllHostel()


        res.json({
            status: 200,
            response: "Single Hostel View",
            hostel,
        });
    } catch (err) {
        res.json({ status: 400, response: err.message })

    }
}
// hostelAdd,
module.exports = {  adminHostelFindById, adminAllHostelFind, updateHostel }