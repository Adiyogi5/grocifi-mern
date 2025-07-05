export default [
  {
    name: "Dashboard",
    icon: "fa-solid fa-gauge-high",
    url: `/admin/dashboard`,
  },
  {
    name: "Master",
    icon: "fa-solid fa-sparkles",
    children: [
      {
        name: "Role",
        url: `/admin/role`,
      },
      {
        name: "Designations",
        url: `/admin/designation`,
      },
      {
        name: "Blog Author",
        url: `/admin/blogauthor`,
      },
      {
        name: "Blog",
        url: `/admin/blog`,
      },
    ],
  },

  {
    name: "Categories",
    icon: "fa-solid fa-layer-group",
    children: [
      {
        name: "Parent Category",
        url: `/admin/category`,
      },
      {
        name: "Sub Category",
        url: `/admin/subcategory`,
      },
      {
        name: "Child Category",
        url: `/admin/child_category`,
      },
    ],
  },
  {
    name: "Users",
    icon: "fa-solid fa-user-tie",
    children: [
      {
        name: "Sub-Admin",
        url: `/admin/subadmin`,
      },
      {
        name: "Customer",
        url: `/admin/customer`,
      },
    ],
  },
  {
    name: "Business",
    icon: "fa-solid fa-business-time",
    url: `/admin/business`,
  },
  {
    name: "Advertisement",
    icon: "fa-solid fa-bullhorn",
    url: `/admin/advertisement`,
  },
  {
    name: "Advertise With Us",
    icon: "fa-solid fa-bullseye",
    children: [
      // {
      //   name: "Dashboard",
      //   url: "/admin/advertise/advertise-pages",
      // },
      {
        name: "Ads Management",
        url: "/admin/advertise/advertise-ads",
      },
      {
        name: "Page Management",
        url: "/admin/advertise/advertise-pages",
      },
      {
        name: "Section Management",
        url: "/admin/advertise/advertise-sections",
      },
      {
        name: "Ad Logs",
        url: "/admin/advertise/advertise-logs",
      },
      {
        name: "Ad Stats",
        url: "/admin/advertise/advertise-stats",
      },
    ],
  },
  {
    name: "Plans",
    icon: "fa-solid fa-memory",
    children: [
      {
        name: "Membership Plan",
        url: `/admin/membership-plan`,
      },
      {
        name: "Add-On Plan",
        url: `/admin/addon-plan`,
      },
      {
        name: "Promotion Plan",
        url: `/admin/permotion-plan`,
      },
    ],
  },
  {
    name: "Purchased Plans",
    icon: "fa-solid fa-memory",
    children: [
      {
        name: "Membership Plan",
        url: `/admin/membership-plan-logs`,
      },
      {
        name: " Add-On Plan",
        url: `/admin/addon-plan-logs`,
      },
      {
        name: " Promotion Plan",
        url: `/admin/promotion-plan-logs`,
      },
    ],
  },
  {
    name: "Content",
    icon: "fa-regular fa-solid fa-photo-film",
    children: [
      {
        name: "Banner",
        icon: "fa-solid fa-image",
        url: `/admin/banner`,
      },
      {
        name: "CMS Pages",
        icon: "fa-solid fa-image",
        url: `/admin/cms_page`,
      },
      {
        name: "Testimonial",
        url: `/admin/testimonial`,
      },
      {
        name: "Our Team",
        url: `/admin/ourteam`,
      },
      {
        name: "Sponsor",
        url: `/admin/sponsor`,
      },
      {
        name: "FAQ Category",
        icon: "fa-solid fa-image",
        url: `/admin/faqCategory`,
      },
      {
        name: "Faq",
        url: `/admin/faq`,
      },
      {
        name: "Label",
        url: `/admin/label`,
      },
    ],
  },
  {
    name: "Enquiry",
    icon: "fa-solid fa-address-card",
    url: `/admin/enquiry`,
  },
  {
    name: "Repots Managment",
    icon: "fa-solid fa-chart-bar",
    url: `/admin/reports`,
  },
  {
    name: "Newsletter",
    icon: "fa-solid fa-file-chart-line",
    url: `/admin/newsletter`,
  },
  {
    name: "Faq Requests",
    icon: "fa-solid fa-clipboard-question",
    url: `/admin/faqrequest`,
  },
  {
    name: "Retreats",
    icon: "fa-solid fa-bench-tree",
    url: `/admin/retreat`,
  },
  {
    name: "Ad Options",
    icon: "fa-solid fa-option",
    children: [
      {
        name: "Tags",
        url: `/admin/tag`,
      },
      {
        name: "Currency",
        url: `/admin/currency`,
      },
      {
        name: "Price Unit",
        url: `/admin/priceunit`,
      },
      {
        name: "Ad Label",
        url: `/admin/adlabel`,
      },
      {
        name: "Condition",
        url: `/admin/condition`,
      },
    ],
  },
  {
    name: "Location",
    icon: "fa-solid fa-location-dot",
    children: [
      {
        name: "Country",
        url: `/admin/country`,
      },
      {
        name: "State",
        url: `/admin/state`,
      },
      {
        name: "City",
        url: `/admin/city`,
      },
    ],
  },
  {
    name: "App Setting",
    icon: "fa-solid fa-gear fa-spin",
    children: [
      {
        name: "General Setting",
        url: `/admin/general-settings/1`,
      },
      {
        name: "Email Setting",
        url: `/admin/general-settings/2`,
      },
      {
        name: "Social Links Setting",
        url: `/admin/general-settings/3`,
      },
      {
        name: "Performance Overview",
        url: `/admin/general-settings/4`,
      },
    ],
  },
];
