import AxiosHelper from "./AxiosHelper"; // Assuming you have AxiosHelper set up

export const fetchBusinessBySlug = async (slug) => {
  try {
    const { data } = await AxiosHelper.getData(`business/${slug}`);
    return data;
  } catch (error) {
    throw new Error("Error fetching business data: " + error.message);
  }
};

export const fetchBusinessEdit = async (slug) => {
  try {
    const { data } = await AxiosHelper.getData(`business/slug/${slug}`);

    return data;
  } catch (error) {
    throw new Error("Error fetching business data: " + error.message);
  }
};
export const fetchBusiness = async () => {
  try {
    const { data } = await AxiosHelper.getData(`businessDroplist`);
    return data;
  } catch (error) {
    throw new Error("Error fetching Blog data: " + error.message);
  }
};
export const fetchBlogBySlug = async (slug) => {
  try {
    const { data } = await AxiosHelper.getData(`blog/${slug}`);
    return data;
  } catch (error) {
    throw new Error("Error fetching Blog data: " + error.message);
  }
};

export const fetchBlogAutherBySlug = async (slug) => {
  try {
    const { data } = await AxiosHelper.getData(`blogauthor/edit/${slug}`);
    return data;
  } catch (error) {
    throw new Error("Error fetching BlogAuther data: " + error.message);
  }
};
export const fetchBlogAuthor = async () => {
  try {
    const { data } = await AxiosHelper.getData(`blogauthor`);
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching BlogAuther data: " + error.message);
  }
};

export const fetchDesignation = async () => {
  try {
    const { data } = await AxiosHelper.getData(`designation`);
    return data;
  } catch (error) {
    throw new Error("Error fetching business data: " + error.message);
  }
};

export const fetchAdvertisementById = async (id) => {
  try {
    const { data } = await AxiosHelper.getData(`advertisement/${id}`);
    return data;
  } catch (error) {
    throw new Error("Error fetching business data: " + error.message);
  }
};

export const fetchAdvertisementBySlug = async (slug) => {
  try {
    const { data } = await AxiosHelper.getData(`advertisement/slug/${slug}`);
    return data;
  } catch (error) {
    throw new Error("Error fetching business data: " + error.message);
  }
};

export const fetchUsers = async () => {
  try {
    const { data } = await AxiosHelper.getData("user-list");
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

export const fetchUsersWithUnreadMessge = async () => {
  try {
    const { data } = await AxiosHelper.getData("user-list-unreadmessge");
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

export const fetchCategories = async () => {
  try {
    const { data } = await AxiosHelper.getData("category");
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

export const fetchFaqCategories = async () => {
  try {
    const { data } = await AxiosHelper.getData("faqCategory");
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

export const fetchCountries = async () => {
  try {
    const { data } = await AxiosHelper.getData("country-list");
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching countries: " + error.message);
  }
};

export const fetchStates = async (countryId) => {
  try {
    const { data } = await AxiosHelper.getData(
      `state-list/${countryId}`
    );
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching states: " + error.message);
  }
};

export const fetchCities = async (stateId) => {
  try {
    const { data } = await AxiosHelper.getData(`city-list/${stateId}`);
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching cities: " + error.message);
  }
};

export const fetchLabel = async () => {
  try {
    const { data } = await AxiosHelper.getData(`getlabel`);
    return data?.data || [];
  } catch (error) {
    throw new Error("Error fetching cities: " + error.message);
  }
};

export const fetchConstant = async () => {
  try {
    const { data } = await AxiosHelper.getData(`constant-list`);
    return data;
  } catch (error) {
    throw new Error("Error fetching constant-list: " + error.message);
  }
};

export const fetchAdoption = async () => {
  try {
    const { data } = await AxiosHelper.getData(`adsOption`);
    return data.data;
  } catch (error) {
    throw new Error("Error fetching adsOption: " + error.message);
  }
};  