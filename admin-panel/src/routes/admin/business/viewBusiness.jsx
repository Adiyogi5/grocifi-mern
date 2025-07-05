import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchBusinessBySlug } from "../../../helper/ApiService";
import { ucFirst } from "../../../helper/StringHelper";
import Status from '../../../components/Table/Status';
import Featured from '../../../components/Featured';
import HtmlContent from "../../../components/HtmlContent";
import MapComponent from "../../../components/MapComponent";
const viewBusiness = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
    
  const fetchData = useCallback(async () => {
    try {
      
      const response = await fetchBusinessBySlug(slug);
    
      if (response?.status === true) {
        setBusiness(response.data);
      } else {
        navigate("/admin/business");
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [slug, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!business) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Business Details</h5>
          <Link to="/admin/business" className="btn btn-sm btn-secondary">
            <i className="fa fa-arrow-left me-2"></i> Go Back
          </Link>
         
        </div>

        <div className="card-body">
            {/* Business Info */}
            <div className="row">
                <div className="col-md-3 text-center">
                    <img
                        src={business.logo || "/default-logo.png"}
                        alt="Business Logo"
                        className="img-thumbnail"
                        style={{ maxWidth: "100px", borderRadius: "10px" }}
                    />
                </div>
                <div className="col-md-5">
                    <h4 className="mb-1">{business.business_name}</h4>
                    <p className="text-muted">Business ID: {business.uniqueId}</p>
                    <p><strong>Time in Business:</strong> {business?.time_in_business?.name}</p>
                    <p><strong>Business Label:</strong> {business.business_label?.name}</p>
                    <p> <strong>Status </strong> : 
                        <Status table='businesses' status={business.status} data_id={business._id} />
                    </p>
                    <p className="d-flex flex-wrap gap-1"> <strong>Promoted As </strong> : <Featured status={business?.promotionPlan}></Featured>
                    </p>
                    <p className="d-flex flex-wrap gap-1"> <strong>Category </strong> : 
                        {business?.category_id?.map(category => (
                            <span key={category._id} className="badge bg-primary me-1">
                            {category.name}
                            </span>
                        ))}
                    </p>
                </div>
                <div className="col-md-3">
                    <h4 className="mb-2">Owner Detail</h4>
                    <p><strong>Name :</strong> {business?.owner_id?.name}</p>
                    <p><strong>Email :</strong> {business?.owner_id?.email}</p>
                    <p><strong>Phone :</strong> {business?.owner_id?.mobile}</p>                        
                </div>
            </div>

            <hr />
            <div className="row">
                <h5>Story</h5>
                <div className="col-md-12">
                    <HtmlContent content={business.story} />
                </div>
            </div>
            <hr />
            <div className="row">
                <h5>Specialities</h5>
                <div className="col-md-12">
                    {business?.specialities?.length > 0 ? (
                    <ul>
                        {business.specialities.map((speciality, index) => (
                        <li key={index}>{speciality}</li>
                        ))}
                    </ul>
                    ) : "No specialities available"}
                </div>
            </div>
            <hr />
            {/* Contact Details */}
            <div className="row">
                <div className="col-md-6">
                <h5>Contact Information</h5>
                <p>
                    <strong>Name:</strong> {business.name}
                </p>
                <p>
                    <strong>Email:</strong> {business.email}
                </p>
                <p>
                    <strong>Phone:</strong> {business.phone}
                </p>
                <p>
                    <strong>WhatsApp:</strong> {business.whatsapp}
                </p>
                <p>
                    <strong>Website:</strong> 
                    <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {business.website}
                    </a>
                </p>
                </div>

                <div className="col-md-6">
                    <h5>Address</h5>
                    <p>
                        {business.address}, {business.zip}
                    </p>
                    <p><strong>Zip Code :</strong> {business?.zip}</p>
                    <h5>Social Profiles</h5>
                    {business?.social_profile &&
                        Object.entries(business.social_profile).map(([key, value]) => (
                            value ?
                            (<div key={key}>
                                <strong> {ucFirst(key)}:</strong> <a href={value} target="_blank">{value}</a>
                            </div>):``
                        ))
                    }
                </div>
            </div>
            <hr />
            {/* Opening Hours Details */}
            <div className="row">
                <div className="col-md-12">
                    <h5>Opening Hours: {ucFirst(business.hour_type)} </h5>
                    {business?.hour_type == 'selected' &&
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Opening Time</th>
                                <th>Closing Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {business?.opening_hours &&
                                business.opening_hours.map((hours, index) => (
                                    <tr key={index}>
                                        <td>{ucFirst(hours.day)}</td>
                                        <td>{hours.open}</td>
                                        <td>{hours.close}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    }
                    {business?.hour_type == 'alwas' &&
                        <div> Open : {ucFirst(business.hour_type)}</div>
                    }
                </div>
            </div>
            <hr />
            {/* Business Media */}
            <div className="row">
                <div className="col-md-12">
                <h5>Banner</h5>
                {business.banner ? (
                    <img
                    src={business.banner}
                    alt="Banner"
                    className="img-fluid rounded shadow"
                    />
                ) : (
                    <p className="text-muted">No banner available</p>
                )}
                </div>
            </div>
            <hr />
            {/* Gallery Media */}
            <div className="row">
                <div className="col-md-12">
                    <h5>Gallery</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {business.gallery.length > 0 ? (
                        business.gallery.map((img, index) => (
                            <img
                            key={index}
                            src={img}
                            alt={`Gallery ${index}`}
                            className="img-thumbnail"
                            style={{
                                width: "180px",
                                height: "150px",
                                objectFit: "cover",
                            }}
                            />
                        ))
                        ) : (
                        <p className="text-muted">No images in gallery</p>
                        )}
                    </div>
                </div>
            </div>

             {/* Map */}
            <div className="row">
                <div className="col-md-12">
                <h5>Map</h5>
                {/* <MapComponent lat={business?.lat} lng={business?.long} /> */}
                </div>
            </div>
            <hr />
        </div>
      </div>
    </div>
  );
};

export default viewBusiness;
