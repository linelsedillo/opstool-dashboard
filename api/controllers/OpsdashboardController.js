/**
 * OpsdashboardController
 *
 * @description :: Server-side logic for managing opsdashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var $ = require('jquery-deferred');
var AD = require('ad-utils');

module.exports = {


    widget:function(req,res) {


        res.setHeader('content-type', 'application/javascript');

        ADCore.comm.success(res, [
            // { id:'000001', title:'Title',  type:'table', config:{ url:'/url/here', fields:['field1', 'field2'] }},
            { id:'000002', title:'NSC: to be paid', type:'tableUpdateNSC', config:{ url:'/opsdashboard/nsctobepaid', url_paid:'/opsdashboard/nscpaid', fields:['staff_number', 'account_name']}},
            { id:'000003', title:'NSC: already paid', mode:'paid',  type:'tableUpdateNSC', config:{ url:'/opsdashboard/nscalreadypaid', fields:['staff_number', 'account_name']}},
            { id:'000004', title:'Staff account info', type:'table', config:{ url:'/opsdashboard/staffaccountinfo', fields:['item', 'value']}}
        ]);


    },



    /**
     *  @function nsctobepaid
     *
     *  This web service retrieves a list of staff that have not been paid 
     *  in the provided date range.
     *
     *  @param  {date} dateStart    The beginning date to search
     *                              defaults: to beginning of current month
     *  @param  {date} dateEnd      The ending date to search
     *                              defaults: to end of current month
     *  @param  {string} guid       The NSC GUID to find people for.
     *                              defaults: to the logged in user
     *
     *  @return {json}
     *              {
     *                  status: 'success',
     *                  data: [
     *                      { staff_number:'xxxxxxx1', account_name:'yyyyyyyy1' },
     *                      { staff_number:'xxxxxxx2', account_name:'yyyyyyyy2' },
     *                      ...
     *                      { staff_number:'xxxxxxxN', account_name:'yyyyyyyyN' },
     *                  ]
     *               }
     */
    nsctobepaid:function(req, res) {

        AD.log('<green>nsctobepaid:</green> ');

        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        // this socket needs to be notified of any new NSCAlreadyPaid entries
        if (req.isSocket) {

            // subscribe this socket ao any changes in model NSCAlreadyPaid
            NSCAlreadyPaid.watch(req.socket);
        }

        // we'll allow the request to specify a start and end date
        var dateStart = req.param('dateStart');
        var dateEnd   = req.param('dateEnd');
        if (typeof dateStart == 'undefined') {

            // default dateStart to beginning of current month
            var date = new Date();
            dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        if (typeof dateEnd == 'undefined') {

            // default dateEnd to end of current month:
            var date = new Date();
            dateEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        }

        var nscGUID = req.param('forGUID');
        if (typeof nscGUID == 'undefined') {
//// TODO:
//// verify this user has permission to actually lookup other staff to be paid:

            nscGUID = ADCore.user.current(req).GUID();
// for testing:
// nscGUID = 'vincent.tong';                           // from live data
nscGUID = '1C15995E-E81C-BD83-2B48-DB0D93822F32';   // from our test data
        }

        AD.log('... <yellow>dateStart:</yellow>'+dateStart);
        AD.log('... <yellow>dateEnd:</yellow>'+dateEnd);
        AD.log('... <yellow>guid:</yellow>'+nscGUID);


        // find all the ren who have been paid during this date range:
        var foundPaid = findAlreadyPaidStaffThisMonth(dateStart, dateEnd);

        // find all the staff for this NSC:
        var foundStaff = LegacyStewardwise.staffForNSCByGUID({ guids:[ nscGUID ]});


        $.when(foundPaid, foundStaff)
        .fail(function(err){
            AD.log.error('... error gathering to be paid info:', err);
            err.service_message = ' error gathering to be paid info: dateStart['+dateStart+'] dateEnd['+dateEnd+'] guid['+guid+']';
            ADCore.comm.error(res, err, 500);
        })
        .then(function(allPaid, allStaff){

            // 1) create a lookup with allPaid staff:
            var mapAllPaid = {};
            allPaid.forEach(function(staff){
                mapAllPaid[staff.ren_guid] = staff;
            })


            var results = [];

            allStaff.forEach(function(ren) {

                // if current ren not in mapAllPaid, add to our results
                if (typeof mapAllPaid[ren.ren_guid] == 'undefined') {

                    var primaryAccount = '??';
                    ren.staffAccounts.forEach(function(account){
                        if (account.account_isprimary == 1) {
                            primaryAccount = account.account_number;
                        }
                    })

                    results.push({
                        ren_guid:ren.ren_guid,
                        staff_number:primaryAccount,
                        account_name:ren.ren_preferredname + ' ' + ren.ren_surname
                    });
                }

            })

            AD.log('... <yellow>results:</yellow>',results);


            AD.log('... <green><bold>comm.success()</bold></green>');
            ADCore.comm.success(res, results);

        })

    },



    /**
     *  @function nscpaid
     *
     *  This web service marks an individual staff as having been paid. 
     *
     *  @param  {date} datePaid     The date they were paid.
     *                              defaults: right now
     *  @param  {string} guid       The staff GUID that was paid. 
     *
     *  @return {json}
     *              {
     *                  status: 'success',
     *                  data: { yippie: true }
     *               }
     */
    nscpaid:function(req,res){

        AD.log('<green>nscpaid:</green> ');

        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        var guid = req.param('guid');
        var account = req.param('account');
        var name = req.param('name');

        var datePaid = req.param('datePaid');
        if (typeof datePaid == 'undefined') datePaid = new Date();

        AD.log('... <yellow>guid:</yellow>'+guid);
        AD.log('... <yellow>account:</yellow>'+account);
        AD.log('... <yellow>name:</yellow>'+name);
        AD.log('... <yellow>datePaid:</yellow>'+datePaid);


        NSCAlreadyPaid.create({ ren_guid:guid, staff_account:account, account_name:name, date_paid:datePaid})
        .fail(function(err){
            AD.log.error('... error creating NSCAlreadyPaid :', err);

            err.service_message = ' error creating already paid entry: guid['+guid+'] account['+account+'] name['+name+'] datePaid['+datePaid+']';
            ADCore.comm.error(res, err, 500);

        })
        .then(function(data){
            AD.log('... <green>it saved!</green>');

            AD.log('... publishCreate()');
            NSCAlreadyPaid.publishCreate(data);


            AD.log('... <green><bold>comm.success()</bold></green>');
            ADCore.comm.success(res, {yippie:true});
        })

    },



    /**
     *  @function nscalreadypaid
     *
     *  This web service retrieves a list of staff that have already been paid 
     *  in the provided date range.
     *
     *  @param  {date} dateStart    The beginning date to search
     *                              defaults: to beginning of current month
     *  @param  {date} dateEnd      The ending date to search
     *                              defaults: to end of current month
     *  @param  {string} guid       The NSC GUID to find people for.
     *                              defaults: to the logged in user
     *
     *  @return {json}
     *  {
     *      status: 'success',
     *      data: [
     *          { staff_number:'xxx1', account_name:'yyy1', ren_guid:'zzz1' },
     *          { staff_number:'xxx2', account_name:'yyy2', ren_guid:'zzz2' },
     *          ...
     *          { staff_number:'xxxN', account_name:'yyyN', ren_guid:'zzzN' },
     *      ]
     *  }
     */
    nscalreadypaid:function(req, res) {

        AD.log('<green>nscalreadypaid:</green> ');

        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        // this socket needs to be notified of any new NSCAlreadyPaid entries
        if (req.isSocket) {

            // subscribe this socket ao any changes in model NSCAlreadyPaid
            NSCAlreadyPaid.watch(req.socket);
        }

        // we'll allow the request to specify a start and end date
        var dateStart = req.param('dateStart');
        var dateEnd   = req.param('dateEnd');
        if (typeof dateStart == 'undefined') {

            // default dateStart to beginning of current month
            var date = new Date();
            dateStart = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        if (typeof dateEnd == 'undefined') {

            // default dateEnd to end of current month:
            var date = new Date();
            dateEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        }

        // who is this list for?
        var nscGUID = req.param('forGUID');
        if (typeof nscGUID == 'undefined') {
//// TODO:
//// verify this user has permission to actually lookup other staff to be paid:

            nscGUID = ADCore.user.current(req).GUID();
// for testing:
// nscGUID = 'vincent.tong';                           // from live data
nscGUID = '1C15995E-E81C-BD83-2B48-DB0D93822F32';   // from our test data
        }

        AD.log('... <yellow>dateStart:</yellow>'+dateStart);
        AD.log('... <yellow>dateEnd:</yellow>'+dateEnd);
        AD.log('... <yellow>guid:</yellow>'+nscGUID);


        // find all the ren who have been paid during this date range:
        var foundPaid = findAlreadyPaidStaffThisMonth(dateStart, dateEnd);

        // find all the staff for this NSC:
        var foundStaff = LegacyStewardwise.staffForNSCByGUID({ guids:[ nscGUID ]});


        $.when(foundPaid, foundStaff)
        .fail(function(err){
            AD.log.error('... error gathering already paid info:', err);
            err.service_message = ' error gathering already paid info: dateStart['+dateStart+'] dateEnd['+dateEnd+'] guid['+guid+']';
            ADCore.comm.error(res, err, 500);
        })
        .then(function(allPaid, allStaff){

            // 1) create a lookup with allPaid staff:
            var mapAllPaid = {};
            allPaid.forEach(function(staff){
                mapAllPaid[staff.ren_guid] = staff;
            })


            var results = [];

            allStaff.forEach(function(ren) {

                // if current ren in mapAllPaid, add to our results
                if (mapAllPaid[ren.ren_guid]) {

                    var primaryAccount = '??';
                    ren.staffAccounts.forEach(function(account){
                        if (account.account_isprimary == 1) {
                            primaryAccount = account.account_number;
                        }
                    })

                    results.push({
                        ren_guid:ren.ren_guid,
                        staff_number:primaryAccount,
                        account_name:ren.ren_preferredname + ' ' + ren.ren_surname
                    });
                }

            })
            AD.log('... <yellow>results:</yellow>',results);


            AD.log('... <green><bold>comm.success()</bold></green>');
            ADCore.comm.success(res, results);

        })

    },



    /**
     *  @function staffaccountinfo
     *
     *  Produce the Account Analysis information for an individual account.
     *
     *  @param  {string} guid       The GUID of the staff to 
     *                              defaults: to the logged in user
     *
     *  @return {json}
     *  {
     *      status: 'success',
     *      data: [
     *          {
     *              {item:"Name", value:'[name]'},
     *              {item:"Base Salary", value:'[baseSalary]'},
     *              {item:"Account Balance", value:'[accountBalance]'},
     *              {item:"% Local", value:'[localDonationPercent]'},
     *              {item:"% Foreign", value:'[foreignDonationPercent]'},
     *          }
     *      ]
     *  }
     */
    staffaccountinfo:function(req, res){

        // prepare response for json
        if (res.setHeader) {
            res.setHeader('content-type', 'application/javascript');
        }

        var guid = req.param('guid');
// who is this list for?
        if (typeof guid == 'undefined') {
//// TODO:
//// verify this user has permission to actually lookup other staff account info:

            guid = ADCore.user.current(req).GUID();
// for testing:
// guid = 'vincent.tong';                           // from live data
guid = '1C15995E-E81C-BD83-2B48-DB0D93822F32';   // from our test data
        }


        // NSStaffProcessor.compileStaffData()
        LegacyStewardwise.accountAnalysisByGUID({guids:[guid]})
        .fail(function(err){
            AD.log.error('... error gathering accountAnalysisByGUID():', err);
            err.info_msg = 'error gathering account analysis for guid:'+guid;
            ADCore.comm.error(res, err, 500);
        })
        .then(function(data){

            if ((!data) || (data.length == 0)) {

                // Problem, no one found for guid:
                // 404 : Not Found
                var err = new Error('requested GUID ['+guid+'] not found.');
                ADCore.comm.error(res, err, 404);

            } else  {

                var foundRen = data[0];


                var results = [
                    { item:"Name", value:foundRen.name },
                    { item:"Base Salary", value:foundRen.baseSalary },
                    { item:"Account Balance", value:foundRen.accountBal },
                    { item:"% Local", value:foundRen.localPercent },
                    { item:"% Foreign", value:foundRen.foreignPercent }
                ]

                ADCore.comm.success(res, results);

            }
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
    .done(function(listPaid){
        dfd.resolve(listPaid);
    });

    return dfd;
}

