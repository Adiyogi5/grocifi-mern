import axios from "axios";
import { toast } from 'react-toastify'


const commonHeadres = () => {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
    axios.defaults.headers.common['x-api-key'] = import.meta.env.VITE_LICENCE;
    // axios.defaults.crossDomain = true
    // axios.defaults.withCredentials = true
}

const CheckError = (res) => {
    if (res && res.status === 401) {
        toast.error('Token Expired, Please login Again.')
        localStorage.removeItem('type');
        localStorage.removeItem('isLogedIn');
        // window.location.href = '/user/login';
    }
}

const errorData = (error) => {
    import.meta.env.VITE_LOG_ERRORS_IN_CONSOLE === 'true' && console.log(error.response);
    CheckError(error.response)
    return error.response;
}

const AxiosHelper = {
    getData: async (url, formData = null) => {
        try {
            commonHeadres()
            var data = await axios.get(url, { params: formData })
           
            return data;
        } catch (error) {
            return errorData(error)
        }
    },
    postData: async (url, formData, type) => {
        try {
            commonHeadres()
            var data = await axios.post(url, formData, { headers: { "Content-Type": type ? "multipart/form-data" : "application/json" } })
            return data;
        } catch (error) {
           
            return errorData(error)
        }
    },
    putData: async (url, formData, type) => {
        try {
            commonHeadres()
            var data = await axios.put(url, formData, { headers: { "Content-Type": type ? "multipart/form-data" : "application/json" } })
            return data;
        } catch (error) {
            return errorData(error)
        }
    },
    deleteData: async (url) => {
        try {
            commonHeadres()
            var data = await axios.delete(url)
            return data;
        } catch (error) {
            return errorData(error)
        }
    }
}


export default AxiosHelper;