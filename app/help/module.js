angular.module('app.help', ['ui.router']);

angular.module('app.help').config(function ($stateProvider) {

    $stateProvider
        .state('app.help', {
            abstract: true,
            data: {
                title: 'Help'
            }
        })
        .state('app.help.subjects', {
            url: '/help/subjects',

            views: {
                "content@app": {
                    controller: 'helpCtrl',
                    templateUrl: "app/help/views/help-view.html"
                }
            }

        })
        .state('app.help.glossary', {
            url: '/help/subject/glossary',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.afteraction', {
            url: '/help/subject/after-action-review',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.step-3-self-evaluate', {
            url: '/help/subject/step-3-self-evaluate',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.step-2-design-and-impement', {
            url: '/help/subject/step-2-design-and-impement',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.ssm-report', {
            url: '/help/subject/ssm-report',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.ssm', {
            url: '/help/subject/ssm',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.step-1-understand', {
            url: '/help/subject/step-1-understand',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.initial-intentions', {
            url: '/help/subject/initial-intentions',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.step-0-reflect', {
            url: '/help/subject/step-0-reflect',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.cycle-intro', {
            url: '/help/subject/cycle-intro',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.ol-measurement-report', {
            url: '/help/subject/ol-measurement-report',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.ol-measurement', {
            url: '/help/subject/ol-measurement',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        })
        .state('app.help.ol-measurement-intro', {
            url: '/help/subject/ol-measurement-intro',

            views: {
                "content@app": {
                    controller: 'helpSubjectCtrl',
                    templateUrl: "app/help/views/help-subject.html"
                }
            }
        });
});