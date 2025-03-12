import { Schema as _Schema, model}  from 'mongoose';
const Schema = _Schema;

let stocksSchema = new Schema ({
date : {
      type: Date
},
supplierName: {
      type: String
},
stockDescription: {
      type: String
},
stockQuantity: {
      type: String
},
transportCost: {
      type: Number
},
buyingPrice: {
      type: String
},
sellingPrice: {
      type: String
},
receivedBy: {
      type: String
}


},{
      collection: 'stocks'
})

export default model ('stocks', stocksSchema)