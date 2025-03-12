import {Schema as _Schema, model} from 'mongoose';
const Schema = _Schema;

let expensesSchema =  new Schema ({
   
    date: {
        type: Date
    },
    issuedTo: {
        type: String
    },
    description: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    expenseType: {
        type: String
    },
    amount: {
        type: Number
    },
    authorisedBy : {
        type: String
    }

},{
    collection: 'expense'
})

export default model ('expense', expensesSchema)