const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, timeDuration, title, description } = req.body; //sectionID becz we need to add into section afterall sokis section m insert krenge uski id
    const video = req.files.videoFile;
    if (!sectionId || !timeDuration || !title || !description || !video) {
      return res.status(400).json({
        Success: "false",
        message: "All fields are required",
      });
    }

    const uplaodDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uplaodDetails.secure_url,
    });
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSection: subSectionDetails._id },
      },
      { new: true }
    ).populate("subSection");
     console.log(updatedSection)
    return res.status(200).json({
      success: true,
      message: "sub section created success",
      updatedSection,
    });
  } catch (error) {
    return res.status(400).json({
      Success: "false",
      message: "sub section not created",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { id, title, description, timeDuration } = req.body;
    const video = req.files?.videoFile;

    const subSection = await SubSection.findById(id);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    if (video) {
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;
    if (timeDuration) subSection.timeDuration = timeDuration;

    await subSection.save(); 

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "SubSection not updated",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subsection ID is required",
      });
    }
    //also need to delete from section
    const section = await Section.findByIdAndUpdate({ _id: SubSection.id });

    await SubSection.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      Success: "false",
      message: "sub section not deleted",
    });
  }
};
