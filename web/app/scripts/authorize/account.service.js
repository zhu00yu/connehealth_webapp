'use strict';

angular.module('chApp.authorize.services').factory('accountService', [
    "$state", "$http", "$rootScope", '$cookies', "appConfig",
    function ($state, $http, $rootScope, $cookies, appConfig) {
	var service = {};

    // 获取一个空的用户对象
	service.getNewUser = function (options) {
        return $.extend({
            IsAgreeTerm: false,
            IsPatient: false,
            IsProvider: false,
            IsPractice: false,
            User: {
                UserName: null,
                Password: null,
                Password2: null,
            },
            UserProfile: {
                FamilyName: null,
                GivenName: null,
                Email: null,
                Sex: 1,
                Mobile: null,
                BirthDate: null,
                IdCardNo: null
            },
            ProviderBusinessInfo: {
                CertificateNo: null,
                PracticeNo: null,
                PracticeLocation: '',
                PrimaryPracticeName: null,
                ProfessionalRank: '',
                Specialties: '',
                Skills: null
            },
            PracticeInfo: {
                Type: '',
                Name: null,
                PracticeLicenseCode: null,
                Address: null,
                ProvinceId: '110000',
                CityId: '110100',
                RegionId: '110101',
                BusinessPhone: null,
                IsPublicOrg: true,
            }
        }, options);
    };

    service.getPractices = function(){
        var promise = $http.get(appConfig.API_HOST + "/practices/options");
        return promise;
    };

    //获取全部用户
	service.getPatients = function (searchCondition, successFunction, errorFunction) {
		return searchCondition.providerId == 'all' ? _patients : _patients1;
	};
	//获取某个用户
	service.getPatient = function (patientId, successFunction, errorFunction) {
		for (var i in _patients) {
			if (_patients[i].PatientId === patientId) return _patients[i];
		}
		return null;
	};

	// 注册某个用户
	service.registerUser = function (userDto) {
	    var data = userDto;
        if (typeof data.practiceLocation === "object") {
            data.practiceLocation = data.practiceLocation.join("|");
        }

        if (typeof data.specialties === "object") {
            data.specialties = data.specialties.join("|");
        }

	    var promise = $http.post(appConfig.API_HOST + "/user/authenticate/register", data);
	    return promise;
	}
	service.loginUser = function (name, password, practiceId) {
	    var data = {
	        username: name, password: password, practiceId: practiceId
	    };
	    var promise = $http.post(appConfig.API_HOST + "/user/authenticate", data);
	    return promise;
	}
	service.logoutUser = function (name, tocken) {
	    var data = {
	        name: name, tocken: tocken
	    };
	    var promise = $http.post(appConfig.API_HOST + "/Account/Logout", data);
	    return promise;
	}

	service.checkTocken = function (token, state) {
	    var promise = $http.get(appConfig.API_HOST + "/user/authenticate/" + token);
	    return promise;
	};

    service.whenUserLogined = function(data) {
        $rootScope.currentUser = _setCurrentUser(data);

        $http.defaults.headers.common[appConfig.CH_AU_T_NAME] = data.token;
        $cookies.put(appConfig.CH_AU_T_NAME, data.token);


        if ($rootScope.previourState && $rootScope.previourState.name && $rootScope.previourState.name.indexOf("authorize") != 0) {
            $state.go($rootScope.previourState, $rootScope.previourStateParams, { location: true });
        } else {
            _redirectToPortal($rootScope.currentUser);
        }
    };

    service.whenTokenValid = function (data) {
        $rootScope.currentUser = _setCurrentUser(data);

        $http.defaults.headers.common[appConfig.CH_AU_T_NAME] = data.token;
        $cookies.put(appConfig.CH_AU_T_NAME, data.token);
    };

    function _redirectToPortal(currentUser) {
        var portalState = "dashboard";
        portalState = "biz." + portalState;
        $state.go(portalState, { id: $rootScope.currentUser.name });
    }

    function _setCurrentUser(userDto) {
        var data = userDto;
        var token = data.token;
        var values = token.split(':');
        var userName = values[0];
        var practiceId = values[1];
        var isUser = _.indexOf(data.authorities, "ROLE_USER");
        var isAdmin = _.indexOf(data.authorities, "ROLE_ADMIN");
        return {
            userName: userName,
            practiceId: practiceId,
            token: token,
            isUser: isUser,
            isAdmin: isAdmin
        };
    }

	return service;
}]);