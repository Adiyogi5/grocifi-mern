import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { routePermission } from "./components/routePermission";

const routes = [
  {
    path: "/",
    element: React.createElement(Navigate, { to: "/admin", replace: true }),
  },
  {
    path: "/admin",
    lazy: async () => {
      let module = await import("./layouts/AdminLayout");
      return { Component: module.default };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          let module = await import("./routes/admin/Dashboard");
          return { Component: module.default };
        },
      },
      {
        path: "dashboard",
        lazy: async () => {
          let module = await import("./routes/admin/Dashboard");
          return { Component: module.default };
        },
      },
      {
        path: "profile",
        lazy: async () => {
          let module = await import("./routes/admin/auth/Profile");
          return { Component: routePermission(module.default, "Profile") };
        },
      },
    
      // ---- Role route --------------
      {
        path: "role",
        lazy: async () => {
          let module = await import("./routes/admin/role/RoleList");
          return { Component: routePermission(module.default, "Role") };
          // return { Component: module.default };
        },
      },
      {
        path: "role/permission/:id",
        lazy: async () => {
          let module = await import("./routes/admin/role/Permission");
          return { Component: routePermission(module.default, "Role", "edit") };
        },
      },
      
      // --------- Subadmin Route ----------
       // --------- Subadmin Route ----------
      {
        path: "subadmin",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/ListSubadmin");
          return { Component: routePermission(module.default, "Subadmin") };
        },
      },
      {
        path: "subadmin/add",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/AddSubadmin");
          return { Component: routePermission(module.default, "Subadmin", "add") };
        },
      },
      {
        path: "subadmin/edit/:id",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/EditSubadmin");
          return { Component: routePermission(module.default, "Subadmin", "edit") };
        },
      },
      {
        path: "subadmin/permission/:id",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/PermissionSubadmin");
          return { Component: routePermission(module.default, "Subadmin", "edit") };
        },
      },
      // --------- Franchise Route ----------
      {
        path: "franchise",
        lazy: async () => {
          let module = await import("./routes/admin/franchise/ListFranchise");
          return { Component: routePermission(module.default, "Franchise") };
        },
      },
      {
        path: "franchise/add",
        lazy: async () => {
          let module = await import("./routes/admin/franchise/AddFranchise");
          return { Component: routePermission(module.default, "Franchise", "add") };
        },
      },
      {
        path: "franchise/edit/:id",
        lazy: async () => {
          let module = await import("./routes/admin/franchise/EditFranchise");
          return { Component: routePermission(module.default, "Franchise", "edit") };
        },
      },
      // --------- Customer Route ----------
      {
        path: "customer",
        lazy: async () => {
          let module = await import("./routes/admin/customer/ListCustomer");
          return { Component: routePermission(module.default, "Customer") };
        },
      },
      {
        path: "customer/add",
        lazy: async () => {
          let module = await import("./routes/admin/customer/AddCustomer");
          return { Component: routePermission(module.default, "Customer", "add") };
        },
      },
      {
        path: "customer/edit/:id",
        lazy: async () => {
          let module = await import("./routes/admin/customer/EditCustomer");
          return { Component: routePermission(module.default, "Customer", "edit") };
        },
      },
      
      // --------- Delivery Boy Route ----------
      {
        path: "delivery-boys",
        lazy: async () => {
          let module = await import("./routes/admin/deliveryboy/ListDeliveryBoy");
          return { Component: routePermission(module.default, "DeliveryBoy") };
        },
      },
      {
        path: "delivery-boys/add",
        lazy: async () => {
          let module = await import("./routes/admin/deliveryboy/AddDeliveryBoy");
          return { Component: routePermission(module.default, "DeliveryBoy", "add") };
        },
      },
      {
        path: "delivery-boys/edit/:id",
        lazy: async () => {
          let module = await import("./routes/admin/deliveryboy/EditDeliveryBoy");
          return { Component: routePermission(module.default, "DeliveryBoy", "edit") };
        },
      },
   
       // --------- General Settings and Logout ----------  
      {
        path: "general-settings/:type",
        lazy: async () => {
          let module = await import("./routes/admin/GeneralSettings");
          return { Component: routePermission(module.default, "SiteSetting") };
        },
      },
      {
        path: "logout",
        lazy: async () => {
          let module = await import("./routes/admin/auth/Logout");
          return { Component: module.default };
        },
      },

      {
        path: "permissionDenied",
        lazy: async () => {
          let module = await import("./routes/admin/errors/permissionDenied");
          return { Component: module.default };
        },
      },
    ],
  },
  {
    path: "/admin",
    lazy: async () => {
      let module = await import("./layouts/AdminAuthLayout");
      return { Component: module.default };
    },
    children: [
      {
        path: "login",
        lazy: async () => {
          let module = await import("./routes/admin/auth/Login");
          return { Component: module.default };
        },
      },
      {
        path: "forgot-password",
        lazy: async () => {
          let module = await import("./routes/admin/auth/ForgetPassword");
          return { Component: module.default };
        },
      },
      {
        path: "reset-password/:token",
        lazy: async () => {
          let module = await import("./routes/admin/auth/ResetPassword");
          return { Component: module.default };
        },
      },

      {
        path: "*",
        lazy: async () => {
          let module = await import("./routes/admin/errors/NotFoundPage");
          return { Component: module.default };
        },
      },
    ],
  },
];

const routerConfig = {
  basename: import.meta.env.BASE_URL,
};

export default createBrowserRouter(routes, routerConfig);
