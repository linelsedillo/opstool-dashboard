/**
 * OpsdashboardController
 *
 * @description :: Server-side logic for managing opsdashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var $ = require('jquery-deferred');

module.exports = {


    widget:function(req,res) {


        res.setHeader('content-type', 'application/javascript');

        ADCore.comm.success(res, [
            { id:'000001', title:'Title',  type:'table', config:{ url:'/url/here', fields:['field1', 'field2'] }},
            { id:'000002', title:'NSC: to be paid', type:'tableUpdateNSC', config:{ url:'/opsdashboard/nsctobepaid', url_paid:'/opsdashboard/nscpaid', fields:['staff_number', 'account_name']}},
            { id:'000003', title:'NSC: already paid', mode:'paid',  type:'tableUpdateNSC', config:{ url:'/opsdashboard/nscalreadypaid', fields:['staff_number', 'account_name']}},
            { id:'000004', title:'Staff account info', type:'table', config:{ url:'/opsdashboard/staffaccountinfo', fields:['item', 'value']}}
        ]);


    },


    nsctobepaid:function(req, res) {

        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        // this socket needs to be notified of any new NSCAlreadyPaid entries
        if (req.isSocket) {
console.log('subscribers before watch():');
console.log(NSCAlreadyPaid.subscribers());
console.log('socket:');
console.log(req.socket);

            NSCAlreadyPaid.watch(req.socket);

console.log('subscribers after watch():');
console.log(NSCAlreadyPaid.subscribers());
        }

        var date = new Date();

        var monthBeginning = new Date(date.getFullYear(), date.getMonth(), 1);
        var monthEnding = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        var foundPaid = findAlreadyPaidStaffThisMonth(monthBeginning, monthEnding);


        var foundStaff = NSSAPI.staffForNSC('vincent.tong');

        $.when(foundPaid, foundStaff)
        .then(function(allPaid, allStaff){


            // 1) create a lookup with allPaid staff:
            var mapAllPaid = {};
            allPaid.forEach(function(staff){
                mapAllPaid[staff.staff_account] = staff;
            })


            var results = [];

            allStaff.forEach(function(ren) {

                // if current ren not in mapAllPaid, add to our results
                if (typeof mapAllPaid[ren.account.account_number] == 'undefined') {
                    results.push({
                        staff_number:ren.account.account_number,
                        account_name:ren.ren_preferredname + ' ' + ren.ren_surname
                    });
                }

            })

            ADCore.comm.success(res, results);

        })

    },



    nscpaid:function(req,res){

        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }


        var account = req.param('account');
        var date = new Date();

        NSCAlreadyPaid.create({ staff_account:account, date_paid:date})
        .fail(function(err){
            console.log('whoops! Problems saving NSCAlreadyPaid instance:');
            console.log(err);
            console.log(paidObj);
        })
        .then(function(data){
            console.log('it saved!');
            console.log('returned data:');
            console.log(data);

            console.log('publishCreate() ...');
            NSCAlreadyPaid.publishCreate(data);

            ADCore.comm.success(res, {yippie:true});

        })

    },




    nscalreadypaid:function(req, res) {

        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        var date = new Date();

        var monthBeginning = new Date(date.getFullYear(), date.getMonth(), 1);
        var monthEnding = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        var foundPaid = findAlreadyPaidStaffThisMonth(monthBeginning, monthEnding);


        var foundStaff = NSSAPI.staffForNSC('vincent.tong');

        $.when(foundPaid, foundStaff)
        .then(function(allPaid, allStaff){


            // 1) create a lookup with allPaid staff:
            var mapAllPaid = {};
            allPaid.forEach(function(staff){
                mapAllPaid[staff.staff_account] = staff;
            })
            console.log(mapAllPaid);

            var results = [];

            allStaff.forEach(function(ren) {

                // if current ren not in mapAllPaid, add to our results
                if (mapAllPaid[ren.account.account_number]) {
                    results.push({
                        staff_number:ren.account.account_number,
                        account_name:ren.ren_preferredname + ' ' + ren.ren_surname
                    });
                }

            })

            ADCore.comm.success(res, results);

        })

    },



    nscstaffinfo:function(req, res) {
console.log('in nscstaffinfo');
        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }
console.log(req.param('accounts'));
        var account = req.param('accounts').split(',');

        NSSAPI.staffForAccount(account)
        .fail(function(err){
console.log('whoop!  error:');
console.log(err);
        })
        .then(function(allStaff){
console.log('.then()...');
            var results = [];

            allStaff.forEach(function(staff){

                results.push({
                    staff_number:staff.account.account_number,
                    account_name:staff.ren_preferredname + ' ' + staff.ren_surname
                });
            });

            ADCore.comm.success(res, results);

        });

    },

    staffaccountinfo:function(req, res){
        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        NSStaffProcessor.compileStaffData()
        .fail(function(err){
console.log(err);
        })
        .then(function(data){

            var foundRen = null;

            data.staff.forEach(function(ren){
                if(ren.guid == "vincent.tong"){
                    foundRen = ren;
                }
                
            });

            var results = [
                { item:"Name", value:foundRen.name },
                { item:"Base Salary", value:foundRen.baseSalary },
                { item:"Account Balance", value:foundRen.accountBal },
                { item:"Local Donation Percentage", value:foundRen.localPercent },
                { item:"Foreign Donation Percentage", value:foundRen.foreignPercent }



            ]



            ADCore.comm.success(res, results);
        });

    }

    
};


var findAlreadyPaidStaffThisMonth = function(monthBeginning, monthEnding ) {
    var dfd = $.Deferred();

    NSCAlreadyPaid.find({date_paid:{ 
        '>=': monthBeginning,
        '<=': monthEnding }
    })
    .fail(function(err){
        dfd.reject(err);
    })
    .then(function(listPaid){
        dfd.resolve(listPaid);
    });

    return dfd;
}

