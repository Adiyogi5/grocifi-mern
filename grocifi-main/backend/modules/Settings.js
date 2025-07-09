const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    site_name: {
        type: String,
        default: null
    },
    logo: {
        type: String,
        default: null
    },
    logowhite: {
        type: String,
        default: null
    },
    favicon: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    fcm_Id: {
        type: String,
        default: null
    },
    mobile_no: {
        type: String,
        default: null
    },
    current_version_app: {
        type: String,
        default: null
    },
    mini_version: {
        type: String,
        default: null
    },
    from_email: {
        type: String,
        default: null
    },
    reply_email: {
        type: String,
        default: null
    },
    short_link: {
        type: String,
        default: null
    },
    earn_msg: {
        type: String,
        default: null
    },
    use_refer_code_amount: {
        type: Number,
        default: null
    },
    wallet_expire_days: {
        type: Number,
        default: null
    },
    system_configurations: {
        type: Number,
        default: null
    },
    delivery_refund_limit: {
        type: Number,
        default: null
    },
    system_timezone_gmt: {
        type: String,
        default: null
    },
    system_configurations_id: {
        type: Number,
        default: null
    },
    app_name: {
        type: String,
        default: null
    },
    support_number: {
        type: String,
        default: null
    },
    support_email: {
        type: String,
        default: null
    },
    currency: {
        type: String,
        default: null
    },
    min_amount: {
        type: Number,
        default: null
    },
    min_refer_earn_order_amount: {
        type: Number,
        default: null
    },
    refer_earn_bonus: {
        type: Number,
        default: null
    },
    refer_earn_method: {
        type: String,
        default: null
    },
    max_refer_earn_amount: {
        type: String,
        default: null
    },
    minimum_withdrawal_amount: {
        type: Number,
        default: null
    },
    max_product_return_days: {
        type: String,
        default: null
    },
    delivery_boy_bonus_percentage: {
        type: String,
        default: null
    },
    friend_one_earn: {
        type: String,
        default: null
    },
    friend_two_earn: {
        type: String,
        default: null
    },
    friend_three_earn: {
        type: String,
        default: null
    },
    friend_four_earn: {
        type: String,
        default: null
    },
    friend_five_earn: {
        type: String,
        default: null
    },

    friend_one_earn_percentage: {
        type: String,
        default: null
    },
    friend_two_earn_percentage: {
        type: String,
        default: null
    },
    friend_three_earn_percentage: {
        type: String,
        default: null
    },
    friend_four_earn_percentage: {
        type: String,
        default: null
    },
    friend_five_earn_percentage: {
        type: String,
        default: null
    },
    expiry_day: {
        type: String,
        default: null
    },
    version_code: {
        type: Number,
        default: null
    },
    share_msg: {
        type: String,
        default: null
    },
    min_order: {
        type: String,
        default: null
    },
    min_order_wholesaler: {
        type: String,
        default: null
    },
    free_delivery_message: {
        type: String,
        default: null
    },
    min_ordermsg: {
        type: String,
        default: null
    },
    delivery_chrge: {
        type: String,
        default: null
    },
    force_update: {
        type: Boolean,
        default: true
    },
    accept_minimum_order: {
        type: Boolean,
        default: true
    },
    is_refer: { //user can refer and get amount
        type: Boolean,
        default: true
    },
    is_orderrefer: { //user can get refer amount on order
        type: Boolean,
        default: true
    },
    email_on_status: { //email on order status change
        type: Boolean,
        default: true
    },
    sms_on_status: { //sms on order status change
        type: Boolean,
        default: true
    },
    email_on_wallet: { //email on wallet update
        type: Boolean,
        default: true
    },
    sms_on_wallet: { //sms on wallet update
        type: Boolean,
        default: true
    },
    email_on_general: { //email from admin panel on notification
        type: Boolean,
        default: true
    },
    sms_on_general: { //sms allow for login & register
        type: Boolean,
        default: true
    },
    razor_key_id: {
        type: String,
        default: null
    },
    razor_key_secret: {
        type: String,
        default: null
    },
    key_fcm_id: {
        type: String,
        default: null
    },
    refmsg_onRegistration: {
        type: String,
        default: null
    },
    checkout_deliveryChargeMessage: {
        type: String,
        default: null
    },
    cms_content: Array,
    /** 1.About US  2.ContactUS 3.FAQ 4.Terms & Conditions 5.Privacy Policy, 6.franchise, 7.referandearn, 8. home footer UI*/

    tax: {
        type: Number,
        default: '0.0'
    },
    site_address: {
        type: String
    },
    fb_link: {
        type: String
    },
    insta_link: {
        type: String
    },
    textLocalHash: {
        type: String
    },
    textLocalUser: {
        type: String
    },
    textLocalSender: {
        type: String
    },
    web_url: {
        type: String
    },
    api_url: {
        type: String
    },
    free_msg: {
        type: String
    },
    footer_text: {
        type: String
    },
    video_code: String,
    device_reg_msg: String,

    reg_required: { //restro
        type: Boolean
    },
    give_reg_amount: { //restro
        type: Boolean
    },
    refer_earn: { //restro
        type: Boolean
    },
    cat_column: { //restro
        type: Number
    },
    delivery_day_after_order: {
        type: Number
    },
    delivery_max_day: {
        type: Number
    },
    review_of_days: {
        type: Number
    },
    ad_flag: {
        type: Boolean
    },
    ad_img: {
        type: String
    },
    cart_note: {
        type: String
    },
    delivery_time_full_note: {
        type: String
    },
    delivery_time_note: {
        type: String
    },
    is_cod: {
        type: Boolean,
        default: true
    },
    is_razorpay: {
        type: Boolean,
        default: true
    },
    is_paytm: {
        type: Boolean,
        default: true
    },
    is_marg: {
        type: Boolean,
        default: false
    },
    marg_ApiUrl: {
        type: String,
        default: ''
    },   
    marg_companycode: {
        type: String,
        default: ''
    }, 
    maintainance_mode: {
        type: Boolean,
        default: false
    },
    force_update_text: {
        type: String
    },
    androidurl: {
        type: String
    },
    iosurl: {
        type: String
    },
    maintanance_url: {
        type: String
    },
    maintainance_text: {
        type: String
    },
    marg_Id: {
        type: String,
        default: ''
    },
    marg_Key: {
        type: String,
        default: ''
    },
    marg_Proentry_date: {
        type: Date,
        default: null
    },
    marg_autoentry_date: {
        type: Date,
        default: null
    },
    is_wholesaler: {
        type: Number,
        default: 0
    },
    maplink: {
        type: String
    },
    gst_number: {
        type: String,
        default: null
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    modified: {
        type: Date,
        default: Date.now(),
    }
});

const settingModel = mongoose.model("setting", settingSchema);

module.exports = settingModel;