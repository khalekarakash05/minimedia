import * as UploadApi from "../api/UploadRequest";

export const uploadImage = (id, data) => async (dispatch) => {
  try {
    console.log("Image upload Action start ho gya hy")
    await UploadApi.uploadImage(id, data);
    console.log("image upload end ho gya hai");
  } catch (error) {
    console.log(error);
  }
};

export const uploadPostImage = (id, data) => async (dispatch) => {
  try {
    console.log("Post Image upload Action start ho gya hy")
    await UploadApi.UploadImagePost(id, data);
    console.log("Post Image upload end ho gya hai");
  } catch (error) {
    console.log(error);
  }
};


export const uploadPost = (data) => async (dispatch) => {
  dispatch({ type: "UPLOAD_START" });
  try {
    console.log("Post upload Action start ho gya hy");
    const newPost =await UploadApi.uploadPost(data);
    dispatch({ type: "UPLOAD_SUCCESS", data: newPost.data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "UPLOAD_FAIL" });
  }
};



