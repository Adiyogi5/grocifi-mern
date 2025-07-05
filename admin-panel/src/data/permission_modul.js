// import menu_data from "../data/menu_data";
const permission_modul = []
const menu_data = [
   
    { id: 1, name: "Enquiry"},
    { id: 2, name: "Role" },
    { id: 3, name: "Cms_page"},
    { id: 4, name: "Category"},
    { id: 5, name: "Banner"},
    { id: 6, name: "Customer"},
    { id: 7, name: "Subadmin"},
    { id: 8, name: "Business"},
    { id: 9, name: "Advertisement"},
    { id: 10, name: "Designation"},
    { id: 11, name: "BlogAuthor"},
    { id: 12, name: "Blog"},
    { id: 13, name: "Newsletter"},
    { id: 14, name: "FaqRequest"},
    { id: 15, name: "FaqCategory"},
    { id: 16, name: "Faq" },
    { id: 17, name: "Testimonial"},
    { id: 18, name: "OurTeam"},
    { id: 19, name: "Sponsor"},
    { id: 20, name: "Location"},
    { id: 21, name: "Retreat"},
    { id: 22, name: "Country"},
    { id: 23, name: "State"},
    { id: 24, name: "City"},
    { id: 25, name: "Profile"},
    { id: 26, name: "SiteSetting"},
    { id: 27, name: "Tag"},
    { id: 28, name: "Currency"},
    { id: 29, name: "PriceUnit"},
    { id: 30, name: "AdLabel"},
    { id: 31, name: "Condition"},
];

menu_data.map((link, i) => {
    permission_modul.push({ id:1,module: link.name, all: false, view: false, add: false, edit: false, delete: false ,export:false,import:false})
})

export default permission_modul
