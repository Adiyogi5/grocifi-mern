const mongoose = require('mongoose');

var LuckyDrawUsersSchema = new mongoose.Schema({
    luckydraw_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    product_id:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    user_id:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    order_id:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    coupon:{
      type:String,
      required:true
    },
    is_winner:{
        type:String,
        default:'0'        //// 0= not winner, 1=winner
    },
    created:{
        type:Date,
        default:Date.now()
    },
    modified:{
        type:Date,
        default:Date.now()
    } 
});

var luckydrawuserModel = mongoose.model('lucky_draw_users',LuckyDrawUsersSchema);

module.exports = luckydrawuserModel;
