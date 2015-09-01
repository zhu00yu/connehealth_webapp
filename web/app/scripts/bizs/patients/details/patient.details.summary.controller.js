'use strict';
angular.module('chApp.patients.controllers').controller('PatientDetailsSummaryController', [
    '$scope','$rootScope', '$q', '$state', '$stateParams', '$location', 'pluginsService', 'tabService', 'patientService', 'patientProblemsService', 'patientMedicationsService',
    function ($scope, $rootScope, $q, $state, $stateParams, $location, pluginsService, tabService, patientService, patientProblemsService, patientMedicationsService) {
        var element = tabService.getTabPanel();
        var oElements = {};

        $scope.patientId = $stateParams.patientId;
        $scope.dto = {};
        $scope.dto.problem = {};
        $scope.dto.problems = [];

        $scope.dto.medication = {};
        $scope.dto.medications = [];

        (function initProblems (){
            function getProblems(patientId){
                patientProblemsService.getProblems(patientId).then(function (data) {
                    $scope.dto.problems = data;
                    return data;
                });
            }

            $scope.$watch("patientId", function(newValue, oldValue){
                if (newValue){
                    getProblems(newValue);
                    oElements = patientProblemsService.initWidgets(newValue, element, null, null, null,
                        function (problem) {
                            $scope.dto.problem = problem;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        },
                        function(disease){
                            $scope.dto.problem.diseaseId = disease.id;
                            $scope.dto.problem.icdNo = [disease.icdNo, disease.additionalNo].join('  ');
                            $scope.dto.problem.problemName = disease.name;
                        }
                    );
                }
            });

            $scope.$watch("dto.problems", function (newValue, oldValue) {
                if (newValue) {
                }
                patientProblemsService.reloadDatas(newValue);
            });

            $scope.submitProblemEditor = function(isNew) {
                var patientId = $scope.patientId;
                var problem = $scope.dto.problem;
                if (isNew) {
                    problem.patientId = patientId;
                    patientProblemsService.insertProblem(patientId, problem).then(function (result) {
                        getProblems(patientId);
                        patientProblemsService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                } else {
                    patientProblemsService.updateProblem(patientId, problem).then(function (result) {
                        getProblems(patientId);
                        patientProblemsService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                }
            }

        })();

        (function initMedications (){
            function getMedications(patientId){
                patientMedicationsService.getMedications(patientId).then(function (data) {
                    $scope.dto.medications = data;
                    return data;
                });
            }

            $scope.$watch("patientId", function(newValue, oldValue){
                if (newValue){
                    getMedications(newValue);
                    oElements = patientMedicationsService.initWidgets(newValue, element, null, null, null,
                        function (medication) {
                            $scope.dto.medication = medication;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        },
                        function(disease){
                            $scope.dto.medication.diseaseId = disease.id;
                            $scope.dto.medication.icdNo = [disease.icdNo, disease.additionalNo].join('  ');
                            $scope.dto.medication.problemName = disease.name;
                        },
                        function(drug){
                            $scope.dto.medication.drugId = drug.id;
                            $scope.dto.medication.form = drug.form;
                            $scope.dto.medication.strength = drug.strength;
                            $scope.dto.medication.strengthUnit = drug.strengthUnit;
                            $scope.dto.medication.drugName = drug.generalName;
                            $scope.dto.medication.otc = drug.otcDrug;
                        }
                    );
                }
            });

            $scope.$watch("dto.medications", function (newValue, oldValue) {
                if (newValue) {
                }
                patientMedicationsService.reloadDatas(newValue);
            });

            $scope.submitMedicationEditor = function(isNew) {
                var patientId = $scope.patientId;
                var medication = $scope.dto.medication;
                if (isNew) {
                    medication.patientId = patientId;
                    patientMedicationsService.insertMedication(patientId, medication).then(function (result) {
                        getMedications(patientId);
                        patientMedicationsService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                } else {
                    patientMedicationsService.updateMedication(patientId, medication).then(function (result) {
                        getMedications(patientId);
                        patientMedicationsService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                }
            }

        })();
    }
]);