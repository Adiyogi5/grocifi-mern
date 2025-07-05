import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AxiosHelper from "../../helper/AxiosHelper";
import { FILE_SIZE, SUPPORTED_FORMATS_IMAGE } from "../../constant/fromConfig";
import MyForm from "../../components/MyForm";

const GeneralSettings = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    fields: [],
    initialValues: {},
    validFields: {},
  });

  useEffect(() => {
    (async () => {
      var { data } = await AxiosHelper.getData(`settings-list/${type}`);
      if (data?.status === true) {
        data = data?.data;
        var initialValues = {};
        var validFields = {};
        var fields = [];

        data?.forEach((element) => {
          if (element.field_type === "file") {
            initialValues[element.field_name] = element.field_value || "";
          } else if (element.field_type === "check") {
            initialValues[element.field_name] = parseInt(
              element.field_value || ""
            );
          } else if (element.field_type === "submit") {
            initialValues[element.field_name] = "submit";
          } else {
            initialValues[element.field_name] = element.field_value || "";
          }

          // ***********************************
          if (element.setting_type != 3) {
            if (element.field_type !== "file") {
              validFields[element.field_name] = Yup.string()
                .min(1)
                .max(5000)
                .required();
            } else {
              validFields[element.field_name] = Yup.mixed()
                .test("fileSize", "File too large", (value) => {
                  if (value && typeof value !== "string")
                    return value.size <= FILE_SIZE;
                  return true;
                })
            }
          }
          // ***********************************
          fields.push({
            label: element.field_label,
            name: element.field_name,
            type: element.field_type,
            col: 6,
          });
        });

        fields.push({
          label: "Update Setting",
          name: "submit",
          type: "submit",
        });

        setValues({ fields, initialValues, validFields });
      } else {
        navigate("admin/dashboard");
        toast.error(data?.message);
      }
    })();
  }, [type]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="row flex-between-end">
          <div className="col-auto align-self-center">
            <h5 className="mb-0" data-anchor="data-anchor" id="table-example">
              Application Settings
            </h5>
          </div>
          <div className="col-auto ms-auto">
            <Link
              to={`/admin/dashboard`}
              className="me-2 btn btn-falcon-default btn-sm"
            >
              <i className="fa fa-home me-1"></i>
              <span className="d-none d-sm-inline-block ms-1">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="card-body overflow-hidden pt-0">
        <MyForm
          validSchema={Yup.object().shape(values.validFields)}
          fields={values.fields}
          initialValues={values.initialValues}
          onSubmit={async (newValues) => {
            var { data } = await AxiosHelper.putData(
              `update-settings?type=${type}`,
              newValues,
              true
            );
            if (data?.status === true) {
              toast.success(data?.message);
            } else {
              toast.error(data?.message);
            }
          }}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
