import React, { useState, useEffect, useCallback } from "react";
import MyForm from "../../../components/MyForm";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosHelper from "../../../helper/AxiosHelper";
import { FILE_SIZE,SUPPORTED_FORMATS_IMAGE,STATUS ,SUPPORTED_FORMATS_VIDEO, FILE_SIZE_video } from "../../../constant/fromConfig";
import { Link, useNavigate } from "react-router-dom";

const addCms = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ name: "", status: "" });
  const [pageList, setPageList] = useState([]); // State to hold page list
  const [sectionList, setSectionList] = useState([]); // State to hold section list
  const [selectedPageId, setSelectedPageId] = useState(""); // State for selected page ID
  const [selectedSection, setSelectedSection] = useState(""); // State for selected section

  const fetchPageList = useCallback(async () => {
    try {
      const pageResponse = await AxiosHelper.getData("page-list"); // Updated endpoint
      if (pageResponse?.data?.status === true) {
        setPageList(pageResponse?.data?.data); // Update page list state
      } else {
        toast.error(pageResponse?.data?.message); // Handle error
      }
    } catch (error) {
      toast.error("Error fetching page list");
    }
  }, []);

  useEffect(() => {
    fetchPageList();
  }, [fetchPageList]);

  const fetchSectionList = useCallback(async () => {
    if (!selectedPageId) return; // If no page is selected, don't fetch sections
    try {
      const sectionResponse = await AxiosHelper.getData(
        `section-list/${selectedPageId}`
      );
      if (sectionResponse?.data?.status === true) {
        setSectionList(sectionResponse?.data?.data); // Update section list based on selected page
      } else {
        toast.error(sectionResponse?.data?.message);
      }
    } catch (error) {
      toast.error("Error fetching section list");
    }
  }, [selectedPageId]);

  useEffect(() => {
    fetchSectionList();
  }, [fetchSectionList, selectedPageId]);

  const initialValues = {
    title: "",
    content: "",
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    },
    page: "",
    section: "",
    tag: "",
    button1_text: "",
    button1_url: "",
    translations: "",
    status: "",
    order: 0, // Default value for order
    image: "",
    video: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Title must be at least 2 characters")
      .max(500, "Title must be less than 500 characters"),
    image: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
        if (value && typeof value !== "string") return value.size <= FILE_SIZE;
        return true;
      }),
    video: Yup.mixed()
      .test("fileSize", "File too large", (value) => {
          if (value && (typeof value) !== 'string') return value.size <= FILE_SIZE_video;
          return true;
      }),
    order: Yup.number().required("Order is required").min(0, "Order must be a positive number"),
    // status: Yup.boolean().required("Status is required"),
  });

  const fields = [
    {
      label: "Page",
      name: "page",
      type: "select2",
      options: pageList,
      col: 6,
      onChange: (e) => {
        const value = e ? e._id : ""; // Use _id instead of value
        setSelectedPageId(value); // Update selected page ID
        setSectionList([]); // Clear sections if a new page is selected
      },
    },
    {
      label: "Section",
      name: "section",
      type: "select2",
      options: sectionList, // This should be your sectionList fetched from the API
      col: 6,

      onChange: (e) => {
        const value = e ? e.value : ""; // Ensure e is valid
        setSelectedSection(value); // Update the selected section
      },
    },
    {
      label: "Order",
      name: "order",
      type: "text",
      col: 6,
    },
    {
      label: "Tag",
      name: "tag",
      type: "text",
      col: 6,
    },     {
      label: "Button 1 Text",
      name: "button1_text",
      type: "text",
      col: 6
  },
  {
      label: "Button 1 Url",
      name: "button1_url",
      type: "text",
      col: 6
  },
    {
      label: "Title",
      name: "title",
      type: "text",
      col: 12,
    },
    {
      label: "Content",
      name: "content",
      type: "text-editer",
      col: 12,
    },
    {
      label: "Meta Title",
      name: "seo.metaTitle",
      type: "text",
      col: 6,
    },
    {
      label: "Meta Keyword",
      name: "seo.metaKeywords",
      type: "text",
      col: 6,
    },
    {
      label: "Meta Description",
      name: "seo.metaDescription",
      type: "textarea",
      col: 12,
    },
    {
      label: "Status",
      name: "status",
      type: "select2",
      options: STATUS,
      col: 6,
    },
    {
      label: "Image",
      name: "image",
      type: "file",
      col: 6,
    },
    {
        label: "Video",
        name: "video",
        type: "file",
        col: 6
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
                    Add Cms Page
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <Link to={`/admin/banner`}>
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
                  var data = "";
                  data = await AxiosHelper.postData("cms_page", values, true);
                  if (data?.data?.status === true) {
                    toast.success(data?.data?.message);
                    navigate("/admin/cms_page");
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

export default addCms;
