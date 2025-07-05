import React from 'react'
import backgroundImage1 from "../../assets/images/admin/icons/corner-3.png";
import backgroundImage2 from "../../assets/images/admin/icons/corner-1.png";
import backgroundImage3 from "../../assets/images/admin/icons/corner-2.png";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ActiveUsersReport from '../../components/Admin/Dashboard/ActiveUsersReport';
const quickLinks = [
    { icon: "fa fa-square-poll-horizontal", title: "Advertisemnet", description: "Manage and update your Advertisemnet", color: "primary" },
    { icon: "fa fa-business-time", title: "Business", description: "Manage and update your Business", color: "warning" },
    { icon: "fa-solid fa-user-tie-hair", title: "Customer", description: "Manage and update your Customer", color: "success" },
    { icon: "fa-solid fa-square-kanban", title: "Blogs", description: "Manage activity and update your Blogs", color: "info" }
  ];
const Dashboard = () => {
    var { application_name } = useSelector(store => store.theme.settings);
    return (
        <>
        <div className="row g-3 mb-3">
            <div className="col-xxl-6 col-lg-12">
                <div className="card h-100">
                <div
                    className="bg-holder bg-card"
                    style={{ backgroundImage: `url(${backgroundImage1})` }}
                ></div>
                <div className="card-header z-index-1">
                    <h5 className="text-primary">Welcome to {application_name}!</h5>
                    <h6 className="text-600">Here are some quick links for you to start</h6>
                </div>
                <div className="card-body z-index-1">
                    <div className="row g-2 h-100 align-items-end">
                    {quickLinks.map((item, index) => (
                        <div key={index} className="col-sm-6 col-md-5">
                        <div className="d-flex position-relative">
                            <div className={`icon-item icon-item-sm border rounded-3 shadow-none me-2 text-${item.color}`}>
                            <i className={item.icon}></i>
                            </div>
                            <div className="flex-1">
                            <a className="stretched-link" href="#!">
                                <h6 className="text-800 mb-0">{item.title}</h6>
                            </a>
                            <p className="mb-0 fs--2 text-500">{item.description}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div className='row'>
            <div className="col-lg-12">
                <div className="row g-2 mb-3">
                    {/* Customers Card */}
                    <div className='d-flex justify-content-between'>
                        <h3> Ads </h3>
                        <Link to='#' className='text-warning'> View All</Link>
                    </div>
                    <div className="col">
                        <div className="card overflow-hidden" style={{ minWidth: "12rem" ,color: "#FA6989"}}>
                            <div className="bg-holder bg-card" style={{ backgroundImage: `url(${backgroundImage2})` }}>
                            </div>
                            <div className="card-body position-relative d-flex flex-row gap-3 align-items-center justify-content-center">
                                <i className='fa-solid fa-user-group fs-2  mb-2 p-3' style={{ backgroundColor: "#FDDADE" }}></i>  
                                <div className='d-flex flex-column align-items-center text-center'>
                                    <div className="display-4 fs-4 font-sans-serif fw-bold">
                                        10
                                    </div>
                                    <h6 className="mt-1">Total Ads</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card overflow-hidden" style={{ minWidth: "12rem",color: "#614BB7"  }}>
                            <div className="bg-holder bg-card" style={{ backgroundImage: `url(${backgroundImage3})` }}>
                            </div>
                            <div className="card-body position-relative d-flex flex-row gap-3 align-items-center justify-content-center">
                                <i className='fa-solid fa-user-group fs-2 mb-2 p-3' style={{ backgroundColor: "#E0DDF9" }}></i>  
                                <div className='d-flex flex-column align-items-center text-center'>
                                    <div className="display-4 fs-4 font-sans-serif fw-bold">
                                        05
                                    </div>
                                    <h6 className="mt-1">Live Ads</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card overflow-hidden" style={{ minWidth: "12rem",color: "#348C52"  }}>
                            <div className="bg-holder bg-card" style={{ backgroundImage: `url(${backgroundImage3})` }}>
                            </div>
                            <div className="card-body position-relative d-flex flex-row gap-3 align-items-center justify-content-center">
                                <i className='fa-solid fa-user-group fs-2 mb-2 p-3' style={{ backgroundColor: "#C3EBD3" }}></i>  
                                <div className='d-flex flex-column align-items-center text-center'>
                                    <div className="display-4 fs-4 font-sans-serif fw-bold">
                                        25
                                    </div>
                                    <h6 className="mt-1">Pending Ads</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card overflow-hidden" style={{ minWidth: "12rem",color: "#FB5233"  }}>
                            <div className="bg-holder bg-card" style={{ backgroundImage: `url(${backgroundImage3})` }}>
                            </div>
                            <div className="card-body position-relative d-flex flex-row gap-3 align-items-center justify-content-center">
                                <i className='fa-solid fa-user-group fs-2 mb-2 p-3' style={{ backgroundColor: "#FFDBC8" }}></i>  
                                <div className='d-flex flex-column align-items-center text-center'>
                                    <div className="display-4 fs-4 font-sans-serif fw-bold">
                                        32
                                    </div>
                                    <h6 className="mt-1">Expire Ads</h6>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        <div className="card overflow-hidden" style={{ minWidth: "12rem",color: "#2451C6"  }}>
                            <div className="bg-holder bg-card" style={{ backgroundImage: `url(${backgroundImage3})` }}>
                            </div>
                            <div className="card-body position-relative d-flex flex-row gap-3 align-items-center justify-content-center">
                                <i className='fa-solid fa-user-group fs-2 mb-2 p-3' style={{ backgroundColor: "#D9E3FC" }}></i>  
                                <div className='d-flex flex-column align-items-center text-center'>
                                    <div className="display-4 fs-4 font-sans-serif fw-bold">
                                        04
                                    </div>
                                    <h6 className="mt-1">Draft Ads</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ActiveUsersReport/>
        </>
    )
}

export default Dashboard