import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { formatDateDDMMYYYY } from '../../../helper/StringHelper';
import AxiosHelper from '../../../helper/AxiosHelper';
import { Link, useNavigate, useParams } from "react-router-dom";
import PlanStatus from '../../../components/Table/PlanStatus';
import { CURRENCY } from '../../../constant/fromConfig';

const ViewMembershipPlan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [planDetails, setPlanDetails] = useState(null);
    const [planLogs, setPlanLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlanDetails = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`mambershipPlanDetails/${id}`);
            if (data?.status) {
                setPlanDetails(data.data);
            } else {
                throw new Error(data?.message || 'Failed to fetch plan details');
            }
        } catch (error) {
            toast.error(error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchPlanLogs = useCallback(async () => {
        try {
            const { data } = await AxiosHelper.getData(`mambershipPlanLogs/${id}`);
            if (data?.status) {
                setPlanLogs(data.data || []);
            } else {
                toast.error(data?.message || 'Failed to fetch plan logs');
            }
        } catch (error) {
            toast.error('Failed to fetch plan logs');
        }
    }, [id]);

    useEffect(() => {
        fetchPlanDetails();
        fetchPlanLogs();
    }, [fetchPlanDetails, fetchPlanLogs]);

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
        return <div className="alert alert-danger m-3">{error}</div>;
    }

    return (
        <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Membership Plan Details</h4>
          <Link to="/admin/membership-plan-logs" className="btn btn-outline-primary btn-sm">
            <i className="fa fa-list-ul me-1"></i> View All Plans
          </Link>
        </div>
       
        <div className="row g-4">
          {/* Plan Information */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-light border-bottom">
                <h6 className="mb-0 text-primary">Plan Information</h6>
              </div>
              <div className="card-body">
                <InfoRow label="Customer" value={planDetails.userName} />
                <InfoRow label="Plan Name" value={planDetails.planName} />
                <InfoRow
                  label="Plan Type"
                  value={
                    <span className={`badge ${planDetails.plan_type === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                      {planDetails.plan_type}
                    </span>
                  }
                />
                <InfoRow label="Price" value={`${CURRENCY} ${planDetails.plan_price}`} />
                <InfoRow label="Duration" value={`${planDetails?.plan_duration} ${planDetails.duration_type}`} />
                <InfoRow label="Ads Balance" value={planDetails?.original_ads_balance} />
                <InfoRow label="Remaning Blanace" value={planDetails?.ads_balance} />
                
              </div>
            </div>
          </div>
  
          {/* Plan Status */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-light border-bottom">
                <h6 className="mb-0 text-primary">Plan Status</h6>
              </div>
              <div className="card-body">
                  <div className="mb-3">
                    <strong>Payment Status : </strong>
                    <span className={`fs13 badge ${planDetails?.paymentStatus === 'success'
                        ? 'badge-soft-info'
                        : 'badge-soft-danger'}`}>
                        {planDetails?.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                        {}
                    </span>
                  </div>
                  <div className="mb-3">
                    <strong>Purchase Status : </strong>
                    <span className={`fs13 badge ${planDetails?.status === 1
                        ? 'badge-soft-success'
                        : 'badge-soft-warning'}`}>
                        {planDetails?.status === 1 ? 'Success' : 'Pending'}
                    </span>
                  </div>
                  <InfoRow
                    label="Plan Status"
                    value={<PlanStatus data={planDetails} />}
                    />
              </div>
            </div>
          </div>

            {/* Plan Features */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-light border-bottom">
                <h6 className="mb-0 text-primary">Plan Features</h6>
              </div>
              <div className="card-body">
                {Object.entries(planDetails?.features || {}).map(([key, feature]) => (
                  <div key={key} className="mb-3">
                    <strong>{feature?.name}:</strong>
                    <div className="text-muted small">{feature?.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Plan Timeline */}
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light border-bottom">
                <h6 className="mb-0 text-primary">Plan Timeline</h6>
              </div>
              <div className="card-body row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-success fs-4">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Purchase Date</h6>
                      <p className="mb-0">{formatDateDDMMYYYY(planDetails.purchase_date)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-danger fs-4">
                      <i className="fas fa-calendar-times"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">Expiry Date</h6>
                      <p className="mb-0">{formatDateDDMMYYYY(planDetails.expiry_date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Plan Logs */}
          {planLogs.length > 0 && (
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light border-bottom">
                  <h6 className="mb-0 text-primary">Activity Logs</h6>
                </div>
                <div className="card-body">
                  {planLogs.map(log => (
                    <div key={log._id} className="mb-4 border-start ps-3">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-semibold">{log.reason}</h6>
                        <small className="text-muted">{formatDateDDMMYYYY(log.timestamp)}</small>
                      </div>
                      <div className="bg-light rounded p-3 mt-2">
                        <div className="row">
                          <div className="col-md-6">
                            <p className="mb-1"><strong>Prev Balance:</strong> {log.previousBalance}</p>
                           {(log.previousExpireDate && 
                            <p className="mb-1"><strong>Prev Expiry:</strong> {formatDateDDMMYYYY(log.previousExpireDate)}</p>
                           )} 
                          </div>
                          <div className="col-md-6">
                            <p className="mb-1"><strong>New Balance:</strong> {log.newBalance}</p>
                            <p className="mb-1"><strong>New Expiry:</strong> {formatDateDDMMYYYY(log.newExpireDate)}</p>
                          </div>
                        </div>
                        {log.change !== 0 && (
                          <p className="mb-0 mt-2">
                            <strong>Change:</strong> {log.change}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    );
};

export default ViewMembershipPlan;

const InfoRow = ({ label, value }) => (
    <div className="mb-3">
      <strong>{label}:</strong> <span className="ms-1">{value}</span>
    </div>
  );
