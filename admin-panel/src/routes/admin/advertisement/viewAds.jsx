import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchAdvertisementBySlug } from "../../../helper/ApiService";
import { ucFirst } from "../../../helper/StringHelper";
import Status from '../../../components/Table/Status';
import Featured from '../../../components/Featured';
import MapComponent from "../../../components/MapComponent";
import HtmlContent from "../../../components/HtmlContent";
import AdsStatus from "../../../components/Table/AdsStatus";

const viewAds = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [Advertisement, setAdvertisement] = useState(null);
    
  const fetchData = useCallback(async () => {
    try {
      const response = await fetchAdvertisementBySlug(slug);
      if (response?.status === true) {
        setAdvertisement(response.data);
      } else {
        // navigate("/admin/advertisement");
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [slug, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!Advertisement) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Advertisement Details</h5>
          <Link to="/admin/advertisement" className="btn btn-sm btn-secondary">
            <i className="fa fa-arrow-left me-2"></i> Go Back
          </Link>
         
        </div>

        <div className="card-body">
            {/* Business Info */}
            <div className="row">
                <div className="col-md-3 text-center">
                    <img
                        src={Advertisement?.image[0] || "/default-logo.png"}
                        alt="Advertisement"
                        className="img-thumbnail"
                        style={{ maxWidth: "100px", borderRadius: "10px" }}
                    />
                </div>
                <div className="col-md-5">
                    <h4 className="mb-1">{Advertisement.business_name}</h4>
                    <p className="text-muted">Ad ID: {Advertisement.uniqueId}</p>
                    {/* <p><strong>Time in Business:</strong> {business?.time_in_business?.name}</p> */}
                    <p><strong>Ads Label:</strong> {Advertisement.ad_label?.name}</p>
                    <p> <strong>Status </strong> :
                        <AdsStatus table='advertisements' status={Advertisement.status} data_id={Advertisement._id} />
                        {/* <Status table='advertisements' status={Advertisement.status} data_id={Advertisement._id} /> */}
                    </p>
                    <p> <strong>Featured </strong> :
                    <Featured  status={Advertisement?.promotionPlan}></Featured>
                   
                    </p>
                </div>
                <div className="col-md-3">
                    <h4 className="mb-2">Owner Detail</h4>
                    <p><strong>Name :</strong> {Advertisement?.owner_id?.name}</p>
                    <p><strong>Email :</strong> {Advertisement?.owner_id?.email}</p>
                    <p><strong>Phone :</strong> {Advertisement?.owner_id?.mobile}</p>                        
                </div>
            </div>

            <hr />
            <div className="row">
                <h5>Description</h5>
                <div className="col-md-12">
                <HtmlContent content={Advertisement.description} />
                </div>
            </div>
           
            <hr />
            {/* Contact Details */}
            <div className="row">
                <div className="col-md-6">
                <h5>Contact Information</h5>
                <p>
                    <strong>Name:</strong> {Advertisement.name}
                </p>
                <p>
                    <strong>Email:</strong> {Advertisement.email}
                </p>
                <p>
                    <strong>Phone:</strong> {Advertisement.phone}
                </p>
                <p>
                    <strong>WhatsApp:</strong> {Advertisement.whatsapp}
                </p>
                <p>
                    <strong>Website:</strong> 
                    <a
                    href={Advertisement.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    {Advertisement.website}
                    </a>
                </p>
                </div>

                <div className="col-md-6">
                    <h5>Address</h5>
                    <p>
                        {Advertisement.address}, {Advertisement.zip}
                    </p>
                    <h5>Social Profiles</h5>
                    {Advertisement?.social_profile &&
                        Object.entries(Advertisement.social_profile).map(([key, value]) => (
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
                    <h5>Opening Hours: {ucFirst(Advertisement.hour_type)} </h5>
                    {Advertisement?.hour_type == 'selected' &&
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Opening Time</th>
                                <th>Closing Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Advertisement?.opening_hours &&
                                Advertisement.opening_hours.map((hours, index) => (
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
                    {Advertisement?.hour_type == 'alwas' &&
                        <div> Open : {ucFirst(Advertisement.hour_type)}</div>
                    }
                </div>
            </div>
            <hr />
           
            {/* Gallery Media */}
            <div className="row">
                <div className="col-md-12">
                    <h5>Image</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {Advertisement.image.length > 0 ? (
                        Advertisement.image.map((img, index) => (
                            <img
                            key={index}
                            src={img}
                            alt={`image ${index}`}
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

export default viewAds;
