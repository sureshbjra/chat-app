angular.module('myApp', ['ui.router', 'lbServices'])
    .factory("socket", function () { return io.connect(); })
    .factory("hostUrl", function ($location) {
        return {
            id: $location.host() + ':' + $location.port()
        };
    })
    .config([
        '$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

            localStorage.removeItem('app-url');
            localStorage.setItem('app-url', 'http://65.0.104.144:3000/');

            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard/dashboard.html'
                })
                .state('editor-main', {
                    url: '/editor-main',
                    templateUrl: 'views/editor-note/main.html'
                })
                .state('manage-teenache', {
                    url: '/manage-teenache',
                    templateUrl: 'views/teenache/manage.html'
                })
                .state('create-teenache', {
                    url: '/create-teenache',
                    templateUrl: 'views/teenache/create.html'
                })
                .state('create-private-editor-note', {
                    url: '/create-private-editor-note',
                    templateUrl: 'views/private-editor-note/create.html',
                    controller: 'createeditornoteCtl'
                })
                .state('edit-private-editor-note', {
                    url: '/edit-editor-note',
                    templateUrl: 'views/private-editor-note/edit.html',
                    controller: 'editeditornoteCtl'
                })
                .state('manage-private-editor-note', {
                    url: '/manage-private-editor-note',
                    templateUrl: 'views/private-editor-note/manage.html',
                    controller: 'manageeditornoteCtl'
                })
                .state('create-public-editor-note', {
                    url: '/create-public-editor-note',
                    templateUrl: 'views/public-editor-note/create.html',
                    controller: 'createeditornoteCtl'
                })
                .state('edit-public-editor-note', {
                    url: '/edit-editor-note',
                    templateUrl: 'views/public-editor-note/edit.html',
                    controller: 'editeditornoteCtl'
                })
                .state('manage-public-editor-note', {
                    url: '/manage-public-editor-note',
                    templateUrl: 'views/public-editor-note/manage.html',
                    controller: 'manageeditornoteCtl'
                })
                .state('create-home-editor-note', {
                    url: '/create-home-editor-note',
                    templateUrl: 'views/home-editor-note/create.html',
                    controller: 'createeditornoteCtl'
                })
                .state('edit-home-editor-note', {
                    url: '/edit-home-editor-note',
                    templateUrl: 'views/home-editor-note/edit.html',
                    controller: 'editeditornoteCtl'
                })
                .state('manage-home-editor-note', {
                    url: '/manage-home-editor-note',
                    templateUrl: 'views/home-editor-note/manage.html',
                    controller: 'manageeditornoteCtl'
                })
                .state('create-customer', {
                    url: '/create-customer',
                    templateUrl: 'views/customer/create.html',
                    controller: 'createCustomerCtl'
                })
                .state('edit-customer', {
                    url: '/edit-customer',
                    templateUrl: 'views/customer/edit.html',
                    controller: 'editCustomerCtl'
                })
                .state('manage-customer', {
                    url: '/manage-customer',
                    templateUrl: 'views/customer/manage.html',
                    controller: 'manageCustomerCtl'
                })
                .state('create-blog', {
                    url: '/create-blog',
                    templateUrl: 'views/blog/create.html',
                    controller: 'createBlogCtl'
                })
                .state('edit-blog', {
                    url: '/edit-blog',
                    templateUrl: 'views/blog/edit.html',
                    controller: 'editBlogCtl'
                })
                .state('manage-blog', {
                    url: '/manage-blog',
                    templateUrl: 'views/blog/manage.html',
                    controller: 'manageBlogCtl'
                })
                .state('manage-forum', {
                    url: '/manage-forum',
                    templateUrl: 'views/forum/manage.html',
                    controller: 'manageForumCtl'
                })
                .state('edit-forum', {
                    url: '/edit-forum',
                    templateUrl: 'views/forum/edit.html',
                    controller: 'editForumCtl'
                })
                .state('manage-contactus', {
                    url: '/manage-contactus',
                    templateUrl: 'views/contactus/manage.html',
                    controller: 'manageContactUsCtl'
                })
                .state('create-forum', {
                    url: '/create-forum',
                    templateUrl: 'views/forum/create.html',
                    controller: 'createForumCtl'
                });


            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }])