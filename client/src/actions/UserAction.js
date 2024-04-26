import * as UserApi from "../api/UserRequests";
// import {UPDATING_START, UPDATING_SUCCESS} from "../reducers/AuthReducer"

export const getUser = (userId) => async (dispatch) => {
    try {
      const { data } = await UserApi.getUser(userId); // Fetch user data by ID
      dispatch({ type: "GET_USER_SUCCESS", data }); // Dispatch with fresh data
    } catch (error) {
      console.error("Error fetching user:", error);
      dispatch({ type: "GET_USER_FAIL" });
    }
  };


export const updateUser=(id, formData)=> async(dispatch)=> {
    dispatch({type: "UPDATING_START"})
    try{
        const {data} = await UserApi.updateUser(id, formData);
        console.log("Action ko receive hoa hy ye : ",data)
        dispatch({type: "UPDATING_SUCCESS", data: data})
    }   
    catch(error){
        dispatch({type: "UPDATING_FAIL"})
    }
}

export const deleteUser = (id) => async (dispatch) => {
    dispatch({ type: "DELETING_START" });
  
    try {
      await UserApi.deleteUser(id); // Delete user from the backend
      dispatch({ type: "USER_DELETED_SUCCESSFULLY" }); // Dispatch success action
    } catch (error) {
      console.error("Error deleting user:", error);
      dispatch({ type: "DELETING_FAIL" }); // Dispatch fail action
    }
  };

export const followUser = (id, data) => async (dispatch) => {
    try {
      await UserApi.followUser(id, data); // Call API to follow user
      // After a successful follow, fetch the updated user data
      const { data: updatedUser } = await UserApi.getUser(id);
      dispatch({ type: "FOLLOW_USER", data: updatedUser }); // Dispatch updated user data
    } catch (error) {
      console.error("Error following user:", error); // Log error if follow fails
    }
  };
  
  // Action to unfollow a user
  export const unfollowUser = (id, data) => async (dispatch) => {
    try {
      await UserApi.unfollowUser(id, data); // Call API to unfollow user
      const { data: updatedUser } = await UserApi.getUser(id); // Fetch updated user data
      dispatch({ type: "UNFOLLOW_USER", data: updatedUser }); // Dispatch updated user data
    } catch (error) {
      console.error("Error unfollowing user:", error); // Log error if unfollow fails
    }
  };
