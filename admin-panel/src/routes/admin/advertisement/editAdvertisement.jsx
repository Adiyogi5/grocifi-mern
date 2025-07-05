import React, { useState, useCallback, useEffect } from "react";
import MyForm from "../../../components/MyForm";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosHelper from "../../../helper/AxiosHelper";
import { DAYS } from "../../../constant/fromConfig";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  fetchAdvertisementById,
  fetchUsers,
  fetchCategories,
  fetchCountries,
  fetchStates,
  fetchCities,
  fetchConstant,
  fetchAdoption,
} from "../../../helper/ApiService";
import { formatDateYYMMDD } from "../../../helper/StringHelper";

let opening_hours = DAYS.reduce((acc, day) => {
  acc[day] = { open: "00:00", close: "00:00", enabled: false };
  return acc;
}, {});

let code = [];

const editAdvertisement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPrice, setShowPrice] = useState(false);
  const [showMinPriceMaxPrice, setShowMinPriceMaxPrice] = useState(false);
  const [errors, setErrors] = useState({ name: "", status: "" });
  const [userData, setUserData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [constData, setConst] = useState([]);
  const [optionData, setoptionData] = useState([]);

  const [initialValues, setInitialValues] = useState({
    category_id: "",
    country_id: "",
    state_id: "",
    city_id: "",
    owner_id: "",

    title: "",
    description: "",
    advertisement_tag: "",

    pricing: "",
    price: 0,
    price_type: "",
    price_unit: "",
    currency: "",
    minPrice: 0,
    maxPrice: 0,

    ad_label: "",

    condition: "",
    hour_type: "",
    opening_hours: "",
    local_url: "",

    image: "",
    attachments: "",
    video: "",

    name: "",
    email: "",
    website: "",
    phone: "",
    whatsapp: "",
    phone_code: "91",
    social_profile: {
      website:"",
      facebook: "",
      youtube: "",
      instagram: "",
      x: "",
      linkedin: "",
    },
    address: "",
    zip: "",
    lat: "",
    long: "",
    is_feature : 0,
    status: "",
    expiry_date: "",
  });

  const validationSchema = Yup.object().shape({
    // price: Yup.number().required("Price is required"),
    owner_id: Yup.string().required("Owner is required"),
    country_id: Yup.string().required("Country is required"),
    state_id: Yup.string().required("State is required"),
    city_id: Yup.string().required("City is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const fetchData = useCallback(async () => {
    try {
      const [advertisement, users, categories, countries, constants, options] =
        await Promise.all([
          fetchAdvertisementById(id),
          fetchUsers(),
          fetchCategories(),
          fetchCountries(),
          fetchConstant(),
          fetchAdoption(),
        ]);

      if (advertisement?.status === true) {
        if (advertisement.data?.hour_type == "selected") {
          advertisement.data.hour_type = true;
          let hours = advertisement.data.opening_hours;
          advertisement.data.opening_hours = hours.reduce((acc, dayData) => {
            acc[dayData.day] = {
              open: dayData.open,
              close: dayData.close,
              enabled: dayData.enabled || false,
            };
            return acc;
          }, {});
        } else {
          advertisement.data.opening_hours = opening_hours;
          advertisement.data.hour_type = false;
        }
        const response = {
          ...advertisement.data,
          expiry_date: advertisement.data?.expiry_date
            ? formatDateYYMMDD(advertisement.data?.expiry_date)
            : "",
        };

        setInitialValues(response);

        setUserData(users);
        setCategoryData(categories);
        setCountryData(countries);
        setConst(constants);
        setoptionData(options);
        if (advertisement.data.country_id) {
          code = countries.map(function (country) {
            return { id: country.phone_code, name: country.phone_code };
          });

          advertisement.data.advertisement_tag =
            advertisement.data.advertisement_tag.map(function (tag) {
              return tag.id;
            });
          const states = await fetchStates(advertisement.data.country_id);
          setStateData(states);
          if (advertisement.data.state_id) {
            const cities = await fetchCities(advertisement.data.state_id);
            setCityData(cities);
          }
        }
      } else {
        navigate("/admin/advertisement");
        toast.error(advertisement?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [id]);

  const handleCountryChange = useCallback(async (countryId) => {
    try {
      const states = await fetchStates(countryId);
      setStateData(states);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const handleStateChange = useCallback(async (stateId) => {
    try {
      const cities = await fetchCities(stateId);
      setCityData(cities);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const handlePricingChange = useCallback(async (selectedPricingId) => {
    try {
      if (selectedPricingId === "single") {
        setShowPrice(true); // Show the price field
        setShowMinPriceMaxPrice(false); // Hide the min and max price fields
      } else if (selectedPricingId === "range") {
        setShowPrice(false); // Hide the price field
        setShowMinPriceMaxPrice(true); // Show the min and max price fields
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fields = [
    {
      label: "Title",
      name: "title",
      type: "text",
      col: 12,
    },
    {
      label: "Description",
      name: "description",
      type: "text-area",
      col: 12,
    },
    {
      label: "Category",
      name: "category_id",
      type: "select2",
      options: categoryData,
      col: 4,
    },
    {
      label: "Owner",
      name: "owner_id",
      type: "select2",
      options: userData,
      col: 4,
    },
    {
      label: "Label",
      name: "ad_label",
      type: "select2",
      options: optionData?.adlabel,
      col: 4,
    },
    {
      label: "Price Type",
      name: "price_type",
      type: "select2",
      options: constData?.PRICETYPE,
      col: 4,
    },
    {
      label: "Currency",
      name: "currency",
      type: "select2",
      options: optionData?.currency,
      col: 4,
    },
    {
      label: "Pricing",
      name: "pricing",
      type: "select2",
      options: constData?.PRICING || [],
      onChangeCustom: (selectedPricing) => {
        handlePricingChange(selectedPricing.id);
      },
      col: 4,
    },
    ...(showPrice
      ? [
          {
            label: "Price",
            name: "price",
            type: "number",
            col: 4,
          },
        ]
      : []),
    ...(showMinPriceMaxPrice
      ? [
          {
            label: "Min Price",
            name: "minPrice",
            type: "number",
            col: 4,
          },
          {
            label: "Max Price",
            name: "maxPrice",
            type: "number",
            col: 4,
          },
        ]
      : []),
    {
      label: "Price Unit",
      name: "price_unit",
      type: "select2",
      options: optionData?.priceunit,
      col: 4,
    },
    {
      label: "Condition",
      name: "condition",
      type: "select2",
      options: optionData?.condition,
      col: 4,
    },
    {
      label: "Country",
      name: "country_id",
      type: "select2",
      options: countryData,
      onChangeCustom: (selectedCountry) => {
        handleCountryChange(selectedCountry.id);
      },
      col: 4,
    },
    {
      label: "State",
      name: "state_id",
      type: "select2",
      options: stateData,
      onChangeCustom: (selectedState) => {
        handleStateChange(selectedState.id);
      },
      col: 4,
    },
    {
      label: "City",
      name: "city_id",
      type: "select2",
      options: cityData,
      col: 4,
    },
    {
      label: "Advertisement Tags",
      name: "advertisement_tag",
      type: "select-multiple",
      options: optionData?.tag,
      col: 4,
    },
    {
        label: "Is Feature",
        name: "is_feature",
        type: "select2",
        options: constData?.ISFEATURE,
        col: 4
    },
    {
      label: "Status",
      name: "status",
      type: "select2",
      options: constData?.ADSTATUS,
      col: 4,
    },
    {
      label: "Expire date",
      name: "expiry_date",
      type: "date",
      col: 4,
    },
    {
      label: "Video Url",
      name: "video",
      type: "text",
      col: 4,
    },

    {
      label: "Contact Name",
      name: "name",
      type: "text",
      col: 4,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      col: 4,
    },
    {
      label: "Website",
      name: "website",
      type: "text",
      col: 4,
    },
    {
      label: "Phone",
      name: "phone",
      type: "text",
      col: 4,
    },
    {
      label: "Code",
      name: "phone_code",
      type: "select2",
      options: code,
      col: 4,
    },
    {
      label: "Whatsapp",
      name: "whatsapp",
      type: "text",
      col: 4,
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      col: 4,
    },
    {
      label: "Zip",
      name: "zip",
      type: "number",
      col: 3,
    },
    {
      label: "Facebook",
      name: "social_profile.facebook",
      type: "text",
      col: 4,
    },
    {
      label: "Linkedin",
      name: "social_profile.linkedin",
      type: "text",
      col: 4,
    },
    {
      label: "Instagram",
      name: "social_profile.instagram",
      type: "text",
      col: 4,
    },
    {
      label: "Youtube",
      name: "social_profile.youtube",
      type: "text",
      col: 4,
    },
    {
      label: "X",
      name: "social_profile.x",
      type: "text",
      col: 4,
    },
    {
      label: "Image",
      name: "image",
      type: "multi-file",
      col: 4,
      // multiple: true
    },
    {
      label: "Attechment",
      name: "attachments",
      type: "file",
      col: 4,
    },
    {
      label: "Opening Hours",
      name: "opening_hours",
      type: "opening_hr",
      options: constData?.OPENING_HOURS,
      col: 12,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
    },
  ];

//   console.log("Status: ", constData?.ADSTATUS);
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header">
              <div className="row flex-between-end">
                <div className="col-auto align-self-center">
                  <h5 className="mb-0" data-anchor="data-anchor">
                    Edit Advertisement
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <Link to={`/admin/advertisement`}>
                    <button className="btn btn-sm btn-falcon-default">
                      <i className="fa fa-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="card-body">
              <MyForm
                errors={errors}
                fields={fields}
                initialValues={initialValues}
                validSchema={validationSchema}
                onSubmit={async (values) => {
                  const data = await AxiosHelper.putData(
                    `advertisement/edit/${values.id}`,
                    values,
                    true
                  );
                  
                  if (data?.data?.status === true) {
                    toast.success(data?.data?.message);
                    navigate("/admin/advertisement");
                  } else {
                    setErrors(data?.data?.data);
                    toast.error(data?.data?.message);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default editAdvertisement;
