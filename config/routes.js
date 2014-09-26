/**
 * Routes
 *
 * Use this file to add any module specific routes to the main Sails
 * route object.
 */


module.exports = {


    /*

    '/': {
    view: 'user/signup'
    },
    '/': 'Dashboard/PluginController.inbox',
    '/': {
    controller: 'Dashboard/PluginController',
    action: 'inbox'
    },
    'post /signup': 'Dashboard/PluginController.signup',
    'get /*(^.*)' : 'Dashboard/PluginController.profile'

    */

    'get /opsdashboard/widget': 'opstool-dashboard/OpsdashboardController.widget',
    'get /opsdashboard/nsctobepaid': 'opstool-dashboard/OpsdashboardController.nsctobepaid',
    'get /opsdashboard/nscpaid/:guid': 'opstool-dashboard/OpsdashboardController.nscpaid',
    'get /opsdashboard/nscalreadypaid': 'opstool-dashboard/OpsdashboardController.nscalreadypaid',
    // 'get /opsdashboard/nscstaffinfo': 'opstool-dashboard/OpsdashboardController.nscstaffinfo',
    'get /opsdashboard/staffaccountinfo': 'opstool-dashboard/OpsdashboardController.staffaccountinfo',
    'get /opsdashboard/gmaGraph/assignments': 'opstool-dashboard/OpsdashboardController.gmaGraphAssignments',
    'get /opsdashboard/gmaGraph/assignment/:nodeId/measurements': 'opstool-dashboard/OpsdashboardController.gmaGraphMeasurements',
    'get /opsdashboard/gmaGraph/assignment/:nodeId/measurements/:measurementId/graph': 'opstool-dashboard/OpsdashboardController.gmaGraphData',
'get /opsdashboard/stafflookup/search/:filter': 'opstool-dashboard/OpsdashboardController.staffSearch',
'get /opsdashboard/stafflookup/contactinfo/:guid': 'opstool-dashboard/OpsdashboardController.staffInfo'

};

