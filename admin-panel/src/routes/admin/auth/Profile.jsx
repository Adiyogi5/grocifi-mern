import * as Yup from "yup";
import { toast } from "react-toastify";
import AxiosHelper from "../../../helper/AxiosHelper";
import { FILE_SIZE, PHONE_REG_EXP } from "../../../constant/fromConfig";
import MyForm from "../../../components/MyForm";
import ChangePass from "./ChangePass";
import { updateAdmin } from "../../../redux/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((store) => store.admin);

  const validSchema = Yup.object().shape({
    fname: Yup.string().min(2).max(50).required("First name is required"),
    lname: Yup.string().min(2).max(50).required("Last name is required"),
    phone_no: Yup.string().required().matches(PHONE_REG_EXP, "Phone number is not valid"),
    email: Yup.string().min(2).max(50).email().required(),
    image: Yup.mixed().test("fileSize", "File too large", (value) => {
      if (value && typeof value !== "string") return value.size <= FILE_SIZE;
      return true;
    }),
  });

  const fields = [
    {
      label: "First Name",
      col: 6,
      name: "fname",
      type: "text",
    },
    {
      label: "Last Name",
      col: 6,
      name: "lname",
      type: "text",
    },
    {
      label: "Phone No",
      col: 6,
      name: "phone_no",
      type: "text",
    },
    {
      label: "Email",
      col: 6,
      name: "email",
      type: "email",
    },
    // {
    //   label: "Profile",
    //   col: 6,
    //   name: "image",
    //   type: "file",
    // },
    {
      label: "Update",
      col: 12,
      name: "submit",
      type: "submit",
    },
  ];

  const updateImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size >= FILE_SIZE) {
      toast.error("Image File is too large.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const { data } = await AxiosHelper.postData("change-profile-image", formData, true);
    if (data?.status === true) {
      dispatch(updateAdmin(data?.data?.user));
      toast.success(data?.message);
    } else {
      toast.error(data?.message);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card mb-3 btn-reveal-trigger">
          <div className="card-header position-relative min-vh-25 mb-8">
            <div className="cover-image">
              <div
                className="bg-holder rounded-3 rounded-bottom-0 bg-success"
                style={{ backgroundImage: "url(../../assets/img/generic/4.jpg)" }}
              />
            </div>
            <div className="avatar avatar-5xl avatar-profile shadow-sm img-thumbnail rounded-circle">
              <div className="h-100 w-100 rounded-circle overflow-hidden position-relative">
                <img
                  src={profile?.img ? profile?.img : "/user.svg"}
                  alt="avatar"
                  width={200}
                />
                <input className="d-none" id="profile-image" type="file" onChange={updateImage} />
                <label className="mb-0 overlay-icon d-flex flex-center" htmlFor="profile-image">
                  <span className="bg-holder overlay overlay-0" />
                  <span className="z-index-1 text-white text-center fs--1">
                    <span className="fas fa-camera"></span>
                    <span className="d-block">Update</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5>Profile Settings</h5>
          </div>
          <div className="card-body overflow-hidden pt-0">
            <MyForm
              fields={fields}
              initialValues={{
                fname: profile?.fname || "",
                lname: profile?.lname || "",
                phone_no: profile?.phone_no || "",
                email: profile?.email || "",
                img: profile?.img || "",
              }}
              validSchema={validSchema}
              onSubmit={async (values) => {
                const formData = new FormData();
                formData.append("fname", values.fname);
                formData.append("lname", values.lname);
                formData.append("phone_no", values.phone_no);
                formData.append("email", values.email);
                if (values.img && typeof values.img !== "string") {
                  formData.append("img", values.img);
                }

                const { data } = await AxiosHelper.postData("update-profile", formData, true);
                if (data?.status === true) {
                  dispatch(updateAdmin(data?.data?.user));
                  toast.success(data?.message);
                } else {
                  toast.error(data?.message);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <ChangePass />
      </div>
    </div>
  );
};

export default Profile;
