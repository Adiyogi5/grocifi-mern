import React, { useState, useEffect, useCallback } from "react";
import PermissionBlock from "../../../components/PermissionBlock";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CloseButton, Modal } from "react-bootstrap";
import Featured from "../../../components/Featured";
import Action from "../../../components/Table/Action";
import Status from "../../../components/Table/Status";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AxiosHelper from "../../../helper/AxiosHelper";
import { getDeleteConfig } from "../../../helper/StringHelper";
import useRowSelection from "../../../helper/helperFunctions";

const sweetAlert = withReactContent(Swal);

const subCategoryList = () => {
  const table = "categories";

  const navigate = useNavigate();
  const [params, setParams] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    orderDirection: -1,
    subcategory: true,
  });
  const [data, setData] = useState({
    count: 0,
    record: [],
    totalPages: 0,
    pagination: [],
  });
  const [showView, setShowView] = useState(false);
  const [initialValues, setInitialValues] = useState({
    slug: "",
    name: "",
    parent: null,
    description: "",
    is_feature: false,
    meta_title: "",
    meta_keyword: "",
    meta_description: "",
    sort_order: 0,
    ancestors: [],
    createdAt: "",
    status: true,
    image: "",
    icon: ""
  });

  /////////////Fetching Data for table/////////////////
  const getDataForTable = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData("category-datatable", params);
      if (data.status) {
        let { count, record, totalPages, pagination } = data?.data;
        setData({ count, record, totalPages, pagination });
      } else {
        console.log("RESPONSE NOT FETCHED SUB CATEGORIES.");
      }
    } catch (error) {
      console.log("Error occurred while fetching sub categories data: ", error);
    }
  }, [params]);
  // console.log("RESPONSE SUB CATEGORIES: ", data);

  ////////////////Handle Sorting//////////////////
  function handleSort(e) {
    const orderBy = e.target.attributes.getNamedItem("data-sort").value;
    if (params.orderBy !== orderBy) {
      setParams({ ...params, orderBy });
    } else {
      setParams({
        ...params,
        orderDirection: params?.orderDirection === 1 ? -1 : 1,
      });
    }
  }
  // console.log(params);
  ///////////View Modal on click///////////

  const viewData = async (e) => {
    const data = JSON.parse(
      e.target.attributes.getNamedItem("main-data").value
    );
    setInitialValues(data);
    setShowView(true);
  };

  //////////////Delete Data///////////////////
  const deleteData = async (event) => {
    var { isConfirmed } = await sweetAlert.fire(getDeleteConfig({}));
    if (isConfirmed) {
      var { _id } = JSON.parse(event.target.attributes.getNamedItem("main-data").value);

      var { data } = await AxiosHelper.deleteData(`delete-record/categories/${_id}`);
      if (data?.status === true) {
        getDataForTable();
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    }
  };

  // Actions drop down
  const dropList = [
    {
      name: "View",
      module_id: "Category",
      onClick: viewData,
    },
    {
      name: "Edit",
      module_id: "Category",
      action: "edit",
      onClick: (event) => {
        var data = JSON.parse(
          event.target.attributes.getNamedItem("main-data").value
        );
        navigate(`/admin/subcategory/edit/${data.slug}`);
      },
    },
    {
      name: "Delete",
      module_id: "Category",
      action: "delete",
      onClick: deleteData,
      className: "text-danger",
    },
  ];

  /////////handle page change//////////
  const handelPageChange = (pageNo) => {
    setParams({ ...params, pageNo });
  };

  //   console.log(params);
  //   console.log(data);
  useEffect(() => {
    getDataForTable();
  }, [params]);

  const {
    selectedRows,
    toggleRowSelection,
    toggleSelectAll,
    handleMultipleDelete,
    selectAll,
  } = useRowSelection({ table, getDataForTable });

  return (
    <div className="container bg-white p-3 rounded">
      <div className="row mb-2">
        <div className="col">
          <h5>Sub Categories</h5>
        </div>
        <div className="col-5 d-flex justify-content-end gap-2">
          <Link to={`/admin/dashboard`}>
            <button className="btn btn-sm btn-falcon-default">
              <i className="fa fa-home me-1"></i>
              Dashboard
            </button>
          </Link>
          <PermissionBlock module={"Role"} action={"add"}>
            <Link to={"/admin/subcategory/add"}>
              <button className="btn btn-sm btn-falcon-default">
                <i className="fa fa-plus me-1"></i>
                Add Sub Category
              </button>
            </Link>
          </PermissionBlock>
          {selectedRows.length > 0 && (
            <button
              onClick={handleMultipleDelete}
              className="btn btn-sm btn-danger mx-2"
            >
              <i className="bi bi-trash"></i> Delete Selected (
              {selectedRows.length})
            </button>
          )}
        </div>
      </div>
      <div className="row justify-content-between mb-2">
        <div className="col-md-6 d-flex gap-2">
          <span>Show</span>
          <select
            className="w-auto form-select form-select-sm"
            onChange={(e) => setParams({ ...params, limit: e.target.value })}
          >
            {[10, 20, 50].map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span>Entries</span>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="input-group">
            <input
              placeholder="Search..."
              onChange={(e) =>
                setParams({ ...params, query: e.target.value, pageNo: 1 })
              }
              type="search"
              id="search"
              className="shadow-none form-control form-control-sm"
            />
            <span className="bg-transparent input-group-text">
              <div className="fa fa-search text-primary"></div>
            </span>
          </div>
        </div>
      </div>
      <div className="table-responsive" data-list="">
        <table className="table table-bordered table-striped fs--1 mb-0">
          <thead className="bg-200 text-900">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => toggleSelectAll(data.record)}
                />
              </th>
              <th>Image</th>
              <th
                onClick={handleSort}
                className={`sort ${params.orderBy === "name" &&
                  (params.orderDirection === 1 ? "asc" : "desc")
                  }`}
                data-sort="name"
              >
                Name
              </th>
              <th
                onClick={handleSort}
                className={`sort ${params.orderBy === "sort_order" &&
                  (params.orderDirection === 1 ? "asc" : "desc")
                  }`}
                data-sort="sort_order"
              >
                Sort Order
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.record ? (
              data?.record.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id)}
                      onChange={() => toggleRowSelection(item._id)}
                    />
                  </td>
                  <td className="cover">
                    <img
                      src={item.icon}
                      data-dz-thumbnail="data-dz-thumbnail"
                      alt=""
                      className="img-fluid"
                      style={{ objectFit: "contain" }}
                      width={100}
                      height={100}
                    />
                    <Featured
                      Classes="position-absolute top-0 start-0"
                      status={item.is_feature}
                    ></Featured>
                  </td>
                  <td
                    main-data={JSON.stringify(item)}
                    onClick={viewData}
                    className="cursor-pointer fw-bold text-primary"
                  >
                    {item?.parent ? item.parent.name + " >> " : ""} {item.name}
                  </td>
                  <td>{item.sort_order}</td>
                  <td>
                    <Status
                      table="categories"
                      status={item.status}
                      data_id={item._id}
                    />
                  </td>
                  <td>
                    <Action dropList={dropList} data={item} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100" className="text-danger text-center">
                  No data available..
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="row align-items-center mt-3">
        <div className="col">
          <span>
            {(params.pageNo - 1) * (params.limit + 1)} to{" "}
            {params.pageNo * params.limit > data?.count
              ? data.count
              : params.pageNo * params.limit}{" "}
            of {data?.count}
          </span>
        </div>
        <div className="col-auto d-flex items-center">
          <button
            type="button"
            dd="disabled"
            className=" btn btn-falcon-default btn-sm"
            onClick={() => handelPageChange(1)}
          >
            <span className="fas fa-chevron-left" />
          </button>
          <ul className="pagination mb-0 mx-1">
            {data?.pagination.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handelPageChange(item)}
                  type="button"
                  className={`page me-1 btn btn-sm ${item === data?.pageNo ? "btn-primary" : "btn-falcon-default"
                    }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-falcon-default btn-sm"
            onClick={() => handelPageChange(data?.totalPages)}
          >
            <span className="fas fa-chevron-right" />
          </button>
        </div>
      </div>
      <Modal
        size="lg"
        show={showView}
        centered={true}
        onHide={() => setShowView(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Category
          </Modal.Title>
          <CloseButton onClick={() => setShowView(false)} />
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            <li className="list-group-item text-center">
              <img
                src={initialValues?.image}
                alt="Thumbnail"
                className="img-fluid"
                width={250}
              />
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Name</label>
              <span className="fs--1">{initialValues?.name}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">parent</label>
              <span className="fs--1">{initialValues?.parent?.name}</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Description</label>
              <span className="fs--1 text-muted ps-3">
                {initialValues?.description}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <label className="fs--1 mb-0">Status</label>
              <Status
                table="categories"
                status={initialValues.status}
                data_id={initialValues._id}
              />
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default subCategoryList;
