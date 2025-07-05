import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { formatDateDDMMYYYY } from '../../../helper/StringHelper';
import AxiosHelper from '../../../helper/AxiosHelper';
import { Link, useNavigate, useParams } from "react-router-dom";
import PlanStatus from '../../../components/Table/PlanStatus';
import { CURRENCY } from '../../../constant/fromConfig';
import AdsStatus from '../../../components/Table/AdsStatus';

const viewAddOnPlan = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [planDetails, setPlanDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getPlanDetails = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`addonPlanDetails/${id}`);
            if (data?.status === true) {
               
                setPlanDetails(data.data);
            } else {
                toast.error(data?.message || 'Failed to fetch addon plan details');
                setError(data?.message || 'Failed to fetch addon plan details');
            }
        } catch (error) {
            toast.error('Failed to fetch addon plan details');
            setError('Failed to fetch addon plan details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getPlanDetails();
    }, [getPlanDetails]);

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
                                        Add-On Plan Details
                                    </h5>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="mt-2" role="tablist">
                                        <Link to="/admin/addon-plan-logs" className="me-2 btn btn-sm btn-falcon-default">
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
                                                <h6 className="mb-0">Add-On Plan Information</h6>
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
                                                    <span className={`badge text-capitalize ${planDetails.plan_type === 'ads' ? 'bg-success' : 'bg-warning'} ms-2`}>
                                                        {planDetails.plan_type}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Price:</strong> {CURRENCY}{planDetails.plan_price}
                                                </div>
                                                <div className="mb-3">
                                                    <strong> Balance: </strong>
                                                    {planDetails.plan_type === 'ads' ? planDetails.ads_balance + " Ads" : planDetails.plan_duration +" Days"}
                                                </div>
                                                <div className="mb-3">
                                                    <strong>Plan Status:</strong>
                                                    <span className={`badge`}>
                                                        <span className={`fs13 badge ${planDetails?.status === 1
                                                            ? 'badge-soft-success'
                                                            : 'badge-soft-warning'}`}>
                                                            {planDetails.status === 1 ? 'Success' : 'Pending'}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {planDetails?.adsData && (
                                    <div className="col-md-6">
                                        <div className="card ">
                                            <div className="card-header">
                                                <h6 className="mb-0">Ads Detail</h6>
                                            </div>
                                            <div className="card-body">                                                
                                                <div className="mb-1 d-flex flex-row gap-2 align-items-center">
                                                    <strong>Ad title </strong> :
                                                    <div className="text-muted ">{planDetails?.adsData?.title}</div>
                                                </div>                                                
                                                <div className="mb-1 d-flex flex-row gap-2 align-items-center">
                                                    <strong>Ad Owner </strong> :
                                                    <div className="text-muted ">{planDetails?.adsData?.name}</div>
                                                </div>                                                
                                                <div className="mb-1 d-flex flex-row gap-2 align-items-center">
                                                    <strong>Ad status </strong> :
                                                    <AdsStatus status={planDetails?.adsData?.status} expireDate={planDetails?.adsData?.expiry_date}/>
                                                </div>    
                                                <div className="mb-1 d-flex flex-row gap-2 align-items-center">
                                                    <strong>Expire On </strong> :
                                                    <div className="text-muted ">{planDetails?.adsData?.expiry_date}</div>
                                                </div>                                             
                                            </div>
                                        </div>
                                    </div>
                                    )}

                                    <div className="col-md-6 mt-4">
                                        <div className="card">
                                            <div className="card-header">
                                                <h6 className="mb-0">Add-On Plan Timeline</h6>
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

export default viewAddOnPlan;