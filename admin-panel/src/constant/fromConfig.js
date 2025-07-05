import DEFAULT_IMAGE from "../assets/images/admin/team/avatar.png"
export { DEFAULT_IMAGE };

export const FILE_SIZE = 2 * 1024 * 1024;
export const FILE_SIZE_video = 10 * 1024 * 1024;
export const MAX_INPUT_AMOUNT = 100000000;

export const SUPPORTED_FORMATS_IMAGE = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    'image/png'
];

export const SUPPORTED_FORMATS_VIDEO = [
    "video/mp4",
    "video/mkv",
    "video/avi",
];

export const SUPPORTED_FORMATS_DOC = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/pdf',
    'application/vnd.rar'
];

export const RETREAT_STATUS = [
    { id: 1, name: "Sold Out" },
    { id: 2, name: "Completed" },
    { id: 3, name: "Book Now" }
]

export const STATUS = [
    { id: 1, name: "Active" },
    { id: 2, name: "In-Active" },
]

export const LABELTYPE = [
    { id: 'day', name: "Day" },
    { id: 'new', name: "View" },
]

export const LABELPLACE = [
    { id: 'top-left', name: "Top Left" },
    { id: 'top-right', name: "Top Right" },
    { id: 'bottom-left', name: "Bottom Left" },
    { id: 'bottom-right', name: "Bottom Right" },
]

export const RATING = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
]

export const ISFEATURE = [
    { id: 2, name: "False" },
    { id: 1, name: "True" }
]

export const PRICETYPE = [
    { id: 1, name: "Fixed" },
    { id: 2, name: "Negotiable" }
]


export const GENDER = [
    { id: "Male", name: "Male" },
    { id: "Female", name: "Female" },
    { id: "Other", name: "Other" },
]


export const PHONE_REG_EXP = /^(?:(?:\+|0{0,2})91(\s*|[-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;


export const ENQUERY_FORM_TYPES = [
    { label: "Contact Us", value: 1 },
    { label: "Join The Team", value: 2 },
    { label: "Partner With Us", value: 3 },
    { label: "Recharge Query", value: 4 },
    { label: "In-Charge Query ", value: 5 },
]

export const PAGELIST =   [
    { id: "home", name: 'Home' },
    { id: "about", name: 'About' },
    { id: "contact", name: "Contact" },
    { id: "products ", name: "Products" },
    { id: "services ", name: "Services" }
]

export const SECTIONLIST =   [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: "3" },
    { id: 4 ,name: "4" },
    { id: 5, name: "5" }
]

export const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

export const CONFIG_GST = 18



export const PLAN_TYPE = [
    { id: "free", name: "Free" },
    { id: "paid", name: "Paid" },
]

export const AddOnPlan_TYPE = [
    { id: "ads", name: "Ads" },
    { id: "life", name: "Life" },
]

export const PromotionPlan_TYPE = [
    { id: "featured", name: "Featured" },
    { id: "top", name: "Top" },
    { id: "bump up", name: "Bump Up" },
    { id: "similar", name: "Similar" },

]

export const PromotionFor = [
    { id: "advertisement", name: "Advertisement" },
    { id: "business", name: "Business" }
]

export const PLAN_DURATION = [
    { id: 1, name: "Monthly" },
    { id: 12, name: "yearly" },
]

export const DURATION_TYPE = [
    { id: 'days', name: "Day" },
    { id: 'months', name: "Month" },
    { id: 'years', name: "Year" },
]


export const PLAN_FEATURES = [
    { id: 'category', name: 'Category' },
    { id: 'description_words_limit', name: 'Description words limit' },
    { id: 'tag_limit', name: 'Tag limit' },
    { id: 'attachment', name: 'Attachment' },
    { id: 'image_upload_limit', name: 'Image upload limit' },
    { id: 'video_url', name: 'Video url' },
  ]
  export const CURRENCY = '₹'