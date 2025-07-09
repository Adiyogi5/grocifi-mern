import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: localStorage.getItem("isLogedIn") === "true",
  _id: "",
  img: "",
  fname: "",
  lname: "",
  email: "",
  phone_no: "",
  roleName: "",
  roleId: "",
  permissions: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateAdmin: (state, action) => {
      let { fname, lname, email, phone_no, img, roleId, _id } = action.payload;

      if (_id) state._id = _id;
      if (fname) state.fname = fname;
      if (lname) state.lname = lname;
      if (roleId) state.roleId = roleId?.id;
      if (roleId) state.roleName = roleId?.name;
      if (email) state.email = email;
      if (phone_no) state.phone_no = phone_no;
      if (img) state.img = img;
    },
    logdedInAdmin: (state, action) => {
      localStorage.setItem("type", "admin");
      localStorage.setItem("isLogedIn", "true");

      let { fname, lname, email, phone_no, img, roleId, _id } = action.payload;
      if (_id) state._id = _id;
      if (fname) state.fname = fname;
      if (lname) state.lname = lname;
      if (roleId) state.roleId = roleId?.id;
      if (roleId) state.roleName = roleId?.name;
      if (email) state.email = email;
      if (phone_no) state.phone_no = phone_no;
      if (img) state.img = img;
      state.isLoggedIn = true;
    },
    logdedOutAdmin: (state) => {
      localStorage.removeItem("type");
      localStorage.removeItem("isLogedIn");
      state._id = "";
      state.fname = "";
      state.lname = "";
      state.email = "";
      state.phone_no = "";
      state.img = "";
      state.roleId = "";
      state.roleName = "";
      state.isLoggedIn = false;
    },
    updatePermission(state, action) {
      state.permissions = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAdmin, logdedInAdmin, logdedOutAdmin, updatePermission } =
  adminSlice.actions;

export default adminSlice.reducer;
