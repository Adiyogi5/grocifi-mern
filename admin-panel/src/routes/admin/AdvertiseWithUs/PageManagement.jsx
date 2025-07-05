import React, { useState, useEffect, useCallback } from "react";
import * as Yup from "yup";
import { Modal, CloseButton } from "react-bootstrap";
import { toast } from "react-toastify";
import AxiosHelper from "../../../helper/AxiosHelper";
import MyForm from "../../../components/MyForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import { ucFirst } from "../../../helper/StringHelper";
import Action from "../../../components/Table/Action";

const MySwal = withReactContent(Swal);

const PageManagement = () => {
  const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    price_30: "",
    price_90: "",
    price_180: "",
    price_365: "",
  });
  const [param, setParam] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
  });
  const [errors, setErrors] = useState({});
  const [formType, setFormType] = useState("add");

  const getPageData = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData("/ads-page", param);
      console.log("Page API response:", data);
      if (data?.status) {
        setData(data.data || { count: 0, record: [], totalPages: 0, pagination: [] });
      } else {
        toast.error(data?.message || "Failed to fetch pages.");
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Error fetching pages.");
    }
  }, [param]);

  useEffect(() => {
    getPageData();
  }, [getPageData]);

  const handlePageChange = (pageNo) => {
    setParam((prev) => ({ ...prev, pageNo }));
  };

  const validSchema = Yup.object().shape({
    name: Yup.string(), 
    price_30: Yup.number()
      .typeError("Price for 30 days must be a number")
      .required("Price for 30 days is required")
      .positive("Price must be positive"),
    price_90: Yup.number()
      .typeError("Price for 90 days must be a number")
      .required("Price for 90 days is required")
      .positive("Price must be positive"),
    price_180: Yup.number()
      .typeError("Price for 180 days must be a number")
      .required("Price for 180 days is required")
      .positive("Price must be positive"),
    price_365: Yup.number()
      .typeError("Price for 365 days must be a number")
      .required("Price for 365 days is required")
      .positive("Price must be positive"),
  });

  const fields = [
    {
      label: "Name",
      name: "name",
      type: "text",
      col: 12,
      placeholder: "Enter page name",
    },
    {
      label: "Slug",
      name: "slug",
      type: "text",
      col: 6,
      placeholder: "e.g., home-page",
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      col: 12,
      placeholder: "Enter page description",
    },
    {
      label: "Price for 30 Days (₹)",
      name: "price_30",
      type: "number",
      col: 3,
      placeholder: "Enter price",
    },
    {
      label: "Price for 90 Days (₹)",
      name: "price_90",
      type: "number",
      col: 3,
      placeholder: "Enter price",
    },
    {
      label: "Price for 180 Days (₹)",
      name: "price_180",
      type: "number",
      col: 3,
      placeholder: "Enter price",
    },
    {
      label: "Price for 365 Days (₹)",
      name: "price_365",
      type: "number",
      col: 3,
      placeholder: "Enter price",
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
      col: 12,
    },
  ];

  const editData = (event) => {
    try {
      const page = JSON.parse(event.target.getAttribute("main-data"));
      console.log("Editing page:", page);
      const getPrice = (duration) =>
        page.pricing?.find((p) => p.duration === duration)?.price?.toString() || "";
      setInitialValues({
        id: page._id || "",
        name: page.name || "",
        slug: page.slug || "",
        description: page.description || "",
        price_30: getPrice(30),
        price_90: getPrice(90),
        price_180: getPrice(180),
        price_365: getPrice(365),
      });
      setFormType("edit");
      setErrors({});
      setShow(true);
    } catch (error) {
      console.error("Error parsing page data:", error);
      toast.error("Failed to load page data.");
    }
  };

  const deleteData = async (event) => {
    try {
      const { id } = JSON.parse(event.target.getAttribute("data"));
      const { isConfirmed } = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });
      if (isConfirmed) {
        const { data } = await AxiosHelper.deleteData(`/page/${id}`);
        console.log("Delete API response:", data);
        if (data?.status) {
          getPageData();
          toast.success("Page deleted successfully.");
        } else {
          toast.error(data?.message || "Failed to delete page.");
        }
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Error deleting page.");
    }
  };

  const dropList = [
    { name: "Edit", onClick: editData },
    // { name: "Delete", onClick: deleteData, className: "text-danger" },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <div className="row flex-between-end">
              <div className="col-auto">
                <h5>Manage Pages</h5>
              </div>
              <div className="col-auto">
                <Link to="/admin/dashboard" className="btn btn-sm btn-falcon-default me-2">
                  <i className="bi bi-house"></i> Dashboard
                </Link>
                <button
                  onClick={() => {
                    setInitialValues({
                      id: "",
                      name: "",
                      slug: "",
                      description: "",
                      price_30: "",
                      price_90: "",
                      price_180: "",
                      price_365: "",
                    });
                    setFormType("add");
                    setErrors({});
                    setShow(true);
                  }}
                  className="btn btn-sm btn-falcon-orange"
                >
                  <i className="bi bi-plus"></i> Add Page
                </button>
              </div>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="row justify-content-between mb-3">
              <div className="col-md-4">
                <input
                  type="search"
                  placeholder="Search..."
                  className="form-control form-control-sm"
                  onChange={(e) =>
                    setParam((prev) => ({ ...prev, query: e.target.value, pageNo: 1 }))
                  }
                />
              </div>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  {/* <th>Slug</th> */}
                  {/* <th>Description</th> */}
                  <th>Price (30/90/180/365 Days)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.record?.length > 0 ? (
                  data.record.map((row) => {
                    const getPrice = (duration) =>
                      row.pricing?.find((p) => p.duration === duration)?.price || "-";
                    return (
                      <tr key={row._id}>
                        <td>{row.name || "-"}</td>
                        {/* <td>{row.slug || "-"}</td> */}
                        {/* <td>{row.description || "-"}</td> */}
                        <td>
                          ₹{getPrice(30)} / ₹{getPrice(90)} / ₹{getPrice(180)} / ₹{getPrice(365)}
                        </td>
                        <td>
                          <Action dropList={dropList} data={row} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="row align-items-center mt-3">
              <div className="col">
                <p className="mb-0 fs--1">
                  <span className="d-none d-sm-inline-block" data-list-info="data-list-info">
                    {(param.pageNo - 1) * param.limit + 1} to {param.pageNo * param.limit > data?.count ? data?.count : param.pageNo * param.limit} of {data?.count}
                  </span>
                  <span className="d-none d-sm-inline-block"> </span>
                </p>
              </div>
              <div className="col-auto">
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    disabled={param.pageNo === 1}
                    className="btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(1)}
                  >
                    <span className="fas fa-chevron-left" />
                  </button>
                  <ul className="pagination mb-0 mx-1">
                    {data?.pagination.map((row) => (
                      <li key={row}>
                        <button
                          onClick={() => handlePageChange(row)}
                          type="button"
                          className={`page me-1 btn btn-sm ${row === param.pageNo ? "btn-primary" : "btn-falcon-default"}`}
                        >
                          {row}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={param.pageNo === data?.totalPages}
                    className="btn btn-falcon-default btn-sm"
                    onClick={() => handlePageChange(data?.totalPages)}
                  >
                    <span className="fas fa-chevron-right"> </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={show} onHide={() => setShow(false)} size="lg">
          <Modal.Header>
            <Modal.Title>{ucFirst(formType)} Page</Modal.Title>
            <CloseButton onClick={() => setShow(false)} />
          </Modal.Header>
          <Modal.Body>
            <MyForm
              errors={errors}
              onSubmit={async (values) => {
                try {
                  console.log("Form values:", values);
                  const payload = {
                    name: values.name,
                    slug: values.slug,
                    description: values.description,
                    pricing: [
                      { duration: 30, price: parseFloat(values.price_30) },
                      { duration: 90, price: parseFloat(values.price_90) },
                      { duration: 180, price: parseFloat(values.price_180) },
                      { duration: 365, price: parseFloat(values.price_365) },
                    ],
                  };
                  const endpoint =
                    formType === "add" ? "/page/create" : `/page/${values.id}`;
                  const method = formType === "add" ? "postData" : "putData";
                  const { data } = await AxiosHelper[method](endpoint, payload);
                  console.log("Submit API response:", data);
                  if (data?.status) {
                    getPageData();
                    setShow(false);
                    setErrors({});
                    toast.success(`Page ${formType === "add" ? "added" : "updated"} successfully.`);
                  } else {
                    setErrors(data.errors || {});
                    toast.error(data?.message || "Failed to save page.");
                  }
                } catch (error) {
                  console.error("Error saving page:", error);
                  toast.error("Error saving page.");
                }
              }}
              fields={fields}
              initialValues={initialValues}
              validSchema={validSchema}
              setErrors={setErrors}
              setInitialValues={setInitialValues}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default PageManagement;
