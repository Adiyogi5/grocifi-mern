import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { formatDateDDMMYYYY } from '../../../helper/StringHelper';
import AxiosHelper from '../../../helper/AxiosHelper';
import { Link, useParams } from "react-router-dom";
import PlanStatus from '../../../components/Table/PlanStatus';
import { CURRENCY } from '../../../constant/fromConfig';
import { OverlayTrigger, Popover } from "react-bootstrap";

const viewPromotionPlan = () => {
    const { id } = useParams();
    const[isOverflowing, setIsOverflowing] = useState(false);
    const descRef = useRef(null);
    const [planDetails, setPlanDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getPlanDetails = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`promotionPlanDetails/${id}`);
            if (data?.status === true) {
                // console.log("paalsdfasdfsd",data.data);
                setPlanDetails(data.data);
            } else {
                toast.error(data?.message || 'Failed to fetch promotion plan details');
                setError(data?.message || 'Failed to fetch promotion plan details');
            }
        } catch (error) {
            toast.error('Failed to fetch promotion plan details');
            setError('Failed to fetch promotion plan details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getPlanDetails();
    }, [getPlanDetails]);


    useEffect(() => {
        if (descRef.current) {
            setIsOverflowing(descRef.current.scrollHeight > descRef.current.clientHeight);
        }
    }, []);

    // Function to strip HTML tags
    const stripHtmlTags = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };


    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-3" role="alert">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-3">
                        <div className="card-header">
                            <div className="row flex-between-end">
                                <div className="col-auto align-self-center">
                                    <h5 className="mb-0" data-anchor="data-anchor">
                                        Promotion Plan Details
                                    </h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="mt-2" role="tablist">
                                        <Link to="/admin/promotion-plan-logs" className="me-2 btn btn-sm btn-falcon-default">
                                            <i className="fa fa-list-ul me-1"></i>
                                            <span className="d-none d-sm-inline-block ms-1">List</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {planDetails && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">Promotion Plan Information</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <strong>User Name:</strong> {planDetails.userName}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Name:</strong> {planDetails.planName}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Type:</strong>
                                                    <span className={`badge text-capitalize ${planDetails.plan_type === 'paid' ? 'bg-success' : 'bg-warning'} ms-2`}>
                                                        {planDetails.plan_type}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Price:</strong> {CURRENCY}{planDetails.plan_price}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Duration:</strong> {planDetails.plan_duration}{planDetails.plan_duration > 1 ? 'Days' : 'Day'} 
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Status:</strong>
                                                    <span className={`badge`}>
                                                        <PlanStatus data={planDetails} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">Promotion {planDetails.promotionFor == 'advertisement' ? "Advertisement": "Business"}</h6>
                                            </div>
                                            {planDetails.promotionFor === 'advertisement' ? (
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <strong>Advertisement Name:</strong> {planDetails?.advertisement?.title}
                                                </div>
                                                <div className="mb-3 d-flex">
                                                    <strong style={{whiteSpace: 'nowrap'}}>Advertisement Description: &nbsp;</strong>
                                                    <OverlayTrigger
                                                        trigger={["hover", "focus"]}
                                                        placement="top"
                                                        overlay={
                                                            <Popover id="popover-description">
                                                                <Popover.Body>{stripHtmlTags(planDetails?.advertisement?.description)}</Popover.Body>
                                                            </Popover>
                                                        }
                                                    >
                                                        <div
                                                            ref={descRef}
                                                            className="overflow-hidden"
                                                            style={{
                                                                maxWidth: "100%",
                                                                maxHeight: "3em",
                                                                overflow: "hidden",
                                                                display: "-webkit-box",
                                                                WebkitBoxOrient: "vertical",
                                                                WebkitLineClamp: 2,
                                                                cursor: "pointer",
                                                                whiteSpace: "normal",
                                                            }}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: planDetails?.advertisement?.description }} />
                                                            {isOverflowing && <span className="text-primary">... Read more</span>}
                                                        </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Advertisement Price:</strong> {CURRENCY}{planDetails.advertisement.price}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>likes:</strong> {planDetails.advertisement.likes}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Views:</strong> {planDetails.advertisement.views}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Advertisement Status:</strong>
                                                    <span className={`badge ${planDetails.advertisement.status === 1 ? 'bg-success' : planDetails.advertisement.status === 0 ? 'bg-warning' : 'bg-danger'} ms-2`}>
                                                        {planDetails.advertisement.status === 1 ? 'Active' : planDetails.advertisement.status === 0 ? 'Pending' : 'Expired'}
                                                    </span>
                                                </div>
                                            </div>)
                                            : (
                                                <div className="card-body">
                                                    <div className="mb-3">
                                                        <strong>Business Name:</strong> {planDetails?.business?.business_name}
                                                    </div>
                                                    <div className="mb-3 d-flex">
                                                        <strong style={{whiteSpace: 'nowrap'}}>Business Story : &nbsp;</strong>
                                                       
                                                        <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            placement="top"
                                                            overlay={
                                                                <Popover id="popover-description">
                                                                    <Popover.Body>{stripHtmlTags(planDetails?.business?.story)}</Popover.Body>
                                                                </Popover>
                                                            }
                                                        >
                                                            <div
                                                                ref={descRef}
                                                                className="overflow-hidden"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    maxHeight: "3em",
                                                                    overflow: "hidden",
                                                                    display: "-webkit-box",
                                                                    WebkitBoxOrient: "vertical",
                                                                    WebkitLineClamp: 2,
                                                                    cursor: "pointer",
                                                                    whiteSpace: "normal",
                                                                }}
                                                            >
                                                                <span dangerouslySetInnerHTML={{ __html:  planDetails?.business?.story}} />
                                                                {isOverflowing && <span className="text-primary">... Read more</span>}
                                                            </div>
                                                        </OverlayTrigger>
                                                    </div>
                                                   
                                                    <div className="mb-3">
                                                        <strong>likes:</strong> {planDetails.business.likes}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Views:</strong> {planDetails.business.views}
                                                    </div>
                                                    <div className="mb-3">
                                                        <strong>Business Status:</strong>
                                                        <span className={`badge ${planDetails.business.status === 1 ? 'bg-success' : planDetails.business.status === 0 ? 'bg-warning' : 'bg-danger'} ms-2`}>
                                                            {planDetails.business.status === 1 ? 'Active' : planDetails.business.status === 0 ? 'Pending' : 'Expired'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* <div className="col-md-6">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h6 className="mb-0">Plan Features</h6>
                                            </div>
                                            <div className="card-body">
                                                {Object.entries(planDetails.features || {}).map(([key, feature]) => (
                                                    <div key={key} className="mb-3">
                                                        <strong>{feature.name}:</strong>
                                                        <div className="text-muted small">{feature.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="col-md-12 mt-4">
                                        <div className="card">
                                            <div className="card-header">
                                                <h6 className="mb-0">Promotion Plan Timeline</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="timeline-vertical">
                                                    <div className="timeline-item">
                                                        <div className="timeline-icon bg-success">
                                                            <i className="fas fa-check"></i>
                                                        </div>
                                                        <div className="timeline-content">
                                                            <h6>Purchase Date</h6>
                                                            <p>{planDetails.purchase_date ? formatDateDDMMYYYY(planDetails.purchase_date) : 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="timeline-item">
                                                        <div className="timeline-icon bg-danger">
                                                            <i className="fas fa-clock"></i>
                                                        </div>
                                                        <div className="timeline-content">
                                                            <h6>Expiry Date</h6>
                                                            <p>{planDetails.expiry_date ? formatDateDDMMYYYY(planDetails.expiry_date) : 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default viewPromotionPlan;