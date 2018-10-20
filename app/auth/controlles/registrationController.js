angular.module('app.auth').controller(
    'registrationController',
    function ($scope, $http, $window, $stateParams, $document, $state, $timeout, MainConf) {
        $scope.organizationData = {
            "name": null,
            "description": null,
            'userId': null
        };
        $scope.userRegistrationData = {
            'firstName': null,
            'lastName': null,
            'username': null,
            "email": null,
            'password': null,
            'organization': null
        };

        var registration = {
            userLogin: function (username, password) {
                var sendCredentials = username + ":" + password;
                var theCredentials = this.Base64.encode(sendCredentials);


                $http({
                    method: 'POST',
                    url: MainConf.servicesUrl() + 'users/authenticate',
                    headers: {'Authorization': 'Basic ' + theCredentials}

                }).then(function successCallback(response) {
                    console.log('Auth authenticate after registration', response.data.data.token);
                    $window.localStorage.setItem("authToken", response.data.data.token);
                    $window.localStorage.setItem("userData", JSON.stringify(response.data.data.user));
                    $window.location.href = '#/dashboard';
                }, function errorCallback(response) {
                    console.log(
                        response,
                        "Sorry, we couldn't sing you in." +
                        " Please retry and be sure that you put the right credentials this time!"
                    );
                });
            },
            Base64: {
                _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
                    var t = "";
                    var n, r, i, s, o, u, a;
                    var f = 0;
                    e = this._utf8_encode(e);
                    while (f < e.length) {
                        n = e.charCodeAt(f++);
                        r = e.charCodeAt(f++);
                        i = e.charCodeAt(f++);
                        s = n >> 2;
                        o = (n & 3) << 4 | r >> 4;
                        u = (r & 15) << 2 | i >> 6;
                        a = i & 63;
                        if (isNaN(r)) {
                            u = a = 64
                        } else if (isNaN(i)) {
                            a = 64
                        }
                        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                    }
                    return t
                }, decode: function (e) {
                    var t = "";
                    var n, r, i;
                    var s, o, u, a;
                    var f = 0;
                    e = e.replace(/[^A-Za-z0-9+/=]/g, "");
                    while (f < e.length) {
                        s = this._keyStr.indexOf(e.charAt(f++));
                        o = this._keyStr.indexOf(e.charAt(f++));
                        u = this._keyStr.indexOf(e.charAt(f++));
                        a = this._keyStr.indexOf(e.charAt(f++));
                        n = s << 2 | o >> 4;
                        r = (o & 15) << 4 | u >> 2;
                        i = (u & 3) << 6 | a;
                        t = t + String.fromCharCode(n);
                        if (u != 64) {
                            t = t + String.fromCharCode(r)
                        }
                        if (a != 64) {
                            t = t + String.fromCharCode(i)
                        }
                    }
                    t = Base64._utf8_decode(t);
                    return t
                }, _utf8_encode: function (e) {
                    e = e.replace(/rn/g, "n");
                    var t = "";
                    for (var n = 0; n < e.length; n++) {
                        var r = e.charCodeAt(n);
                        if (r < 128) {
                            t += String.fromCharCode(r)
                        } else if (r > 127 && r < 2048) {
                            t += String.fromCharCode(r >> 6 | 192);
                            t += String.fromCharCode(r & 63 | 128)
                        } else {
                            t += String.fromCharCode(r >> 12 | 224);
                            t += String.fromCharCode(r >> 6 & 63 | 128);
                            t += String.fromCharCode(r & 63 | 128)
                        }
                    }
                    return t
                }, _utf8_decode: function (e) {
                    var t = "";
                    var n = 0;
                    var r = c1 = c2 = 0;
                    while (n < e.length) {
                        r = e.charCodeAt(n);
                        if (r < 128) {
                            t += String.fromCharCode(r);
                            n++
                        } else if (r > 191 && r < 224) {
                            c2 = e.charCodeAt(n + 1);
                            t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                            n += 2
                        } else {
                            c2 = e.charCodeAt(n + 1);
                            c3 = e.charCodeAt(n + 2);
                            t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                            n += 3
                        }
                    }
                    return t
                }
            }
        };

        $scope.UserRegistration = function () {
            var data_all = {
                "firstName": $scope.userRegistrationData.firstName,
                "LastName": $scope.userRegistrationData.LastName,
                "username": $scope.userRegistrationData.username,
                "email": $scope.userRegistrationData.email,
                "password": $scope.userRegistrationData.password,
                "organization": $scope.organizationId
            };

            var org_data = JSON.stringify(data_all);

            console.log('userRegistrationData', $scope.userRegistrationData);
            $http({
                method: 'POST',
                url: MainConf.servicesUrl() + 'users/createUserPublic',
                headers: {
                    // 'Authorization': 'Bearer '+authToken,
                    'Content-Type': 'application/json'
                },
                data: org_data
            }).then(function successCallback(response) {
                if (parseInt(response.data.data.code) === 1) {
                    console.log('Auth createManagerPublic success', response);
                    $scope.theUserId = response.data.data.data.userId;
                    $scope.organizationData.userId = $scope.theUserId;
                    $http({
                        method: 'POST',
                        url: MainConf.servicesUrl() + 'organization/organization',
                        headers: {
                            // 'Authorization': 'Bearer '+authToken,
                            'Content-Type': 'application/json'
                        },
                        data: $scope.organizationData
                    }).then(function successCallback(response) {
                        if (parseInt(response.data.data.code) === 1) {
                            console.log('Auth organization success', response);
                            $scope.organizationId = response.data.data.data.organizationId;
                            registration.userLogin(
                                $scope.userRegistrationData.username,
                                $scope.userRegistrationData.password
                            );
                        } else {
                            console.log('Organization data error', response);
                            $.bigBox({
                                title: 'Organization not created!',
                                color: "#C46A69",
                                timeout: 5000,
                                icon: "fa fa-check",
                                number: "1"
                            });
                        }

                    }, function errorCallback(response) {
                        console.warn('Auth organization data error', response);
                        alert('Auth organization data error');
                    });
                    console.log("resp", $scope.theUserId);
                } else {
                    console.log('User data error', response);
                    $.bigBox({
                        title: 'User not created!',
                        color: "#C46A69",
                        timeout: 5000,
                        icon: "fa fa-check",
                        number: "1"
                    });
                }
            }, function errorCallback(response) {
                console.warn('Auth createManagerPublic data error', response);
                alert('Auth createManagerPublic data error');
            });
        }
    });