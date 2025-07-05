import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: localStorage.getItem('isLogedIn') === 'true',
    _id: '',
    name: '',
    email: '',
    phone_no: '',
    image: '',
    roleName: '',
    roleId: '',
    permissions: [],
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        updateAdmin: (state, action) => {
            let {name, email, phone_no, image, roleId, _id } = action.payload;
           
            if (_id) state._id = _id;
            if (name) state.name = name;
            if (roleId) state.roleId = roleId?.id;
            if (roleId) state.roleName = roleId?.name;
            if (email) state.email = email;
            if (phone_no) state.phone_no = phone_no;
            if (image) state.image = image;
          
        },
        logdedInAdmin: (state, action) => {
            localStorage.setItem('type', 'admin');
            localStorage.setItem('isLogedIn', 'true');

            let { name, email, phone_no, image, roleId , _id } = action.payload;
            if (_id) state._id = _id;
            if (name) state.name = name;
            if (roleId) state.roleId = roleId?.id;
            if (roleId) state.roleName = roleId?.name;
            if (email) state.email = email;
            if (phone_no) state.phone_no = phone_no;
            if (image) state.image = image;
            state.isLoggedIn = true;

        },
        logdedOutAdmin: (state) => {
            localStorage.removeItem('type');
            localStorage.removeItem('isLogedIn');
            state._id = '';
            state.name = '';
            state.email = '';
            state.phone_no = '';
            state.image = '';
            state.roleId = '';
            state.roleName = '';
            state.isLoggedIn = false;

        },
        updatePermission(state,action) {
            state.permissions = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateAdmin, logdedInAdmin, logdedOutAdmin, updatePermission } = adminSlice.actions

export default adminSlice.reducer