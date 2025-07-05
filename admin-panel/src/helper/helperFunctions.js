import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import AxiosHelper from "./AxiosHelper";
import { getDeleteConfig } from "./StringHelper";
import { useState } from "react";

const MySwal = withReactContent(Swal);

export const deleteDataFunc = async (event, table, func) => {
  var { isConfirmed } = await MySwal.fire(getDeleteConfig({}));

  if (isConfirmed) {
    const mainDataAttr =
      event.target.attributes.getNamedItem("main-data").value;
    const parsedData = JSON.parse(mainDataAttr);
    const id = parsedData._id;
    var { data } = await AxiosHelper.deleteData(`delete-record/${table}/${id}`);
    if (data?.status === true) {
      func();
      toast.success(data?.message);
    } else {
      toast.error(data?.message);
    }
  }
};

const useRowSelection = ({ table, getDataForTable }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (data) => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data?.map((row) => row._id));
    }
    setSelectAll(!selectAll);
  };

  const handleMultipleDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one record to delete");
      return;
    }

    const { isConfirmed } = await MySwal.fire(
      getDeleteConfig({
        title: `Delete ${selectedRows.length} records?`,
        text: "This action cannot be undone!",
      })
    );

    if (isConfirmed) {
      try {
        const { data } = await AxiosHelper.postData(
          `delete-multiple/${table}`,
          { ids: selectedRows }
        );
        if (data?.status) {
          getDataForTable();
          setSelectedRows([]);
          setSelectAll(false);
          toast.success(data.message);
        } else {
          toast.error(data?.message || "Failed to delete records");
        }
      } catch (error) {
        toast.error("Error deleting records");
        console.error("Multiple delete error:", error);
      }
    }
  };

  return {
    selectedRows,
    selectAll,
    toggleRowSelection,
    toggleSelectAll,
    handleMultipleDelete,
    setSelectedRows,
    setSelectAll,
  };
};

export default useRowSelection;
