const exceljs = require("exceljs");

// ✅ Import your models
const Address = require("../modules/Address");
const AdminPermission = require("../modules/AdminPermission");
const Area = require("../modules/Area");
const Banner = require("../modules/Banner");
const Cart = require("../modules/Cart");
const CartTotal = require("../modules/CartTotal");
const Catagory = require("../modules/Catagory");
const City = require("../modules/City");
const ControllerAction = require("../modules/ControllerAction");
const Country = require("../modules/Country");
const Coupon = require("../modules/Coupon");
const DailyOrderFinalList = require("../modules/DailyOrderFinalList");
const DailyOrderFinalListProduct = require("../modules/DailyOrderFinalListProduct");
const DeliveryBoy = require("../modules/DeliveryBoy");
const DeliverySlot = require("../modules/DeliverySlot");
const DeliveryTimeSlot = require("../modules/DeliveryTimeSlot");
const EmailTemplate = require("../modules/EmailTemplate");
const FrProductVariants = require("../modules/FrProductVariants");
const FrProducts = require("../modules/FrProducts");
const FrProfile = require("../modules/FrProfile");
const Franchise = require("../modules/Franchise");
const FranchiseArea = require("../modules/FranchiseArea");
const FranchiseCategory = require("../modules/FranchiseCategory");
const GroupOfArea = require("../modules/GroupOfArea");
const ListControllerAction = require("../modules/ListControllerAction");
const LuckyDrawOffer = require("../modules/LuckyDrawOffer");
const LuckyDrawProducts = require("../modules/LuckyDrawProducts");
const LuckyDrawUsers = require("../modules/LuckyDrawUsers");
const Modules = require("../modules/Modules");
const Notification = require("../modules/Notification");
const OfferChild = require("../modules/OfferChild");
const Order = require("../modules/Order");
const OrderVariants = require("../modules/Order-variants");
const OrderStatus = require("../modules/OrderStatus");
const PopSlider = require("../modules/PopSlider");
const ProductImage = require("../modules/ProductImage");
const Products = require("../modules/Products");
const ProductWishlist = require("../modules/ProductWishlist");
const purchased_item = require("../modules/purchased_item");
const Roles = require("../modules/Roles");
const Settings = require("../modules/Settings");
const State = require("../modules/State");
const SubArea = require("../modules/SubArea");
const User = require("../modules/User");
const UserDevice = require("../modules/UserDevice");
const UserDeviceToken = require("../modules/UserDeviceToken");
const userip = require("../modules/userip");
const userotp = require("../modules/userotp");
const Voucher = require("../modules/Voucher");
const Wallet = require("../modules/Wallet");





const models = {
    Address,
    AdminPermission,
    Area,
    Banner,
    Cart,
    CartTotal,
    Catagory,
    City,
    ControllerAction,
    Country,
    Coupon,
    DailyOrderFinalList,
    DailyOrderFinalListProduct,
    DeliveryBoy,
    DeliverySlot,
    DeliveryTimeSlot,
    EmailTemplate,
    FrProductVariants,
    FrProducts,
    FrProfile,
    Franchise,
    FranchiseArea,
    FranchiseCategory,
    GroupOfArea,
    ListControllerAction,
    LuckyDrawOffer,
    LuckyDrawProducts,
    LuckyDrawUsers,
    Modules,
    Notification,
    OfferChild,
    Order,
    OrderVariants,
    OrderStatus,
    PopSlider,
    ProductImage,
    Products,
    ProductWishlist,
    purchased_item,
    Roles,
    Settings,
    State,
    SubArea,
    User,
    UserDevice,
    UserDeviceToken,
    userip,
    userotp,
    Voucher,
    Wallet,
};

// 🔧 Generate N distinct HSL-based hex colors
function generateDistinctColors(count) {
  const colors = [];
  const saturation = 70;
  const lightness = 90;

  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i); // evenly spaced
    const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hex = hslToHex(hue, saturation, lightness);
    colors.push(hex);
  }

  return colors;
}

// 🔧 Convert HSL to HEX
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return [f(0), f(8), f(4)]
    .map(x => x.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

// 🔧 Decide whether to use black or white text on a background
function getTextColor(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 186 ? "000000" : "FFFFFF";
}

async function exportFlowChartSchema() {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet("Flowchart Schema");

  sheet.columns = [
    { header: "Model", key: "model", width: 20 },
    { header: "Field", key: "field", width: 25 },
    { header: "Type", key: "type", width: 20 },
    { header: "Required", key: "required", width: 10 },
    { header: "Default", key: "default", width: 15 },
    { header: "Ref (Relation)", key: "ref", width: 25 },
  ];

  const modelEntries = Object.entries(models);
  const colors = generateDistinctColors(modelEntries.length);

  for (let i = 0; i < modelEntries.length; i++) {
    const [modelName, model] = modelEntries[i];
    const schemaObj = model.schema.paths;

    const bgColor = colors[i];
    const textColor = getTextColor(bgColor);

    for (const [field, fieldSchema] of Object.entries(schemaObj)) {
      if (field === "__v") continue;

      const fieldType = fieldSchema?.instance || "Mixed";
      const isRequired = !!fieldSchema?.isRequired;
      const defaultVal = fieldSchema?.defaultValue !== undefined ? String(fieldSchema.defaultValue) : "";
      const ref = fieldSchema?.options?.ref || "";

      const row = sheet.addRow({
        model: modelName,
        field,
        type: fieldType,
        required: isRequired,
        default: defaultVal,
        ref,
      });

      row.eachCell(cell => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: bgColor },
        };
        cell.font = {
          color: { argb: textColor },
        };
      });
    }

    // Add spacing row
    sheet.addRow([]);
  }

  const filePath = "./model-flowchart-schema.xlsx";
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ Excel generated: ${filePath}`);
}

module.exports = exportFlowChartSchema;
