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

const SectionManagement = () => {
  const [data, setData] = useState({ count: 0, records: [], totalPages: 0, pagination: [] });
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: "",
    page_id: "",
    uniqueKey: "",
    name: "",
    aspect_ratio: "",
    allowed_types: [],
    content_types: "",
  });
  const [param, setParam] = useState({ limit: 10, pageNo: 1, query: "", page_id: "" });
  const [errors, setErrors] = useState({});
  const [pages, setPages] = useState([]);
  const [formType, setFormType] = useState("add");

  const getSectionData = useCallback(async () => {
    const { data } = await AxiosHelper.getData(`ads-section/${param.page_id}`, param);
    if (data?.status) setData(data.data);
    else toast.error(data?.message);
  }, [param]);

  const fetchPages = async () => {
    const { data } = await AxiosHelper.getData("ads-page");
    if (data?.status) setPages(data.data.record);
  };

  useEffect(() => {
    getSectionData();
    fetchPages();
  }, [getSectionData]);

  const handlePageChange = (pageNo) => {
    setParam((prev) => ({ ...prev, pageNo }));
  };

  const validSchema = Yup.object().shape({
    page_id: Yup.string().required("Page is required"),
    uniqueKey: Yup.string().required("Unique key is required"),
    name: Yup.string().required("Name is required"),
    aspect_ratio: Yup.string()
      .matches(/^\d+:\d+$/, "Aspect ratio must be like 16:9")
      .required("Aspect ratio is required"),
    allowed_types: Yup.array()
      .min(1, "Select at least one allowed type")
      .of(Yup.string().oneOf(["user", "admin", "google"]))
      .required(),
    content_types: Yup.string().required("Content type is required"),
  });

  const fields = [
    {
      label: "Page",
      name: "page_id",
      type: "select2",
      options: pages.map((p) => ({ id: p._id, name: p.name })),
      col: 6,
    },
    {
      label: "Unique Key",
      name: "uniqueKey",
      type: "text",
      col: 6,
    },
    {
      label: "Name",
      name: "name",
      type: "text",
      col: 6,
    },
    {
      label: "Aspect Ratio",
      name: "aspect_ratio",
      type: "text",
      placeholder: "e.g. 16:9",
      col: 6,
    },
    {
      label: "Allowed Types",
      name: "allowed_types",
      type: "select-multiple",
      // multiple: true,
      options: [
        { id: "user", name: "User" },
        { id: "admin", name: "Admin" },
        { id: "google", name: "Google" },
      ],
      col: 6,
    },
    {
      label: "Content Types",
      name: "content_types",
      type: "select2",
      options: [
        { id: "image", name: "Image" },
        { id: "video", name: "Video" },
        { id: "both", name: "Both" },
      ],
      col: 6,
    },
    {
      label: "Submit",
      name: "submit",
      type: "submit",
    },
  ];

  const editData = async (event) => {
    const section = JSON.parse(event.target.getAttribute("main-data"));
    setInitialValues({
      id: section?._id,
      page_id: section?.page_id,
      uniqueKey: section?.uniqueKey,
      name: section?.name,
      aspect_ratio: section?.aspect_ratio,
      allowed_types: section?.allowed_types || [],
      content_types: section?.content_types,
    });
    setErrors({});
    setFormType("edit");
    setShow(true);
  };

  const deleteData = async (event) => {
    const { isConfirmed } = await MySwal.fire({
      title: "Are you sure?",
      text: "This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (isConfirmed) {
      const { id } = JSON.parse(event.target.attributes.get("data").value);
      const { data } = await AxiosHelper.deleteData(`section/${id}`);
      if (data?.status) {
        getSectionData();
        toast.success("Deleted successfully.");
      } else {
        toast.error(data?.message);
      }
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
              <div className="col-auto"><h5>Section Management</h5></div>
              <div className="col-auto">
                <Link to="/dashboard" className="btn btn-sm btn-falcon-default me-2">
                  <i className="bi bi-house"></i> Dashboard
                </Link>
                <button
                  onClick={() => {
                    setInitialValues({
                      id: "",
                      page_id: "",
                      uniqueKey: "",
                      name: "",
                      aspect_ratio: "",
                      allowed_types: [],
                      content_types: "",
                    });
                    setFormType("add");
                    setShow(true);
                  }}
                  className="btn btn-sm btn-falcon-orange"
                >
                  <i className="bi bi-plus"></i> Add Section
                </button>
              </div>
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="row justify-content-between mb-3">
              <div className="col-md-6 d-flex">
                <span className="pe-2">Select Page</span>
                <select
                  className="w-auto form-select form-select-sm"
                  onChange={(e) =>
                    setParam({ ...param, page_id: e.target.value, pageNo: 1 })
                  }
                >
                  <option value="">All</option>
                  {pages?.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="search"
                  placeholder="Search..."
                  className="form-control form-control-sm"
                  onChange={(e) =>
                    setParam({ ...param, query: e.target.value, pageNo: 1 })
                  }
                />
              </div>
            </div>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Page</th>
                  <th>Unique Key</th>
                  <th>Aspect Ratio</th>
                  <th>Allowed Types</th>
                  <th>Content Types</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.record?.map((row) => (
                  <tr key={row._id}>
                    <td>{row.name}</td>
                    <td>{pages.find((p) => p._id === row.page_id)?.name || "-"}</td>
                    <td>{row.uniqueKey}</td>
                    <td>{row.aspect_ratio}</td>
                    <td>{row.allowed_types?.join(", ")}</td>
                    <td>{row.content_types?.join(", ")}</td>
                    <td><Action dropList={dropList} data={row} /></td>
                  </tr>
                ))}
                {data.record?.length === 0 && (
                  <tr><td colSpan="100" className="text-center">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal show={show} onHide={() => setShow(false)} size="lg">
          <Modal.Header>
            <Modal.Title>{ucFirst(formType)} Section</Modal.Title>
            <CloseButton onClick={() => setShow(false)} />
          </Modal.Header>
          <Modal.Body>
            <MyForm
              fields={fields}
              initialValues={initialValues}
              validSchema={validSchema}
              errors={errors}
              setErrors={setErrors}
              onSubmit={async (values) => {
                const api = formType === "add" ? "section/create" : `section/${values.id}`;
                const method = formType === "add" ? "postData" : "putData";
                const { data } = await AxiosHelper[method](api, values);

                if (data?.status) {
                  getSectionData();
                  toast.success("Section saved successfully.");
                  setShow(false);
                } else {
                  toast.error(data?.message);
                  setErrors(data.errors || {});
                }
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default SectionManagement;
