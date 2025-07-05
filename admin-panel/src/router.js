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
      //  Banner Route ----------------------
      {
        path: "banner",
        lazy: async () => {
          let module = await import("./routes/admin/banner/Banner");
          return { Component: routePermission(module.default, "Banner") };
          // return { Component: module.default };
        },
      },
      {
        path: "banner/add",
        lazy: async () => {
          let module = await import("./routes/admin/banner/AddBanners");
          return {
            Component: routePermission(module.default, "Banner", "add"),
          };
        },
      },
      {
        path: "banner/add-main-slider-banner",
        lazy: async () => {
          let module = await import("./routes/admin/banner/AddMainBanner.jsx");
          return {
            Component: routePermission(module.default, "Banner", "add"),
          };
        },
      },
      {
        path: "banner/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/banner/EditBanner");
          return {
            Component: routePermission(module.default, "Banner", "edit"),
          };
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
      {
        path: "newsletter",
        lazy: async () => {
          let module = await import("./routes/admin/Newsletter");
          return { Component: routePermission(module.default, "Newslettere") };
        },
      },
      {
        path: "faqrequest",
        lazy: async () => {
          let module = await import("./routes/admin/FaqRequest");
          return { Component: routePermission(module.default, "FaqRequest") };
        },
      },
      {
        path: "faq",
        lazy: async () => {
          let module = await import("./routes/admin/Faq");
          return { Component: routePermission(module.default, "Faq") };
        },
      },
      {
        path: "label",
        lazy: async () => {
          let module = await import("./routes/admin/Label");
          return { Component: routePermission(module.default, "Label") };
        },
      },
      {
        path: "tag",
        lazy: async () => {
          let module = await import("./routes/admin/option/Taglist");
          // return { Component: routePermission(module.default, 'Tag')};
          return { Component: module.default };
        },
      },
      {
        path: "currency",
        lazy: async () => {
          let module = await import("./routes/admin/option/CurrencyList");
          return { Component: module.default };
        },
      },
      {
        path: "condition",
        lazy: async () => {
          let module = await import("./routes/admin/option/ConditionList");
          return { Component: module.default };
        },
      },
      {
        path: "priceunit",
        lazy: async () => {
          let module = await import("./routes/admin/option/PriceUnitList");
          return { Component: module.default };
        },
      },
      {
        path: "adlabel",
        lazy: async () => {
          let module = await import("./routes/admin/option/AdLabelList");
          return { Component: module.default };
        },
      },
      {
        path: "sponsor",
        lazy: async () => {
          let module = await import("./routes/admin/Sponsor");
          return { Component: routePermission(module.default, "Sponsor") };
        },
      },
      {
        path: "ourteam",
        lazy: async () => {
          let module = await import("./routes/admin/OurTeam");
          return { Component: routePermission(module.default, "OurTeam") };
        },
      },
      {
        path: "testimonial",
        lazy: async () => {
          let module = await import("./routes/admin/Testimonial");
          return { Component: routePermission(module.default, "Testimonial") };
        },
      },

      // ---- Plans route --------------
      {
        path: "membership-plan",
        lazy: async () => {
          let module = await import("./routes/admin/plan/MembershipPlan.jsx");
          return {
            Component: routePermission(module.default, "MamberShipPlan"),
          };
        },
      },

      {
        path: "addon-plan",
        lazy: async () => {
          let module = await import("./routes/admin/plan/AddOnPlan.jsx");
          return { Component: routePermission(module.default, "Testimonial") };
        },
      },
      {
        path: "permotion-plan",
        lazy: async () => {
          let module = await import("./routes/admin/plan/PromotionPlan.jsx");
          return { Component: routePermission(module.default, "Testimonial") };
        },
      },

      // ---- Plans logs route --------------
      {
        path: "membership-plan-logs",
        lazy: async () => {
          let module = await import(
            "./routes/admin/plan_logs/MembershipPlanLogs.jsx"
          );
          return { Component: routePermission(module.default, "Testimonial") };
        },
      },
      {
        path: "membership-view/:id",
        lazy: async () => {
          let module = await import(
            "./routes/admin/plan_logs/ViewMamberShipPlan.jsx"
          );
          return {
            Component: routePermission(module.default, "MamberShipPlan"),
          };
        },
      },
      {
        path: "addon-plan-logs",
        lazy: async () => {
          let module = await import(
            "./routes/admin/plan_logs/AddOnPlanLogs.jsx"
          );
          return { Component: routePermission(module.default, "Testimonial") };
        },
      },
      {
        path: "addon-view/:id",
        lazy: async () => {
          let module = await import(
            "./routes/admin/plan_logs/viewAddOnPlan.jsx"
          );
          return { Component: routePermission(module.default, "AddOnPlan") };
        },
      },
      {
        path: "promotion-plan-logs",
        lazy: async () => {
          let module = await import(
            "./routes/admin/plan_logs/PromotionPlanLogs.jsx"
          );
          return { Component: routePermission(module.default, "Testimonial") };
        },
      },
      {
        path: "promotion-view/:id",
        lazy: async () => {
          let module = await import(
            "./routes/admin/plan_logs/viewPromotionPlan.jsx"
          );
          return {
            Component: routePermission(module.default, "PromotionPlan"),
          };
        },
      },
      //  {
      //     path: "plan/add",
      //     lazy: async () => {
      //         let module = await import("./routes/admin/Testimonial");
      //         return { Component: routePermission(module.default, 'Testimonial')};
      //     },
      // },
      // {
      //     path: "plan/edit",
      //     lazy: async () => {
      //         let module = await import("./routes/admin/Testimonial");
      //         return { Component: routePermission(module.default, 'Testimonial')};
      //     },
      // },

      // ---- designation route --------------
      {
        path: "designation",
        lazy: async () => {
          let module = await import(
            "./routes/admin/designation/DesignationList"
          );
          return { Component: routePermission(module.default, "Designation") };
        },
      },
      // ---- FaqCategory route --------------
      {
        path: "faqCategory",
        lazy: async () => {
          let module = await import("./routes/admin/faqcategory/FaqCategory");
          return { Component: routePermission(module.default, "FaqCategory") };
        },
      },
      // ----------------
      {
        path: "cms_page",
        lazy: async () => {
          let module = await import("./routes/admin/cms_pages/listCms");
          return { Component: routePermission(module.default, "Cms_page") };
        },
      },
      {
        path: "cms_page/add",
        lazy: async () => {
          let module = await import("./routes/admin/cms_pages/addCms");
          return {
            Component: routePermission(module.default, "Cms_page", "add"),
          };
        },
      },
      {
        path: "cms_page/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/cms_pages/editCms");
          return {
            Component: routePermission(module.default, "Cms_page", "edit"),
          };
        },
      },
      // --------- Subadmin Route ----------
      {
        path: "subadmin",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/listSubadmin");
          return { Component: routePermission(module.default, "Subadmin") };
        },
      },
      {
        path: "subadmin/add",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/addSubadmin");
          return {
            Component: routePermission(module.default, "Subadmin", "add"),
          };
        },
      },
      {
        path: "subadmin/edit/:id",
        lazy: async () => {
          let module = await import("./routes/admin/subadmin/editSubadmin");
          return {
            Component: routePermission(module.default, "Subadmin", "edit"),
          };
        },
      },
      {
        path: "subadmin/permission/:id",
        lazy: async () => {
          // return false
          let module = await import(
            "./routes/admin/subadmin/permissionSubadmin"
          );
          return {
            Component: routePermission(module.default, "Subadmin", "edit"),
          };
        },
      },

      // ------------------customer route ------------
      {
        path: "customer",
        lazy: async () => {
          let module = await import("./routes/admin/customer/listCustomer");
          return { Component: routePermission(module.default, "Customer") };
        },
      },
      {
        path: "customer/add",
        lazy: async () => {
          let module = await import("./routes/admin/customer/addCustomer");
          return {
            Component: routePermission(module.default, "Customer", "add"),
          };
        },
      },
      {
        path: "customer/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/customer/editCustomer");
          return {
            Component: routePermission(module.default, "Customer", "edit"),
          };
        },
      },

      // ------------------------ ENd --------------------
      // ------------------------ Categroy Route --------------------
      {
        path: "category",
        lazy: async () => {
          let module = await import("./routes/admin/category/CategoryList");
          return { Component: routePermission(module.default, "Category") };
        },
      },
      {
        path: "category/add",
        lazy: async () => {
          let module = await import("./routes/admin/category/categoryAdd");
          return {
            Component: routePermission(module.default, "Category", "add"),
          };
        },
      },
      {
        path: "category/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/category/categoryEdit");
          return {
            Component: routePermission(module.default, "Category", "edit"),
          };
        },
      },
      // ------------------------ ENd --------------------

      //  ----------------------Sub categories Start---------------------

      {
        path: "subcategory",
        lazy: async () => {
          let module = await import(
            "./routes/admin/subCategories/subCategoryList"
          );
          return { Component: routePermission(module.default, "Category") };
        },
      },
      {
        path: "subcategory/add",
        lazy: async () => {
          let module = await import(
            "./routes/admin/subCategories/subCategoryAdd"
          );
          return {
            Component: routePermission(module.default, "subCategoryAdd", "add"),
          };
        },
      },
      {
        path: "subcategory/edit/:slug",
        lazy: async () => {
          let module = await import(
            "./routes/admin/subCategories/subCategoryEdit"
          );
          return {
            Component: routePermission(
              module.default,
              "subCategoryEdit",
              "edit"
            ),
          };
        },
      },

      //  ----------------------Sub categories End---------------------

      //-----------------------------Child Category Start-----------------------------------
      {
        path: "child_category",
        lazy: async () => {
          let module = await import(
            "./routes/admin/childCategory/childCategoryList"
          );
          return {
            Component: routePermission(module.default, "childCategoryList"),
          };
        },
      },
      {
        path: "child_category/add",
        lazy: async () => {
          let module = await import(
            "./routes/admin/childCategory/childCategoryAdd"
          );
          return {
            Component: routePermission(
              module.default,
              "childCategoryAdd",
              "add"
            ),
          };
        },
      },
      {
        path: "child_category/edit/:slug",
        lazy: async () => {
          let module = await import(
            "./routes/admin/childCategory/childCategoryEdit"
          );
          return {
            Component: routePermission(
              module.default,
              "childCategoryEdit",
              "edit"
            ),
          };
        },
      },
      //-----------------------------Child Category End-----------------------------------

      // ------------------------ Business --------------------
      {
        path: "business",
        lazy: async () => {
          let module = await import("./routes/admin/business/listBusiness");
          return { Component: routePermission(module.default, "Business") };
        },
      },
      {
        path: "business/add",
        lazy: async () => {
          let module = await import("./routes/admin/business/addBusiness");
          return {
            Component: routePermission(module.default, "Business", "add"),
          };
        },
      },
      {
        path: "business/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/business/editBusiness");
          return {
            Component: routePermission(module.default, "Business", "edit"),
          };
        },
      },
      {
        path: "business/view/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/business/viewBusiness");
          return {
            Component: routePermission(module.default, "Business", "edit"),
          };
        },
      },
      // ------------------------ BlogAuther --------------------
      {
        path: "blogauthor",
        lazy: async () => {
          let module = await import("./routes/admin/blogauthor/listBlogAuthor");
          return { Component: routePermission(module.default, "BlogAuthor") };
        },
      },
      {
        path: "blogauthor/add",
        lazy: async () => {
          let module = await import("./routes/admin/blogauthor/addBlogAuthor");
          return {
            Component: routePermission(module.default, "BlogAuthor", "add"),
          };
        },
      },
      {
        path: "blogauthor/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/blogauthor/editBlogAuthor");
          return {
            Component: routePermission(module.default, "BlogAuthor", "edit"),
          };
        },
      },

      // ------------------------ Blog  --------------------
      {
        path: "blog",
        lazy: async () => {
          let module = await import("./routes/admin/blog/listBlog");
          return { Component: routePermission(module.default, "Blog") };
        },
      },
      {
        path: "blog/add",
        lazy: async () => {
          let module = await import("./routes/admin/blog/addBlog");
          return { Component: routePermission(module.default, "Blog", "add") };
        },
      },
      {
        path: "blog/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/blog/editBlog");
          return { Component: routePermission(module.default, "Blog", "edit") };
        },
      },
      {
        path: "chat",
        lazy: async () => {
          let module = await import("./routes/admin/Chat/ChatApp");
          return { Component: routePermission(module.default, "ChatApp") };
        },
      },
      // ------------------------ Advertisement --------------------
      {
        path: "advertisement",
        lazy: async () => {
          let module = await import(
            "./routes/admin/advertisement/listAdvertisement"
          );
          return {
            Component: routePermission(module.default, "advertisement"),
          };
        },
      },
      {
        path: "advertisement/add",
        lazy: async () => {
          let module = await import(
            "./routes/admin/advertisement/addAdvertisement"
          );
          return {
            Component: routePermission(module.default, "advertisement", "add"),
          };
        },
      },
      {
        path: "advertisement/edit/:id",
        lazy: async () => {
          let module = await import(
            "./routes/admin/advertisement/editAdvertisement"
          );
          return {
            Component: routePermission(module.default, "advertisement", "edit"),
          };
        },
      },
      {
        path: "advertisement/view/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/advertisement/viewAds");
          return {
            Component: routePermission(module.default, "advertisement", "edit"),
          };
        },
      },

      {
        path: "advertise-dashboard",
        lazy: async () => {
          let module = await import("./routes/admin/AdvertiseWithUs/AdminDashboard.jsx");
          return { Component: routePermission(module.default, "Dashboard") };
        },
      },
      {
        path: "advertise/advertise-ads",
        lazy: async () => {
          let module = await import("./routes/admin/AdvertiseWithUs/AdsManagement");
          return { Component: routePermission(module.default, "AdsManagement") };
        },
      },
      {
        path: "advertise/advertise-pages",
        lazy: async () => {
          let module = await import("./routes/admin/AdvertiseWithUs/PageManagement.jsx");
          return { Component: routePermission(module.default, "PageManagement") };
        },
      },
      {
        path: "advertise/advertise-sections",
        lazy: async () => {
          let module = await import("./routes/admin/AdvertiseWithUs/SectionManagement");
          return { Component: routePermission(module.default, "SectionManagement") };
        },
      },
      {
        path: "advertise/advertise-logs",
        lazy: async () => {
          let module = await import("./routes/admin/AdvertiseWithUs/AdLogs");
          return { Component: routePermission(module.default, "AdLogs") };
        },
      },
      {
        path: "advertise/advertise-stats",
        lazy: async () => {
          let module = await import("./routes/admin/AdvertiseWithUs/AdStats");
          return { Component: routePermission(module.default, "AdStats") };
        },
      },

      {
        path: "country",
        lazy: async () => {
          let module = await import("./routes/admin/locations/Country");
          return { Component: routePermission(module.default, "Country") };
        },
      },
      {
        path: "state",
        lazy: async () => {
          let module = await import("./routes/admin/locations/State");
          return { Component: routePermission(module.default, "State") };
        },
      },
      {
        path: "city",
        lazy: async () => {
          let module = await import("./routes/admin/locations/City");
          return { Component: routePermission(module.default, "City") };
        },
      },

      {
        path: "retreat",
        lazy: async () => {
          let module = await import("./routes/admin/retreat/Retreat");
          return { Component: routePermission(module.default, "Retreat") };
        },
      },
      {
        path: "retreat/add",
        lazy: async () => {
          let module = await import("./routes/admin/retreat/AddRetreat");
          return {
            Component: routePermission(module.default, "Retreat", "add"),
          };
        },
      },
      {
        path: "retreat/edit/:slug",
        lazy: async () => {
          let module = await import("./routes/admin/retreat/EditRetreat");
          return {
            Component: routePermission(module.default, "Retreat", "edit"),
          };
        },
      },
      {
        path: "enquiry",
        lazy: async () => {
          let module = await import("./routes/admin/Enquiry");
          return { Component: routePermission(module.default, "Enquiry") };
        },
      },
      {
        path: "reports",
        lazy: async () => {
          let module = await import("./routes/admin/Reports");
          return { Component: routePermission(module.default, "Reports") };
        },
      },
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
