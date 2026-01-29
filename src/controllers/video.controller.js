import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    /*

    */
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title || !description){
      throw new ApiError(400, "Title and description are mandatory")
    }

    /*
      1. get video the same way you got photos from and then unlink that shits 
    */
    
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!videoLocalPath){
      throw new ApiError(400, "Video File is missing")
    }

    if(!thumbnailLocalPath){
      throw new ApiError(400, "Thumbnail File is missing")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    if(!video){
      throw new ApiError(400, "The Video failed to get uploaded")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail){
      throw new ApiError(400, "The thumbnail wasnt able to get uploaded")
    }

    const publishedVideo = await Video.create({
      title,
      description,
      videoFile: video.url,
      thumbnail: thumbnail.url,
      duration: video.duration,
      owner: req.user._id
    })

    return res
    .status(201)
    .json(
      new ApiResponse(201, publishedVideo, "Video was published successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
      throw new ApiError(400, )
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}