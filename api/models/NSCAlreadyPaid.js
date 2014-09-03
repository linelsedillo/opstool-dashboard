/**
* NSCAlreadyPaid.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {


    connection:["mysql"],
    // migrate:'alter',


    attributes: {

    	ren_guid: { type: 'STRING' },
        staff_account : { type: 'STRING' },
        account_name : { type: 'STRING' },
        date_paid : 'DATETIME'
    }
};

