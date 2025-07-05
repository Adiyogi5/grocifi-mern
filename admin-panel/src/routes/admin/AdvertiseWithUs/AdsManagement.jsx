// import React, { useState, useEffect, useCallback } from "react";
// import { Modal, CloseButton } from "react-bootstrap";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import AxiosHelper from "../../../helper/AxiosHelper";
// import MyForm from "../../../components/MyForm";
// import Action from "../../../components/Table/Action";
// import Status from "../../../components/Table/Status";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { ucFirst } from "../../../helper/StringHelper";
// import { fetchUsers, fetchCategories, fetchCountries, fetchStates, fetchCities } from "../../../helper/ApiService";

// const MySwal = withReactContent(Swal);

// const AdminAdvertiseManagement = () => {
//     const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
//     const [show, setShow] = useState(false);
//     const [formType, setFormType] = useState("add");
//     const [errors, setErrors] = useState({});
//     const [param, setParam] = useState({
//         limit: 10,
//         pageNo: 1,
//         query: "",
//         orderBy: "createdAt",
//         orderDirection: -1,
//         type: "all",
//     });
//     const [pages, setPages] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [tags, setTags] = useState([]);
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [aspectRatios, setAspectRatios] = useState([]);
//     const [initialValues, setInitialValues] = useState({
//         id: "",
//         type: "",
//         user_id: "",
//         title: "",
//         description: "",
//         content_type: "",
//         page_ids: [],
//         duration: "",
//         categories: [],
//         tags: [],
//         locations: [],
//         country_id: "",
//         state_id: "",
//         city_id: "",
//         aspect_ratio: "",
//         link: "",
//         videolink: "",
//         image: null,
//         video: null,
//         image_url: "",
//         video_url: "",
//     });

//     // Fetch table data
//     const getDataForTable = useCallback(async () => {
//         try {
//             const { data } = await AxiosHelper.getData("advertise/list", param);
//             if (data?.status) {
//                 setData(data.data || { count: 0, record: [], totalPages: 0, pagination: [] });
//             } else {
//                 toast.error(data?.message || "Failed to fetch advertisements.");
//             }
//         } catch (error) {
//             console.error("Error fetching ads:", error);
//             toast.error("Error fetching advertisements.");
//         }
//     }, [param]);

//     // Fetch supporting data
//     const fetchPages = async () => {
//         try {
//             const { data } = await AxiosHelper.getData("ads-page");
//             if (data?.status) {
//                 setPages(data.data.record || []);
//             }
//         } catch (error) {
//             console.error("Error fetching pages:", error);
//             toast.error("Failed to fetch pages.");
//         }
//     };

//     const fetchTags = async () => {
//         try {
//             const { data } = await AxiosHelper.getData("taglist");
//             if (data?.status) {
//                 setTags(data.data || []);
//             }
//         } catch (error) {
//             console.error("Error fetching tags:", error);
//             toast.error("Failed to fetch tags.");
//         }
//     };

//     const fetchAspectRatios = async (contentType, pageIds) => {
//         if (!contentType || !pageIds?.length) {
//             setAspectRatios([]);
//             return;
//         }
//         try {
//             const { data } = await AxiosHelper.getData(
//                 `/aspect-ratios-by-pages?content_type=${contentType}&page_ids=${pageIds.join(
//                     ","
//                 )}`
//             );
//             if (data?.status) {
//                 setAspectRatios(data.data || []);
//             }
//         } catch (error) {
//             console.error("Error fetching aspect ratios:", error);
//             toast.error("Failed to fetch aspect ratios.");
//         }
//     };

//     useEffect(() => {
//         getDataForTable();
//         fetchPages();
//         fetchTags();
//         fetchUsers().then((data) => setUsers(data.map(u => ({ id: u._id, name: u.name || u.email }))));
//         fetchCategories().then((data) => setCategories(data));
//         fetchCountries().then((data) => setCountries(data.map(c => ({ id: c.id, name: c.name }))));
//     }, [getDataForTable]);

//     // Handle sorting
//     const handleSort = (event) => {
//         const orderBy = event.target.attributes.getNamedItem("data-sort").value;
//         setParam((prev) => ({
//             ...prev,
//             orderBy,
//             orderDirection: prev.orderBy === orderBy ? prev.orderDirection * -1 : -1,
//         }));
//     };

//     // Handle pagination
//     const handlePageChange = (pageNo) => {
//         setParam((prev) => ({ ...prev, pageNo }));
//     };

//     // Validation schema
//     // const validSchema = Yup.object().shape({
//     //     user_id: Yup.string().required("User is required"),
//     //     title: Yup.string().max(100, "Title must be at most 100 characters"),
//     //     description: Yup.string().max(500, "Description must be at most 500 characters"),
//     //     content_type: Yup.string().required("Content type is required"),
//     //     page_ids: Yup.array().min(1, "At least one page is required"),
//     //     duration: Yup.number().oneOf([30, 90, 180, 365], "Invalid duration").required("Duration is required"),
//     //     categories: Yup.array(),
//     //     tags: Yup.array(),
//     //     locations: Yup.array(),
//     //     country_id: Yup.string().optional(),
//     //     state_id: Yup.string().optional(),
//     //     city_id: Yup.string().optional(),
//     //     aspect_ratio: Yup.string().required("Aspect ratio is required"),
//     //     link: Yup.string().url("Invalid URL").required("Link is required"),
//     //     videolink: Yup.string().url("Invalid video link").when("content_type", {
//     //         is: "video",
//     //         then: Yup.string().optional(),
//     //     }),
//     //     image: Yup.mixed().when("content_type", {
//     //         is: "image",
//     //         then: Yup.mixed().test("image-required", "Image is required", (value) => formType === "edit" || !!value),
//     //     }),
//     //     video: Yup.mixed().when("content_type", {
//     //         is: "video",
//     //         then: Yup.mixed().optional(),
//     //     }),
//     // });



// const validSchema = (formType) => Yup.object().shape({
//   id: Yup.string(),
//   type: Yup.string()
//     .required("Type is required")
//     .oneOf(['user', 'admin', 'google'], "Invalid type"),

//   user_id: Yup.string()
//     .when('type', ([type], schema) => 
//       type === 'user' 
//         ? schema.required("User is required") 
//         : schema.nullable()
//     ),

//   title: Yup.string()
//     .max(100, "Title must be at most 100 characters")
//     .nullable(),

//   description: Yup.string()
//     .max(500, "Description must be at most 500 characters")
//     .nullable(),

//   content_type: Yup.string()
//     .when('type', ([type], schema) => 
//       ['user', 'admin'].includes(type) 
//         ? schema
//             .required("Content type is required")
//             .oneOf(['image', 'video'], "Invalid content type")
//         : schema.nullable()
//     ),

//   page_ids: Yup.array()
//     .min(1, "At least one page is required")
//     .required("Pages are required"),

//   duration: Yup.number()
//     .oneOf([30, 90, 180, 365], "Invalid duration")
//     .required("Duration is required"),

//   categories: Yup.array().nullable(),
//   tags: Yup.array().nullable(),
//   locations: Yup.array().nullable(),

//   country_id: Yup.number().nullable(),
//   state_id: Yup.number().nullable(),
//   city_id: Yup.number().nullable(),

//   aspect_ratio: Yup.string()
//     .when('type', ([type], schema) => 
//       ['user', 'admin'].includes(type) 
//         ? schema.required("Aspect ratio is required") 
//         : schema.nullable()
//     ),

//   link: Yup.string()
//     .required("Link is required"),

//   videolink: Yup.string()
//     .when(
//       ['content_type', 'type'], 
//       ([content_type, type], schema) => 
//         content_type === 'video' && ['user', 'admin'].includes(type)
//           ? schema.url("Invalid video URL").nullable()
//           : schema.nullable()
//     ),

//   google_ad_code: Yup.string()
//     .when('type', ([type], schema) => 
//       type === 'google' 
//         ? schema.required("Google Ad code is required") 
//         : schema.nullable()
//     ),

// });


//     // Form fields
//     const fields = [
//         {
//             label: "Type",
//             name: "type",
//             type: "select2",
//             options: [
//                 { id: "user", name: "User" },
//                 { id: "admin", name: "Admin" },
//                 { id: "google", name: "Google" },
//             ],
//             onChangeCustom: (selected) => {
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     type: selected?.id || "",
//                     user_id: null
//                 }));
//             },
//             col: 6,
//         },
//         ...(initialValues.type == "user"
//             ? [{
//                 label: "Select User",
//                 name: "user_id",
//                 type: "select2",
//                 options: users,
//                 col: 6,
//             }]
//             : []
//         ),
//         {
//             label: "Content Type",
//             name: "content_type",
//             type: "select2",
//             options: [
//                 { id: "image", name: "Image" },
//                 { id: "video", name: "Video" },
//             ],
//             onChangeCustom: (selected) => {
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     content_type: selected?.id || "",
//                     image: null,
//                     video: null,
//                     videolink: "",
//                     aspect_ratio: ""
//                 }));

//                 if (initialValues.page_ids.length) {
//                     fetchAspectRatios(selected.id, initialValues.page_ids);
//                 }
//             },
//             col: 6,
//         },
//         {
//             label: "Pages",
//             name: "page_ids",
//             type: "select-multiple",
//             options: pages.map((p) => ({ id: p._id, name: p.name })),
//             multiple: true,
//             onChangeCustom: (selected) => {
//                 const pageIds = selected.map((s) => s.id);
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     page_ids: pageIds,
//                     aspect_ratio: ""
//                 }));

//                 if (initialValues.content_type) {
//                     fetchAspectRatios(initialValues.content_type, pageIds);
//                 }
//             },
//             col: 6,
//         },
//         {
//             label: "Duration",
//             name: "duration",
//             type: "select2",
//             options: [
//                 { id: 30, name: "30 Days" },
//                 { id: 90, name: "90 Days" },
//                 { id: 180, name: "180 Days" },
//                 { id: 365, name: "365 Days" },
//             ],
//             col: 6,
//         },
//         {
//             label: "Categories",
//             name: "categories",
//             type: "select-multiple",
//             options: categories.map((c) => ({ id: c._id, name: c.name })),
//             multiple: true,
//             col: 6,
//         },
//         {
//             label: "Tags",
//             name: "tags",
//             type: "select-multiple",
//             options: tags.map((t) => ({ id: t._id, name: t.name })),
//             multiple: true,
//             col: 6,
//         },
//         {
//             label: "Country",
//             name: "country_id",
//             type: "select2",
//             options: countries,
//             onChangeCustom: (selected) => {
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     country_id: selected?.id || "",
//                     state_id: "",
//                     city_id: ""
//                 }));
//                 if (selected?.id) {
//                     fetchStates(selected.id).then((data) => setStates(data.map(s => ({ id: s.id, name: s.name }))));
//                 } else {
//                     setStates([]);
//                     setCities([]);
//                 }
//             },
//             col: 4,
//         },
//         {
//             label: "State",
//             name: "state_id",
//             type: "select2",
//             options: states,
//             onChangeCustom: (selected) => {
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     state_id: selected?.id,
//                     city_id: ""
//                 }));
//                 if (selected?.id) {
//                     fetchCities(selected.id).then((data) => setCities(data.map(c => ({ id: c.id, name: c.name }))));
//                 } else {
//                     setCities([]);
//                 }
//             },
//             col: 4,
//         },
//         {
//             label: "City",
//             name: "city_id",
//             type: "select2",
//             options: cities,
//             onChangeCustom: (selected, setFieldValue) => {
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     city_id: selected?.id,
//                 }));
//             },
//             col: 4,
//         },
//         {
//             label: "Add Location",
//             name: "add_location",
//             type: "submit",
//             onClick: (values, setFieldValue) => {
//                 if (!initialValues.country_id) {
//                     toast.error("Select a country.");
//                     return;
//                 }
//                 const newLocation = {
//                     country_id: initialValues.country_id,
//                     country_name: countries.find((c) => c.id === initialValues.country_id)?.name || "",
//                     state_id: initialValues.state_id || null,
//                     state_name: states.find((s) => s.id === initialValues.state_id)?.name || null,
//                     city_id: initialValues.city_id || null,
//                     city_name: cities.find((c) => c.id === initialValues.city_id)?.name || null,
//                 };
//                 // Prevent duplicate locations
//                 const isDuplicate = (initialValues.locations || []).some(
//                     (loc) =>
//                         loc.country_id === newLocation.country_id &&
//                         loc.state_id === newLocation.state_id &&
//                         loc.city_id === newLocation.city_id
//                 );
//                 if (isDuplicate) {
//                     toast.error("Location already added.");
//                     return;
//                 }
//                 const updatedLocations = [...(initialValues.locations || []), newLocation];
//                 setInitialValues((prev) => ({
//                     ...prev,
//                     locations: updatedLocations,
//                     country_id: "",
//                     state_id: "",
//                     city_id: ""
//                 }));
//                 setStates([]);
//                 setCities([]);
//             },
//             col: 12,
//         },
//         {
//             label: "Selected Locations",
//             name: "locations_display",
//             type: "custom",
//             render: (values, setFieldValue) => (
//                 <div>
//                     {initialValues.locations?.length ? (
//                         <ul>
//                             {initialValues.locations.map((loc, index) => (
//                                 <li key={index}>
//                                     {loc.country_name}
//                                     {loc.state_name ? ` > ${loc.state_name}` : ""}
//                                     {loc.city_name ? ` > ${loc.city_name}` : ""}
//                                     <button
//                                         type="button"
//                                         className="btn btn-link text-danger btn-sm"
//                                         onClick={() => {
//                                             const updatedLocations = initialValues.locations.filter((_, i) => i !== index);
//                                             setInitialValues((prev) => ({
//                                                 ...prev,
//                                                 locations: updatedLocations
//                                             }));
//                                         }}
//                                     >
//                                         Remove
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No locations selected.</p>
//                     )}
//                 </div>
//             ),
//             col: 12,
//         },
//         {
//             label: "Aspect Ratio",
//             name: "aspect_ratio",
//             type: "select2",
//             options: aspectRatios.map((r) => ({ id: r, name: r })),
//             col: 6,
//         },
//         ...(initialValues.type === "google"
//             ? [{
//                 label: "Google Ad Code",
//                 name: "google_ad_code",
//                 type: "text",
//                 col: 6,
//             }]
//             : []
//         ),
//         {
//             label: "Link",
//             name: "link",
//             type: "text",
//             col: 6,
//         },
//         ...(initialValues.content_type === "video"
//             ? [{
//                 label: "Video Link (Optional)",
//                 name: "videolink",
//                 type: "text",
//                 col: 6,
//                 hidden: initialValues.content_type !== "video",
//                 placeholder: "https://youtube.com/watch?v=...",
//             }]
//             : []
//         ),
//         ...(initialValues.content_type === "image"
//             ? [{
//                 label: "Image",
//                 name: "image",
//                 type: "file",
//                 accept: "image/*",
//                 col: 12,
//                 className: "hidden",
//                 hidden: initialValues.content_type !== "image",
//             }]
//             : []
//         ),
//         // {
//         //     label: "Current Image",
//         //     name: "current_image",
//         //     type: "custom",
//         //     render: (values) =>
//         //         formType === "edit" && initialValues.content_type === "image" && initialValues.image_url ? (
//         //             <img src={initialValues.image_url} alt="Ad" style={{ maxWidth: "200px" }} />
//         //         ) : null,
//         //     col: 6,
//         //     hidden: initialValues.content_type !== "image",
//         // },
//         ...(initialValues.content_type === "video"
//             ? [{
//                 label: "Video File (Optional)",
//                 name: "video",
//                 type: "file",
//                 accept: "video/*",
//                 col: 6,
//                 hidden: initialValues.content_type !== "video",
//             }]
//             : []
//         ),
//         // {
//         //     label: "Current Video",
//         //     name: "current_video",
//         //     type: "custom",
//         //     render: (values) =>
//         //         formType === "edit" && values.content_type === "video" && values.video_url ? (
//         //             <video src={values.video_url} controls style={{ maxWidth: "200px" }} />
//         //         ) : null,
//         //     col: 6,
//         //     hidden: initialValues.content_type !== "video",
//         // },
//         {
//             label: "Submit",
//             name: "submit",
//             type: "submit",
//             col: 12,
//         },
//     ];

//     // Edit advertisement
//     const editData = async (event) => {
//         try {
//             const ad = JSON.parse(event.target.getAttribute("main-data"));
//             setInitialValues({
//                 id: ad._id || "",
//                 type: ad?.type || "",
//                 user_id: ad.user_id?._id || "",
//                 title: ad.title || "",
//                 description: ad.description || "",
//                 content_type: ad.content_type || "",
//                 page_ids: ad.pages?.map((p) => p.page_id?._id || p.page_id) || [],
//                 duration: ad.duration || "",
//                 categories: ad.categories?.map((c) => c?._id) || [],
//                 tags: ad.tags || [],
//                 locations: ad.locations?.map((loc) => ({
//                     country_id: loc.country_id,
//                     country_name: loc.country_name || "",
//                     state_id: loc.state_id || null,
//                     state_name: loc.state_name || null,
//                     city_id: loc.city_id || null,
//                     city_name: loc.city_name || null,
//                 })) || [],
//                 country_id: "",
//                 state_id: "",
//                 city_id: "",
//                 aspect_ratio: ad.aspect_ratio || "",
//                 link: ad.link || "",
//                 videolink: ad.videolink || "",
//                 image: null,
//                 video: null,
//                 image_url: ad.image || "",
//                 video_url: ad.video || "",
//             });
//             if (ad.content_type && ad.pages?.length) {
//                 fetchAspectRatios(ad.content_type, ad.pages.map((p) => p.page_id?._id || p.page_id));
//             } else {
//                 setAspectRatios([]);
//             }
//             setErrors({});
//             setFormType("edit");
//             setShow(true);
//         } catch (error) {
//             console.error("Error parsing ad data:", error);
//             toast.error("Failed to load advertisement data.");
//         }
//     };

//     // Delete advertisement
//     const deleteData = async (event) => {
//         try {
//             const { isConfirmed } = await MySwal.fire({
//                 title: "Are you sure?",
//                 text: "You won't be able to revert this!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonText: "Yes, delete it!",
//             });
//             if (isConfirmed) {
//                 const { id } = JSON.parse(event.target.getAttribute("data"));
//                 const { data } = await AxiosHelper.deleteData(`advertise/${id}`);
//                 if (data?.status) {
//                     getDataForTable();
//                     toast.success("Advertisement deleted successfully.");
//                 } else {
//                     toast.error(data?.message || "Failed to delete advertisement.");
//                 }
//             }
//         } catch (error) {
//             console.error("Error deleting ad:", error);
//             toast.error("Error deleting advertisement.");
//         }
//     };

//     const dropList = [
//         { name: "Edit", onClick: editData },
//         { name: "Delete", onClick: deleteData, className: "text-danger" },
//     ];

//     return (
//         <div className="row">
//             <div className="col-md-12">
//                 <div className="card mb-6">
//                     <div className="card-header">
//                         <div className="row flex-between-end">
//                             <div className="col-auto">
//                                 <h5>Manage Advertisements</h5>
//                             </div>
//                             <div className="col-auto">
//                                 <button
//                                     onClick={() => {
//                                         setInitialValues({
//                                             id: "",
//                                             user_id: "",
//                                             title: "",
//                                             description: "",
//                                             content_type: "",
//                                             page_ids: [],
//                                             duration: "",
//                                             categories: [],
//                                             tags: [],
//                                             locations: [],
//                                             country_id: "",
//                                             state_id: "",
//                                             city_id: "",
//                                             aspect_ratio: "",
//                                             link: "",
//                                             videolink: "",
//                                             image: null,
//                                             video: null,
//                                             image_url: "",
//                                             video_url: "",
//                                         });
//                                         setFormType("add");
//                                         setErrors({});
//                                         setAspectRatios([]);
//                                         setStates([]);
//                                         setCities([]);
//                                         setShow(true);
//                                     }}
//                                     className="btn btn-sm btn-falcon-orange"
//                                 >
//                                     <i className="bi bi-plus"></i> Add Advertisement
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="card-body pt-0">
//                         <div className="row justify-content-between mb-3">
//                             <div className="col-md-6 d-flex">
//                                 <span className="pe-2">Show</span>
//                                 <select
//                                     className="w-auto form-select form-select-sm"
//                                     onChange={(e) => setParam((prev) => ({ ...prev, limit: parseInt(e.target.value) }))}
//                                 >
//                                     {[10, 20, 50].map((row) => (
//                                         <option key={row} value={row}>
//                                             {row}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <span className="ps-2">entries</span>
//                                 <select
//                                     className="ms-3 form-select form-select-sm"
//                                     onChange={(e) => setParam((prev) => ({ ...prev, type: e.target.value }))}
//                                 >
//                                     <option value="all">All</option>
//                                     <option value="user">User Ads</option>
//                                     <option value="admin">Admin Ads</option>
//                                 </select>
//                             </div>
//                             <div className="col-md-4">
//                                 <input
//                                     type="search"
//                                     placeholder="Search..."
//                                     className="form-control form-control-sm"
//                                     onChange={(e) =>
//                                         setParam((prev) => ({ ...prev, query: e.target.value, pageNo: 1 }))
//                                     }
//                                 />
//                             </div>
//                         </div>
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th
//                                         onClick={handleSort}
//                                         className={`sort ${param.orderBy === "title" && (param.orderDirection === 1 ? "asc" : "desc")}`}
//                                         data-sort="title"
//                                     >
//                                         Name
//                                     </th>
//                                     <th>User</th>
//                                     <th>Type</th>
//                                     <th>Content Type</th>
//                                     <th>Pages</th>
//                                     <th>Duration</th>
//                                     <th>Price</th>
//                                     <th>Impressions</th>
//                                     <th>Clicks</th>
//                                     <th>Status</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data.record?.length > 0 ? (
//                                     data.record.map((row) => (
//                                         <tr key={row._id}>
//                                             <td>{row.title || row.user_id?.name || "Untitled"}</td>
//                                             <td>{row.user_id?.name || row.user_id?.email || "N/A"}</td>
//                                             <td>{ucFirst(row.type)}</td>
//                                             <td>{ucFirst(row.content_type)}</td>
//                                             <td>{row.pages?.map((p) => p.page_id?.name).filter(Boolean).join(", ")}</td>
//                                             <td>{row.duration} Days</td>
//                                             <td>₹{row.total_price?.toLocaleString()}</td>
//                                             <td>{row.impressions || 0}</td>
//                                             <td>{row.clicks || 0}</td>
//                                             <td>
//                                                 <Status
//                                                     table="advertisements"
//                                                     status={row.payment_status}
//                                                     data_id={row._id}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <Action dropList={dropList} data={row} />
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="11" className="text-center">
//                                             No data available.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                         <div className="row align-items-center mt-3">
//                             <div className="col">
//                                 <p className="mb-0 fs--1">
//                                     Showing {(param.pageNo - 1) * param.limit + 1} to{" "}
//                                     {Math.min(param.pageNo * param.limit, data.count)} of {data.count}
//                                 </p>
//                             </div>
//                             <div className="col-auto">
//                                 <div className="d-flex justify-content-center align-items-center">
//                                     <button
//                                         type="button"
//                                         disabled={param.pageNo === 1}
//                                         className="btn btn-falcon-default btn-sm"
//                                         onClick={() => handlePageChange(1)}
//                                     >
//                                         <span className="fas fa-chevron-left" />
//                                     </button>
//                                     <ul className="pagination mb-0 mx-1">
//                                         {data.pagination?.map((row) => (
//                                             <li key={row}>
//                                                 <button
//                                                     onClick={() => handlePageChange(row)}
//                                                     type="button"
//                                                     className={`page me-1 btn btn-sm ${row === param.pageNo ? "btn-primary" : "btn-falcon-default"}`}
//                                                 >
//                                                     {row}
//                                                 </button>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                     <button
//                                         type="button"
//                                         disabled={param.pageNo === data.totalPages}
//                                         className="btn btn-falcon-default btn-sm"
//                                         onClick={() => handlePageChange(data.totalPages)}
//                                     >
//                                         <span className="fas fa-chevron-right" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <Modal show={show} onHide={() => setShow(false)} size="xl">
//                     <Modal.Header>
//                         <Modal.Title>{ucFirst(formType)} Advertisement</Modal.Title>
//                         <CloseButton onClick={() => setShow(false)} />
//                     </Modal.Header>
//                     <Modal.Body>
//                         <MyForm
//                             key={formType + (initialValues.id || "new")}
//                             errors={(errors) => console.log("errors????", errors)}
//                             onSubmit={async (values) => {
//                                 try {
//                                     const formData = new FormData();
//                                     Object.keys(values).forEach((key) => {
//                                         if (["locations", "page_ids", "categories", "tags"].includes(key)) {
//                                             formData.append(key, JSON.stringify(values[key]));
//                                         } else if (values[key] instanceof File) {
//                                             formData.append(key, values[key]);
//                                         } else if (values[key] && !["image_url", "video_url"].includes(key)) {
//                                             formData.append(key, values[key]);
//                                         }
//                                     });
//                                     const endpoint = formType === "add" ? "advertise/create" : `advertise/update/${values.id}`;
//                                     const method = formType === "add" ? "postData" : "putData";
//                                     const { data } = await AxiosHelper[method](endpoint, formData, true);
//                                     if (data?.status) {
//                                         getDataForTable();
//                                         setShow(false);
//                                         setErrors({});
//                                         toast.success(`Advertisement ${formType === "add" ? "created" : "updated"} successfully.`);
//                                     } else {
//                                         setErrors(data.errors || {});
//                                         toast.error(data?.message || "Failed to save advertisement.");
//                                     }
//                                 } catch (error) {
//                                     console.error("Error saving advertisement:", error);
//                                     toast.error("Error saving advertisement.");
//                                 }
//                             }}
//                             fields={fields}
//                             initialValues={initialValues}
//                             //  validationSchema={advertisementSchema(formType)}
//                             validSchema={validSchema(formType)}
//                             setErrors={setErrors}
//                             setInitialValues={setInitialValues}
//                         />
//                     </Modal.Body>
//                 </Modal>
//             </div>
//         </div>
//     );
// };

// export default AdminAdvertiseManagement;




// src/components/Admin/AdminAdvertiseManagement.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import * as Yup from 'yup';
import { Modal, CloseButton } from "react-bootstrap";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import AxiosHelper from "../../../helper/AxiosHelper";
import Action from "../../../components/Table/Action";
import Status from "../../../components/Table/Status";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ucFirst } from "../../../helper/StringHelper";
import {
    fetchUsers,
    fetchCategories,
    fetchCountries,
    fetchStates,
    fetchCities
} from "../../../helper/ApiService";
import FilePreview from "./FilePreview";
import useRowSelection, { deleteDataFunc } from "../../../helper/helperFunctions";
// import { DeleteDataFunc } from "../../../helper/helperFunctions";

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

export const advertisementSchema = (formType) =>
    Yup.object().shape({
        id: Yup.string().nullable(),

        type: Yup.string()
            .required('Type is required')
            .oneOf(['user', 'admin', 'google'], 'Invalid type'),

        user_id: Yup.string().when('type', {
            is: (type) => type === 'user',
            then: (schema) => schema.required('User is required'),
            otherwise: (schema) => schema.nullable(),
        }),

        title: Yup.string()
            .max(100, 'Title must be at most 100 characters')
            .nullable(),

        description: Yup.string()
            .max(500, 'Description must be at most 500 characters')
            .nullable(),

        content_type: Yup.string().when('type', {
            is: (type) => ['user', 'admin'].includes(type),
            then: (schema) =>
                schema
                    .required('Content type is required')
                    .oneOf(['image', 'video'], 'Invalid content type'),
            otherwise: (schema) => schema.nullable(),
        }),

        page_ids: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one page is required')
            .required('Pages are required'),

        duration: Yup.number()
            .oneOf([30, 90, 180, 365], 'Invalid duration')
            .required('Duration is required'),

        categories: Yup.array().of(Yup.string()).nullable(),
        tags: Yup.array().of(Yup.string()).nullable(),
        locations: Yup.array().of(Yup.string()).nullable(),

        country_id: Yup.number().nullable(),
        state_id: Yup.number().nullable(),
        city_id: Yup.number().nullable(),

        aspect_ratio: Yup.string().when('type', {
            is: (type) => ['user', 'admin'].includes(type),
            then: (schema) => schema.required('Aspect ratio is required'),
            otherwise: (schema) => schema.nullable(),
        }),

        link: Yup.string().required('Link is required'),

        videolink: Yup.string().when(['content_type', 'type'], {
            is: (content_type, type) =>
                content_type === 'video' && ['user', 'admin'].includes(type),
            then: (schema) => schema.url('Invalid video URL').nullable(),
            otherwise: (schema) => schema.nullable(),
        }),

        google_ad_code: Yup.string().when('type', {
            is: (type) => type === 'google',
            then: (schema) => schema.required('Google Ad code is required'),
            otherwise: (schema) => schema.nullable(),
        }),

        // image: Yup.mixed().when(['content_type', 'type'], {
        //   is: (content_type, type) =>
        //     content_type === 'image' && ['user', 'admin'].includes(type),
        //   then: (schema) =>
        //     schema
        //       .test(
        //         'file-required',
        //         'Image is required',
        //         (value) => formType !== 'add' || !!value
        //       )
        //       .test('file-size', 'File too large (max 5MB)', (value) => {
        //         if (!value) return true;
        //         return value.size <= 5 * 1024 * 1024;
        //       })
        //       .test('file-type', 'Unsupported file type', (value) => {
        //         if (!value) return true;
        //         return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
        //       }),
        //   otherwise: (schema) => schema.nullable(),
        // }),

        // video: Yup.mixed().when(['content_type', 'type'], {
        //   is: (content_type, type) =>
        //     content_type === 'video' && ['user', 'admin'].includes(type),
        //   then: (schema) =>
        //     schema
        //       .test(
        //         'file-required',
        //         'Video is required',
        //         (value) => formType !== 'add' || !!value
        //       )
        //       .test('file-size', 'File too large (max 50MB)', (value) => {
        //         if (!value) return true;
        //         return value.size <= 50 * 1024 * 1024;
        //       })
        //       .test('file-type', 'Unsupported file type', (value) => {
        //         if (!value) return true;
        //         return ['video/mp4', 'video/quicktime'].includes(value.type);
        //       }),
        //   otherwise: (schema) => schema.nullable(),
        // }),

        image_url: Yup.string().nullable(),
        video_url: Yup.string().nullable(),
    });

const AdminAdvertiseManagement = () => {
    const table = "advertisewithusads"

    const formikRef = useRef();
    const [data, setData] = useState({ count: 0, record: [], totalPages: 0, pagination: [] });
    const [show, setShow] = useState(false);
    const [formType, setFormType] = useState("add");
    const [param, setParam] = useState({
        limit: 10,
        pageNo: 1,
        query: "",
        orderBy: "createdAt",
        orderDirection: -1,
        type: "all",
    });
    const [pages, setPages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [aspectRatios, setAspectRatios] = useState([]);
    const [initialValues, setInitialValues] = useState({
        id: "",
        type: "",
        user_id: "",
        title: "",
        description: "",
        content_type: "",
        page_ids: [],
        duration: "",
        categories: [],
        tags: [],
        locations: [],
        country_id: "",
        state_id: "",
        city_id: "",
        aspect_ratio: "",
        link: "",
        videolink: "",
        image: null,
        video: null,
        image_url: "",
        video_url: "",
    });

    // Format options for React Select
    const formatOptions = (options) => {
        return options.map(option => ({
            value: option.id,
            label: option.name
        }));
    };

    // Format selected values for React Select
    const formatSelectedValues = (values, options) => {
        if (!values || !options) return [];
        return options.filter(option => values.includes(option.value));
    };

    // Fetch table data
    const getDataForTable = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData("advertise/list", param);
            if (data?.status) {
                setData(data.data || { count: 0, record: [], totalPages: 0, pagination: [] });
            } else {
                toast.error(data?.message || "Failed to fetch advertisements.");
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
            toast.error("Error fetching advertisements.");
        }
    }, [param]);



    const {
        selectedRows,
        toggleRowSelection,
        toggleSelectAll,
        handleMultipleDelete,
        selectAll,
    } = useRowSelection({ table, getDataForTable });


    // Fetch supporting data
    const fetchPages = async () => {
        try {
            const { data } = await AxiosHelper.getData("ads-page");
            if (data?.status) {
                setPages(data.data.record || []);
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
            toast.error("Failed to fetch pages.");
        }
    };

    const fetchTags = async () => {
        try {
            const { data } = await AxiosHelper.getData("taglist");
            if (data?.status) {
                setTags(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
            toast.error("Failed to fetch tags.");
        }
    };

    const fetchAspectRatios = async (allowed_type, contentType, pageIds) => {
        try {
            const { data } = await AxiosHelper.getData(
                `/aspect-ratios-by-pages?content_type=${allowed_type == "google" ? "both" : contentType}&allowed_type=${allowed_type}&page_ids=${pageIds.join(",")}`
            );
            if (data?.status) {
                setAspectRatios(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching aspect ratios:", error);
            toast.error("Failed to fetch aspect ratios.");
        }
    }
    useEffect(() => {
        getDataForTable();
        fetchPages();
        fetchTags();
        fetchUsers().then((data) => setUsers(data.map(u => ({ id: u._id, name: u.name || u.email }))));
        fetchCategories().then((data) => setCategories(data));
        fetchCountries().then((data) => setCountries(data.map(c => ({ id: c.id, name: c.name }))));
    }, [getDataForTable]);

    // Handle sorting
    const handleSort = (event) => {
        const orderBy = event.target.attributes.getNamedItem("data-sort").value;
        setParam((prev) => ({
            ...prev,
            orderBy,
            orderDirection: prev.orderBy === orderBy ? prev.orderDirection * -1 : -1,
        }));
    };

    // Handle pagination
    const handlePageChange = (pageNo) => {
        setParam((prev) => ({ ...prev, pageNo }));
    };

    // Form fields
    const renderFormFields = (values, setFieldValue, errors, touched) => {
        const fields = [
            {
                label: "Type",
                name: "type",
                type: "select",
                options: [
                    { id: "user", name: "User" },
                    { id: "admin", name: "Admin" },
                    { id: "google", name: "Google" },
                ],
                onChange: (e) => {
                    const type = e.target.value;
                    setFieldValue("type", type);
                    setFieldValue("user_id", type === "user" ? values.user_id : "");
                },
                col: 6,
            },
            ...(values.type === "user"
                ? [{
                    label: "Select User",
                    name: "user_id",
                    type: "select",
                    options: users,
                    col: 6,
                }]
                : []
            ),
            {
                label: "Content Type",
                name: "content_type",
                type: "select",
                options: [
                    { id: "image", name: "Image" },
                    { id: "video", name: "Video" },
                ],
                onChange: (e) => {
                    const contentType = e.target.value;
                    setFieldValue("content_type", contentType);
                    setFieldValue("image", null);
                    setFieldValue("video", null);
                    setFieldValue("videolink", "");
                    setFieldValue("aspect_ratio", "");

                    // if (values.page_ids.length) {
                    fetchAspectRatios(values.type, contentType, values.page_ids);
                    // }
                },
                col: 6,
                disabled: values.type === "google",
            },
            {
                label: "Pages",
                name: "page_ids",
                type: "react-select",
                options: formatOptions(pages.map((p) => ({ id: p._id, name: p.name }))),
                value: formatSelectedValues(values.page_ids, formatOptions(pages.map((p) => ({ id: p._id, name: p.name })))),
                onChange: (selectedOptions) => {
                    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    setFieldValue("page_ids", selectedValues);

                    if ((values.type || values.content_type) && selectedValues.length) {
                        fetchAspectRatios(values.type, values.content_type, selectedValues);
                    } else {
                        setAspectRatios([]);
                    }
                },
                isMulti: true,
                closeMenuOnSelect: false,
                components: animatedComponents,
                col: 6,
            },
            {
                label: "Duration",
                name: "duration",
                type: "select",
                options: [
                    { id: 30, name: "30 Days" },
                    { id: 90, name: "90 Days" },
                    { id: 180, name: "180 Days" },
                    { id: 365, name: "365 Days" },
                ],
                col: 6,
            },
            {
                label: "Categories",
                name: "categories",
                type: "react-select",
                options: formatOptions(categories.map((c) => ({ id: c._id, name: c.name }))),
                value: formatSelectedValues(values.categories, formatOptions(categories.map((c) => ({ id: c._id, name: c.name })))),
                onChange: (selectedOptions) => {
                    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    setFieldValue("categories", selectedValues);
                },
                isMulti: true,
                closeMenuOnSelect: false,
                components: animatedComponents,
                col: 6,
            },
            {
                label: "Tags",
                name: "tags",
                type: "react-select",
                options: formatOptions(tags.map((t) => ({ id: t._id, name: t.name }))),
                value: formatSelectedValues(values.tags, formatOptions(tags.map((t) => ({ id: t._id, name: t.name })))),
                onChange: (selectedOptions) => {
                    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    setFieldValue("tags", selectedValues);
                },
                isMulti: true,
                closeMenuOnSelect: false,
                components: animatedComponents,
                col: 6,
            },
            {
                label: "Country",
                name: "country_id",
                type: "select",
                options: countries,
                onChange: (e) => {
                    const countryId = e.target.value;
                    setFieldValue("country_id", countryId);
                    setFieldValue("state_id", "");
                    setFieldValue("city_id", "");

                    if (countryId) {
                        fetchStates(countryId).then((data) => setStates(data.map(s => ({ id: s.id, name: s.name }))));
                    } else {
                        setStates([]);
                        setCities([]);
                    }
                },
                col: 4,
            },
            {
                label: "State",
                name: "state_id",
                type: "select",
                options: states,
                onChange: (e) => {
                    const stateId = e.target.value;
                    setFieldValue("state_id", stateId);
                    setFieldValue("city_id", "");

                    if (stateId) {
                        fetchCities(stateId).then((data) => setCities(data.map(c => ({ id: c.id, name: c.name }))));
                    } else {
                        setCities([]);
                    }
                },
                col: 4,
            },
            {
                label: "City",
                name: "city_id",
                type: "select",
                options: cities,
                onChange: (e) => {
                    setFieldValue("city_id", e.target.value);
                },
                col: 4,
            },
            {
                type: "custom",
                render: () => (
                    <div className="col-12 mb-3">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                if (!values.country_id) {
                                    toast.error("Select a country.");
                                    return;
                                }

                                const newLocation = {
                                    country_id: values.country_id,
                                    country_name: countries.find((c) => c.id === parseInt(values.country_id))?.name || "",
                                    state_id: values.state_id || null,
                                    state_name: states.find((s) => s.id === parseInt(values.state_id))?.name || null,
                                    city_id: values.city_id || null,
                                    city_name: cities.find((c) => c.id === parseInt(values.city_id))?.name || null,
                                };

                                const isDuplicate = (values.locations || []).some(
                                    (loc) =>
                                        loc.country_id === newLocation.country_id &&
                                        loc.state_id === newLocation.state_id &&
                                        loc.city_id === newLocation.city_id
                                );

                                if (isDuplicate) {
                                    toast.error("Location already added.");
                                    return;
                                }

                                const updatedLocations = [...values.locations, newLocation];
                                setFieldValue("locations", updatedLocations);
                                setFieldValue("country_id", "");
                                setFieldValue("state_id", "");
                                setFieldValue("city_id", "");
                                setStates([]);
                                setCities([]);
                            }}
                        >
                            Add Location
                        </button>
                    </div>
                ),
                col: 12,
            },
            {
                label: "Selected Locations",
                type: "custom",
                render: () => (
                    <div className="col-12 mb-3">
                        {values.locations?.length ? (
                            <ul className="list-group">
                                {values.locations.map((loc, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            {loc.country_name}
                                            {loc.state_name ? ` > ${loc.state_name}` : ""}
                                            {loc.city_name ? ` > ${loc.city_name}` : ""}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                                const updatedLocations = values.locations.filter((_, i) => i !== index);
                                                setFieldValue("locations", updatedLocations);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">No locations selected.</p>
                        )}
                    </div>
                ),
                col: 12,
            },
            {
                label: "Aspect Ratio",
                name: "aspect_ratio",
                type: "select",
                options: aspectRatios.map((r) => ({ id: r, name: r })),
                col: 6,
                // disabled: values.type === "google",
            },
            ...(values.type === "google"
                ? [{
                    label: "Google Ad Code",
                    name: "google_ad_code",
                    type: "text",
                    col: 6,
                }]
                : []
            ),
            {
                label: "Link",
                name: "link",
                type: "text",
                col: 6,
            },
            ...(values.content_type === "video" && values.type !== "google"
                ? [{
                    label: "Video Link (Optional)",
                    name: "videolink",
                    type: "text",
                    col: 6,
                    placeholder: "https://youtube.com/watch?v=...",
                }]
                : []
            ),
            ...(values.content_type === "image" && values.type !== "google"
                ? [{
                    label: "Image",
                    name: "image",
                    type: "file",
                    accept: "image/*",
                    onChange: (e) => {
                        setFieldValue("image", e.currentTarget.files[0]);
                    },
                    col: 12,
                }]
                : []
            ),
            ...(values.content_type === "image" && values.type !== "google" && values.image_url && formType === "edit"
                ? [{
                    type: "custom",
                    render: () => (
                        <div className="col-12 mb-3">
                            <label className="form-label">Current Image</label>
                            <FilePreview
                                file={values.image_url}
                                type="image"
                                onRemove={() => {
                                    setFieldValue("image_url", "");
                                    setFieldValue("image", null);
                                }}
                            />
                        </div>
                    )
                }]
                : []
            ),
            ...(values.content_type === "video" && values.type !== "google"
                ? [{
                    label: "Video File (Optional)",
                    name: "video",
                    type: "file",
                    accept: "video/*",
                    onChange: (e) => {
                        setFieldValue("video", e.currentTarget.files[0]);
                    },
                    col: 6,
                }]
                : []
            ),
            ...(values.content_type === "video" && values.type !== "google" && values.video_url && formType === "edit"
                ? [{
                    type: "custom",
                    render: () => (
                        <div className="col-12 mb-3">
                            <label className="form-label">Current Video</label>
                            <FilePreview
                                file={values.video_url}
                                type="video"
                                onRemove={() => {
                                    setFieldValue("video_url", "");
                                    setFieldValue("video", null);
                                }}
                            />
                        </div>
                    )
                }]
                : []
            ),
        ];

        return fields.map((field, index) => {
            if (field.type === "custom") {
                return (
                    <div key={index} className={`col-${field.col || 12}`}>
                        {field.render(values, setFieldValue)}
                    </div>
                );
            }

            return (
                <div key={field.name} className={`col-${field.col || 12} mb-3`}>
                    <label className="form-label">{field.label}</label>

                    {field.type === "select" && (
                        <select
                            className={`form-select ${errors[field.name] && touched[field.name] ? "is-invalid" : ""}`}
                            name={field.name}
                            value={values[field.name] || ""}
                            onChange={field.onChange || ((e) => setFieldValue(field.name, e.target.value))}
                            disabled={field.disabled}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map(option => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {field.type === "react-select" && (
                        <Select
                            className={`${errors[field.name] && touched[field.name] ? "is-invalid" : ""}`}
                            options={field.options}
                            value={field.value}
                            onChange={field.onChange}
                            isMulti={field.isMulti}
                            closeMenuOnSelect={field.closeMenuOnSelect}
                            components={field.components}
                            placeholder={`Select ${field.label}`}
                            noOptionsMessage={() => "No options available"}
                        />
                    )}

                    {field.type === "text" && (
                        <input
                            type="text"
                            className={`form-control ${errors[field.name] && touched[field.name] ? "is-invalid" : ""}`}
                            name={field.name}
                            value={values[field.name] || ""}
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                            placeholder={field.placeholder}
                        />
                    )}

                    {field.type === "file" && (
                        <input
                            type="file"
                            className={`form-control ${errors[field.name] && touched[field.name] ? "is-invalid" : ""}`}
                            name={field.name}
                            onChange={field.onChange || ((e) => setFieldValue(field.name, e.currentTarget.files[0]))}
                            accept={field.accept}
                        />
                    )}

                    {errors[field.name] && touched[field.name] && (
                        <div className="invalid-feedback">{errors[field.name]}</div>
                    )}
                </div>
            );
        });
    };

    // Edit advertisement
    const editData = async (event) => {
        try {
            const ad = JSON.parse(event.target.getAttribute("main-data"));
            setInitialValues({
                id: ad._id || "",
                type: ad?.type || "",
                user_id: ad.user_id?._id || "",
                title: ad.title || "",
                description: ad.description || "",
                content_type: ad.content_type || "",
                page_ids: [...new Set(ad.pages?.map((p) => p.page_id?._id || p.page_id) || [])],
                duration: ad.duration || "",
                categories: ad.categories?.map((c) => c?._id) || [],
                tags: ad.tags || [],
                locations: ad.locations?.map((loc) => ({
                    country_id: loc.country_id,
                    country_name: loc.country_name || "",
                    state_id: loc.state_id || null,
                    state_name: loc.state_name || null,
                    city_id: loc.city_id || null,
                    city_name: loc.city_name || null,
                })) || [],
                country_id: "",
                state_id: "",
                city_id: "",
                aspect_ratio: ad.aspect_ratio || "",
                link: ad.link || "",
                videolink: ad.videolink || "",
                image: null,
                video: null,
                image_url: ad.image || "",
                video_url: ad.video || "",
            });
            if (ad.content_type && ad.pages?.length) {
                fetchAspectRatios(ad.content_type, ad.pages.map((p) => p.page_id?._id || p.page_id));
            } else {
                setAspectRatios([]);
            }
            setFormType("edit");
            setShow(true);
        } catch (error) {
            console.error("Error parsing ad data:", error);
            toast.error("Failed to load advertisement data.");
        }
    };

    const dropList = [
        { name: "Edit", onClick: editData },
        { name: "Delete", onClick: (e) => deleteDataFunc(e, table, getDataForTable), className: "text-danger" },
    ];

    // Handle form submission
    const onSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const formData = new FormData();

            // Add all fields to formData
            Object.keys(values).forEach(key => {
                if (key === "page_ids" || key === "categories" || key === "tags" || key === "locations") {
                    formData.append(key, JSON.stringify(values[key]));
                } else if (values[key] instanceof File) {
                    formData.append(key, values[key]);
                } else if (values[key] !== null && values[key] !== undefined) {
                    if ((key === "image" || key === "video") && values[`${key}_url`]) {
                        if (!values[key]) {
                            formData.append(`${key}_url`, values[`${key}_url`]);
                        }
                    } else {
                        formData.append(key, values[key]);
                    }
                }
            });

            const endpoint = formType === "add" ? "advertise/create" : `advertise/update/${values.id}`;
            const method = formType === "add" ? "postData" : "putData";

            const { data } = await AxiosHelper[method](endpoint, formData, true);

            if (data?.status) {
                getDataForTable();
                setShow(false);
                toast.success(`Advertisement ${formType === "add" ? "created" : "updated"} successfully.`);
            } else {
                setErrors(data.errors || {});
                toast.error(data?.message || "Failed to save advertisement.");
            }
        } catch (error) {
            console.error("Error saving advertisement:", error);
            toast.error("Error saving advertisement.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle form submit button click
    const handleFormSubmit = () => {
        if (formikRef.current) {
            formikRef.current.submitForm();
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="card mb-6">
                    <div className="card-header">
                        <div className="row flex-between-end">
                            <div className="col-auto">
                                <h5>Manage Advertisements</h5>
                            </div>
                            <div className="col-auto">
                                <button
                                    onClick={() => {
                                        setInitialValues({
                                            id: "",
                                            user_id: "",
                                            title: "",
                                            description: "",
                                            content_type: "",
                                            page_ids: [],
                                            duration: "",
                                            categories: [],
                                            tags: [],
                                            locations: [],
                                            country_id: "",
                                            state_id: "",
                                            city_id: "",
                                            aspect_ratio: "",
                                            link: "",
                                            videolink: "",
                                            image: null,
                                            video: null,
                                            image_url: "",
                                            video_url: "",
                                        });
                                        setFormType("add");
                                        setAspectRatios([]);
                                        setStates([]);
                                        setCities([]);
                                        setShow(true);
                                    }}
                                    className="btn btn-sm btn-falcon-orange"
                                >
                                    <i className="bi bi-plus"></i> Add Advertisement
                                </button>
                                {selectedRows.length > 0 && (
                                    <button
                                        onClick={handleMultipleDelete}
                                        className="btn btn-sm btn-danger"
                                    >
                                        <i className="bi bi-trash"></i> Delete Selected ({selectedRows.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-body pt-0">
                        <div className="row justify-content-between mb-3">
                            <div className="col-md-6 d-flex">
                                <span className="pe-2">Show</span>
                                <select
                                    className="w-auto form-select form-select-sm"
                                    onChange={(e) => setParam((prev) => ({ ...prev, limit: parseInt(e.target.value) }))}
                                >
                                    {[10, 20, 50].map((row) => (
                                        <option key={row} value={row}>
                                            {row}
                                        </option>
                                    ))}
                                </select>
                                <span className="ps-2">entries</span>
                                <select
                                    className="ms-3 form-select form-select-sm"
                                    onChange={(e) => setParam((prev) => ({ ...prev, type: e.target.value }))}
                                >
                                    <option value="all">All</option>
                                    <option value="user">User Ads</option>
                                    <option value="admin">Admin Ads</option>
                                </select>
                            </div>
                            {/* <div className="col-md-4">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="form-control form-control-sm"
                                    onChange={(e) =>
                                        setParam((prev) => ({ ...prev, query: e.target.value, pageNo: 1 }))
                                    }
                                />
                            </div> */}
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={() => toggleSelectAll(data.record)}
                                        />
                                    </th>
                                    <th
                                        onClick={handleSort}
                                        className={`sort ${param.orderBy === "title" && (param.orderDirection === 1 ? "asc" : "desc")}`}
                                        data-sort="title"
                                    >
                                        Name
                                    </th>
                                    {/* <th>User</th> */}
                                    <th>Type</th>
                                    <th>Content Type</th>
                                    <th>Pages</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                    <th>Impressions</th>
                                    <th>Clicks</th>
                                    {/* <th>Status</th> */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.record?.length > 0 ? (
                                    data.record.map((row) => (
                                        <tr key={row._id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row._id)}
                                                    onChange={() => toggleRowSelection(row._id)}
                                                />
                                            </td>
                                            <td>{row.title || row.user_id?.name || "Untitled"}</td>
                                            {/* <td>{row.user_id?.name || row.user_id?.email || "N/A"}</td> */}
                                            <td>{ucFirst(row.type)}</td>
                                            <td>{!row.content_type ? "--" : ucFirst(row.content_type)}</td>
                                            <td>{[...new Set(row.pages?.map((p) => p.page_id?.name || p.page_id?.name) || [])].join(", ")}</td>
                                            <td>{row.duration} Days</td>
                                            <td>₹{row.total_price?.toLocaleString()}</td>
                                            <td>{row.impressions || 0}</td>
                                            <td>{row.clicks || 0}</td>
                                            {/* <td>
                                                <Status
                                                    table="advertisements"
                                                    status={row.payment_status}
                                                    data_id={row._id}
                                                />
                                            </td> */}
                                            <td>
                                                <Action dropList={dropList} data={row} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">
                                            No data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="row align-items-center mt-3">
                            <div className="col">
                                <p className="mb-0 fs--1">
                                    Showing {(param.pageNo - 1) * param.limit + 1} to{" "}
                                    {Math.min(param.pageNo * param.limit, data.count)} of {data.count}
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
                                        {data.pagination?.map((row) => (
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
                                        disabled={param.pageNo === data.totalPages}
                                        className="btn btn-falcon-default btn-sm"
                                        onClick={() => handlePageChange(data.totalPages)}
                                    >
                                        <span className="fas fa-chevron-right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={show} onHide={() => setShow(false)} size="xl">
                    <Modal.Header>
                        <Modal.Title>{ucFirst(formType)} Advertisement</Modal.Title>
                        <CloseButton onClick={() => setShow(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            innerRef={formikRef}
                            initialValues={initialValues}
                            // validationSchema={advertisementSchema(formType)}
                            onSubmit={onSubmit}
                            enableReinitialize
                        >
                            {({
                                values,
                                errors,
                                touched,
                                isSubmitting,
                                setFieldValue,
                            }) => (
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="row">
                                        {renderFormFields(values, setFieldValue, errors, touched)}
                                    </div>

                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-secondary me-2"
                                            onClick={() => setShow(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                            onClick={handleFormSubmit}
                                        >
                                            {isSubmitting ? "Saving..." : "Save Advertisement"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default AdminAdvertiseManagement;