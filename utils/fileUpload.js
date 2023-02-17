const uuid = require("uuid");
const path = require("path");
const { uploadS3, deleteObject } = require("./aws-upload");

const uploadFile = async (file, extensions) => {
  const fileExtension = path.extname(file.name);

  if (extensions.includes(fileExtension.toLowerCase())) {
    const fileName = uuid.v4() + fileExtension;
    // console.log("fileName",fileName)
    const fileBuffer = file.data;
    console.log("fileBuffer",fileBuffer)
    const link = await uploadS3(fileBuffer, fileName);
    console.log("link",link)
    return link.Location;
  } else {
    return false;
  }
};

const DeleteFile = async (fileName) => {
  console.log("fileName", fileName);
  const value = await fileName.split("/");
  const data = await value[3];
  const deleteConfirm = deleteObject(data);
  return deleteConfirm;
};

module.exports = { uploadFile, DeleteFile };
