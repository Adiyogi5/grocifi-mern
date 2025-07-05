import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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

const subCategoryEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useState({ parent: true });
  const [errors, setErrors] = useState({ name: "", status: "" });
  const [categoryData, setCategoryData] = useState([]);
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
    image: "",
    banner: "",
    icon: ""
  });

  const fetchCategoryData = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData(`category/slug/${slug}`);

      if (data?.status === true) {
        let response = data.data;
        setInitialValues(response);
      } else {
        toast.error(data?.message);
        navigate("/admin/subcategory");
      }
    } catch (error) {
      toast.error(error);
    }
  }, [slug, navigate]);

  const getCategoryData = useCallback(async () => {
    const { data } = await AxiosHelper.getData("category", params);
    if (data?.status === true) {
      setCategoryData(data?.data);
    }
  }, []);

  useEffect(() => {
    getCategoryData();
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
      }),
    // status: Yup.boolean().required('Status is required'),
  });

  const fields = [
    {
      label: "Parent",
      name: "parent",
      type: "select2",
      options: categoryData,
      col: 12,
    },
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
      label: "Icon (Square)",
      name: "icon",
      type: "file",
      col: 6,
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
    <div className="container rounded bg-white p-3">
      <div className="row mb-3">
        <div className="col">
          <h5 className="mb-0" data-anchor="data-anchor">
            Edit Sub Category
          </h5>
        </div>
        <div className="col-auto">
          <Link to={"/admin/subcategory"}>
            <button className="btn btn-sm btn-falcon-default">
              <i className="fa fa-arrow-left me-2"></i>
              Go Back
            </button>
          </Link>
        </div>
      </div>
      <div className="row mb-3">
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
              navigate("/admin/subcategory");
            } else {
              setErrors(data?.data?.data);
              toast.error(data?.data?.message);
            }
          }}
        />
      </div>
    </div>
  );
};

export default subCategoryEdit;
