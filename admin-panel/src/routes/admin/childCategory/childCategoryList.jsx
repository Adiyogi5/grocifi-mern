import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosHelper from "../../../helper/AxiosHelper";
import Swal from "sweetalert2";
import { getDeleteConfig, ucFirst } from "../../../helper/StringHelper";
import Status from "../../../components/Table/Status";
import Action from "../../../components/Table/Action";
import { CloseButton, Modal } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Featured from "../../../components/Featured";
import PermissionBlock from "../../../components/PermissionBlock";
import { toast } from "react-toastify";
import useRowSelection from "../../../helper/helperFunctions";

const sweetAlert = withReactContent(Swal);

const childCategoryList = () => {
  const table = "categories";

  const navigate = useNavigate();
  const [data, setData] = useState({
    count: 0,
    record: [],
    totalPages: 0,
    pagination: [],
  });
  const [showView, setShowView] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    pageNo: 1,
    query: "",
    orderBy: "createdAt",
    child_category: true,
    orderDirection: -1,
  });
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

  //   --------------GET ALL CHILD CATEGORIES---------------
  const getDataForTable = useCallback(async () => {
    try {
      const { data } = await AxiosHelper.getData("category-datatable", params);

      if (data.status) {
        let { count, record, totalPages, pagination } = data?.data;
        console.log("Child Category Data: ", record);
        setData({ count, record, totalPages, pagination });
      } else {
      }
    } catch (error) {
      console.log(
        "Error occurred while fetching child categories data: ",
        error
      );
    }
  }, [params]);
  //   console.log("CHILD CATEGORY: ", data);
  // -----------------SORT BY NAME AND ORDER-------------------------
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
  useEffect(() => {
    getDataForTable();
  }, [params]);

  /////////handle page change//////////
  const handelPageChange = (pageNo) => {
    setParams({ ...params, pageNo });
  };

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

  //-----------------------Possible Actions--------------------------
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
        navigate(`/admin/child_category/edit/${data.slug}`);
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

  const {
    selectedRows,
    toggleRowSelection,
    toggleSelectAll,
    handleMultipleDelete,
    selectAll,
  } = useRowSelection({ table, getDataForTable });

  return (
    <div className="container p-3 rounded bg-white">
      <div className="row mb-3">
        <div className="col">
          <h5 className="mb-0" data-anchor="data-anchor">
            Child Category
          </h5>
        </div>
        <div className="col-auto">
          <Link
            to={`/admin/dashboard`}
            className="me-2 btn btn-sm btn-falcon-default"
          >
            <i className="fa fa-home me-1"></i>
            <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
          </Link>
          <PermissionBlock module={"Role"} action={"add"}>
            <Link to={`/admin/child_category/add`}>
              <button className="btn btn-sm btn-falcon-default">
                <i className="fa fa-plus me-1"></i>
                Add Child Category
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
      <div className="row mb-3 justify-content-between">
        <div className="col d-flex gap-2">
          <span className="pe-2">Show</span>
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
          <span className="ps-1">entries</span>
        </div>
        <div className="col-auto d-flex">
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
      <div className="table-responsive" data-list="">
        <table className="table table-striped table-bordered fs--1 mb-0">
          <thead className="bg-200 text-900">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => toggleSelectAll(data.record)}
                />
              </th>
              <th className="p-1">Image</th>
              <th
                onClick={handleSort}
                className={`sort ${params.orderBy === "name" &&
                  (params.orderDirection === 1 ? "asc" : "desc")
                  } p-1`}
                data-sort="name"
              >
                Name
              </th>
              <th
                onClick={handleSort}
                className={`sort ${params.orderBy === "sort_order" &&
                  (params.orderDirection === 1 ? "asc" : "desc")
                  } p-1`}
                data-sort="sort_order"
              >
                Sort Order
              </th>
              <th className="p-1">Status</th>
              <th className="p-1">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.record.length !== 0 ? (
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
                    {item?.parent?.superCategory?.name
                      ? item.parent.superCategory.name + " >> "
                      : ""}
                    {item?.parent?.name ? item.parent.name + " >> " : ""}
                    {item?.name}
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

export default childCategoryList;
