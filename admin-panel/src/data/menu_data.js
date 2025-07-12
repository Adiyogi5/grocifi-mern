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
    ],
  },

  {
    name: "Users",
    icon: "fa-solid fa-user-tie",
    children: [
      {
        name: "Admin and Sub Admin",
        url: `/admin/subadmin`,
      },
      {
        name: "Franchise",
        url: `/admin/franchise`,
      },
      {
        name: "Customer",
        url: `/admin/customer`,
      },
      {
        name: "Delivery Boys",
        url: `/admin/delivery-boys`,
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
        name: "Mobile App Setting",
        url: `/admin/general-settings/2`,
      },
      {
        name: "SMS Setting",
        url: `/admin/general-settings/3`,
      },
      {
        name: "Payment Setting",
        url: `/admin/general-settings/4`,
      },
      {
        name: "Refer Setting",
        url: `/admin/general-settings/5`,
      },
      {
        name: "Order Setting",
        url: `/admin/general-settings/6`,
      },
    ],
  },
];
