// E:\adpostman\backend\src\helpers\constant.js

const PageList = ['home', 'about', 'contact', 'products', 'services'];

const STATUS = [
  { id: 1, name: "Active" },
  { id: 2, name: "In-Active" },
];


const ADSTATUS = [
  { id: -1, name: "Draft"},
  { id: 1, name: "Live Ads"},
  { id: 2, name: "Pending"},
  { id: 3, name: "Expired"},
];

const LABELTYPE = [
  { id: 'day', name: "Day" },
  { id: 'new', name: "View" },
];

const ADDLABEL = [
  { id: 'sale', name: "For Sale" },
  { id: 'rent', name: "For Rent" },
  { id: 'wanted', name: "Wanted" },
];

const CONDITION = [
  { id: 'new', name: "New" },
  { id: 'used', name: "Used" },
];

const OPENING_HOURS = [
  { id: 'selected', name: "Selected Hours" },
  { id: 'alwas', name: "Always Open" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const LABELPLACE = [
  { id: 'top-left', name: "Top Left" },
  { id: 'top-right', name: "Top Right" },
  { id: 'bottom-left', name: "Bottom Left" },
  { id: 'bottom-right', name: "Bottom Right" },
];

const RATING = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
];

const ISFEATURE = [
  { id: 2, name: "False" },
  { id: 1, name: "True" },
];

const PRICETYPE = [
  { id: 1, name: "Fixed" },
  { id: 2, name: "Negotiable" },
  { id: 3, name: "On Call" },
];

const CURRENCY = [
  { id: 1, name: "INR" },
];

const PRICEUNIT = [
  { id: 1, name: "No Unit" },
];

const PRICING = [
  { id: "single", name: "Single" },
  { id: 'range', name: "Price Range" },
];

const GENDER = [
  { id: "Male", name: "Male" },
  { id: "Female", name: "Female" },
  { id: "Other", name: "Other" },
];

const DURATION_TYPE = [
    { id: 'days', name: "Day" },
    { id: 'months', name: "Month" },
    { id: 'years', name: "Year" },
]


module.exports = {
  PageList,
  STATUS,
  LABELTYPE,
  ADDLABEL,
  CONDITION,
  OPENING_HOURS,
  DAYS,
  LABELPLACE,
  RATING,
  ISFEATURE,
  PRICETYPE,
  CURRENCY,
  PRICEUNIT,
  PRICING,
  GENDER,
  DURATION_TYPE,
  ADSTATUS};
