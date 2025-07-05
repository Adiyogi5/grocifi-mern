import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MyForm from "../../../components/MyForm";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosHelper from "../../../helper/AxiosHelper";
import {
  FILE_SIZE,
  SUPPORTED_FORMATS_IMAGE,
  STATUS,
  ISFEATURE,
} from "../../../constant/fromConfig";

const categoryEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ name: "", status: "" });

  const [categoryData, setcategoryData] = useState([]);

  const [initialValues, setInitialValues] = useState({
    name: "",
    parent: null,
    description: "",
    meta_title: "",
    meta_keyword: "",
    meta_description: "",
    sort_order: 0,
    is_feature: false,
    status: true,
    icon: "",
    image: "",
    banner: "",
  });

  const fetchCategoryData = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData(`category/slug/${slug}`);

      if (data?.status === true) {
        let response = data.data;
        setInitialValues(response);
      } else {
        toast.error(data?.message);
        navigate("/admin/category");
      }
    } catch (error) {
      toast.error(error);
    }
  }, [slug, navigate]);

  const getCategoryeData = useCallback(async () => {
    const { data } = await AxiosHelper.getData("category", { parent: false });
    if (data?.status === true) {
      setcategoryData(data?.data);
    }
  }, []);
  //   console.log("data", categoryData);
  useEffect(() => {
    getCategoryeData();
  }, []);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    image: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      }),
    banner: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      }),
    icon: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      })
    // status: Yup.boolean().required('Status is required'),
  });

  const fields = [
    // {
    //   label: "Parent",
    //   name: "parent",
    //   type: "select2",
    //   options: categoryData,
    //   col: 12,
    // },
    {
      label: "Name",
      name: "name",
      type: "text",
      col: 6,
    },
    {
      label: "Sort Order",
      name: "sort_order",
      type: "number",
      col: 6,
    },

    {
      label: "Description",
      name: "description",
      type: "textarea",
      col: 12,
    },
    {
      label: "Meta Title",
      name: "meta_title",
      type: "text",
      col: 6,
    },
    {
      label: "Meta Keyword",
      name: "meta_keyword",
      type: "text",
      col: 6,
    },
    {
      label: "Meta Description",
      name: "meta_description",
      type: "textarea",
      col: 12,
    },
    {
      label: "Is Feature",
      name: "is_feature",
      type: "select2",
      options: ISFEATURE,
      col: 6,
    },
    {
      label: "Status",
      name: "status",
      type: "select2",
      options: STATUS,
      col: 6,
    },
    {
      label: "Icon (square)",
      name: "icon",
      type: "file",
      col: 12,
    },
    {
      label: "Image",
      name: "image",
      type: "file",
      col: 6,
    },
    {
      label: "Banner",
      name: "banner",
      type: "file",
      col: 6,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
    },
  ];

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-3">
            <div className="card-header">
              <div className="row flex-between-end">
                <div className="col-auto align-self-center">
                  <h5 className="mb-0" data-anchor="data-anchor">
                    Edit Category
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <Link to={`/admin/category`}>
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
                    `category/${values.id}`,
                    values,
                    true
                  );
                  if (data?.data?.status === true) {
                    toast.success(data?.data?.message);
                    navigate("/admin/category");
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

export default categoryEdit;
