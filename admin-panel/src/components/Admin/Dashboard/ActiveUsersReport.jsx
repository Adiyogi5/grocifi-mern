import { useEffect } from "react";
import * as echarts from "echarts";

const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Impressions', 'Views', 'Leads']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Impressions',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Views',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Leads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
    ]
  };


const ActiveUsersReport = () => {

  useEffect(() => {
    document.querySelectorAll("[data-echart-responsive]").forEach((el) => {
      echarts.init(el).setOption(option);
    });
  }, []);

  return (
    <div className="row g-3 mb-3">
      <div className="col-lg-7">
        <div className="card mb-3">
          <div className="card-header d-flex justify-content-between bg-light py-2">
            <h6 className="mb-0">Ads Performance</h6>
            <div className="dropdown">
              <button className="btn btn-link text-600 btn-sm" data-bs-toggle="dropdown">
                <span className="fas fa-ellipsis-h fs--2"></span>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                <a className="dropdown-item" href="#">View</a>
                <a className="dropdown-item" href="#">Export</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item text-danger" href="#">Remove</a>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-auto">
                <div className="row flex-column h-md-100">
                  {[
                    { label: "Impressions", value: "10,325", color: "text-primary" },
                    { label: "Views", value: "4,235", color: "text-success" },
                    { label: "Leads", value: "3,575", color: "text-info" },
                  ].map((item, index) => (
                    <div className="col border-bottom pt-3" key={index}>
                      <h6 className="fs--2 text-700">
                        <span className={`fas fa-circle ${item.color} me-2`}></span>
                        {item.label}
                      </h6>
                      <h5 className="text-700 fs-0">{item.value}</h5>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-auto echart-active-users-report-container">
                <div className="echart-active-users-report h-100" data-echart-responsive="true"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersReport;
