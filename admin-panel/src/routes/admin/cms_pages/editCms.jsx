import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MyForm from "../../../components/MyForm";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosHelper from "../../../helper/AxiosHelper";
import {FILE_SIZE, SUPPORTED_FORMATS_IMAGE,STATUS,SUPPORTED_FORMATS_VIDEO, FILE_SIZE_video} from "../../../constant/fromConfig";

const EditCms = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
      id: "",
      title: "",
      content: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
      },
      page: "", // Page ID
      section: "", // Section ID
      tag: "",
      button1_text: "",
      button1_url: "",
      translations: "",
      status: "",
      order: 0,  // Default value for order
      image: "",
      video: "",
  });
  const [pageList, setPageList] = useState([]); // State to hold page list
  const [sectionList, setSectionList] = useState([]); // State to hold section list
  const [selectedPageId, setSelectedPageId] = useState(""); // State for selected page ID

  const [errors, setErrors] = useState({ name: "", status: "" });

  // Fetch CMS Data
  const fetchCmsData = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData(`cms_page/slug/${slug}`);
    
      if (data?.status === true) {
        const pageId = data.data.page_id ? data.data.page_id : "";
        const sectionId = data.data.section_id ? data.data.section_id : "";
        setInitialValues({
          ...data.data,
          page: pageId,
          section: sectionId,
          button1_text: data.data.button1?.text || '',
          button1_url: data.data.button1?.url || '', // Set the section ID from the response
        });

        setSelectedPageId(pageId); // Set the selected page ID
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error("Error fetching CMS data:", error);
    }
  }, [slug]);

  useEffect(() => {fetchCmsData();}, [fetchCmsData]);

  // Fetch Page List
  const fetchPageList = useCallback(async () => {
    try {
      const pageResponse = await AxiosHelper.getData("page-list");
      if (pageResponse?.data?.status === true) {
        setPageList(pageResponse?.data?.data);
      } else {
        toast.error(pageResponse?.data?.message);
      }
    } catch (error) {
      toast.error("Error fetching page list");
    }
  }, []);

  useEffect(() => {fetchPageList();}, [fetchPageList]);

  // Fetch Section List
  const fetchSectionList = useCallback(async () => {
    if (!selectedPageId) return; // Don't fetch sections if no page is selected
    try {
      const sectionResponse = await AxiosHelper.getData(`section-list/${selectedPageId}`);
      if (sectionResponse?.data?.status === true) {
        setSectionList(sectionResponse?.data?.data);
      } else {
        toast.error(sectionResponse?.data?.message);
      }
    } catch (error) {
      toast.error("Error fetching section list");
    }
  }, [selectedPageId]);

  useEffect(() => {fetchSectionList();}, [fetchSectionList, selectedPageId]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Title must be at least 2 characters"),
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
        col: 4,
        value: initialValues.page, 
        onChange: (e) => {t
          const value = e ? e._id : ""; 
          setSelectedPageId(value); 
          setSectionList([]); 
        },
      },
      {
        label: "Section",
        name: "section",
        type: "select2",
        options: sectionList,
        col: 4,
        value: initialValues.section, 
      },
      {
          label: "Tag",
          name: "tag",
          type: "text",
          col: 4,
      },    
     
      {
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
        label: "Order",
        name: "order",
        type: "text",
        col: 6
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
                    Edit Cms Page
                  </h5>
                </div>
                <div className="col-auto ms-auto">
                  <Link to={`/admin/cms_page`}>
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
                    `cms_page/${values.id}`,
                    values,
                    true
                  );
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

export default EditCms;
