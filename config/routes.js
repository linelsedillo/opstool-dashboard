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
    'get /opsdashboard/staffaccountinfo': 'opstool-dashboard/OpsdashboardController.staffaccountinfo'




};

