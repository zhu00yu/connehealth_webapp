'use strict';
angular.module('chApp.patients.controllers').controller('PatientDetailsSummaryController', [
    '$scope','$rootScope', '$q', '$state', '$stateParams', '$location', 'pluginsService', 'tabService',
    'patientService', 'patientProblemsService', 'patientMedicationsService', 'patientAllergiesService', 'patientMedicalHistoriesService', 'patientVaccinesService', 'patientSocialHistoriesService',
    function ($scope, $rootScope, $q, $state, $stateParams, $location, pluginsService, tabService,
              patientService, patientProblemsService, patientMedicationsService, patientAllergiesService, patientMedicalHistoriesService, patientVaccinesService, patientSocialHistoriesService) {
        var element = tabService.getTabPanel();
        var oElements = {};

        $scope.patientId = $stateParams.patientId;
        $scope.dto = {};
        $scope.dto.problem = {};
        $scope.dto.problems = [];

        $scope.dto.medication = {};
        $scope.dto.medications = [];

        $scope.dto.allergy = {};
        $scope.dto.allergies = [];

        $scope.dto.medicalHistory = {};
        $scope.dto.medicalHistories = [];
        $scope.dto.dischargeSummary = {};

        $scope.dto.vaccine = {};
        $scope.dto.vaccines = [];
        
        $scope.dto.socialHistory = {};

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

        (function initAllergies (){
            function getAllergies(patientId){
                patientAllergiesService.getAllergies(patientId).then(function (data) {
                    $scope.dto.allergies = data;
                    return data;
                });
            }

            $scope.$watch("patientId", function(newValue, oldValue){
                if (newValue){
                    getAllergies(newValue);
                    oElements = patientAllergiesService.initWidgets(newValue, element, null, null, null,
                        function (allergy) {
                            $scope.dto.allergy = allergy;
                            patientAllergiesService.initAllergenSelectorValue({id:allergy.allergenId, name:allergy.allergenName});
                            patientAllergiesService.initReactionSelectorValue(allergy.reactions);
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        },
                        function(allergen){
                            $scope.dto.allergy.allergenId = allergen.id;
                            $scope.dto.allergy.allergenType = allergen.type;
                            $scope.dto.allergy.allergenName = allergen.name;
                        },
                        function(data){
                            var reactions = [];
                            _.each(data, function(r){
                                reactions.push({adverseReactionId: r.id, reaction: r.text});
                            });
                            $scope.dto.allergy.reactions = reactions;
                        }
                    );
                }
            });

            $scope.$watch("dto.allergies", function (newValue, oldValue) {
                if (newValue) {
                }
                patientAllergiesService.reloadDatas(newValue);
            });

            $scope.submitAllergyEditor = function(isNew) {
                var patientId = $scope.patientId;
                var allergy = $scope.dto.allergy;

                if (isNew) {
                    allergy.patientId = patientId;
                    patientAllergiesService.insertAllergy(patientId, allergy).then(function (result) {
                        getAllergies(patientId);
                        patientAllergiesService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                } else {
                    patientAllergiesService.updateAllergy(patientId, allergy).then(function (result) {
                        getAllergies(patientId);
                        patientAllergiesService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                }
            }

        })();

        (function initMedicalHistories (){
            function getMedicalHistories(patientId){
                patientMedicalHistoriesService.getMedicalHistories(patientId).then(function (data) {
                    $scope.dto.medicalHistories = data;
                    return data;
                });
            }

            $scope.$watch("patientId", function(newValue, oldValue){
                if (newValue){
                    getMedicalHistories(newValue);
                    oElements = patientMedicalHistoriesService.initWidgets(newValue, element, null, null, null,
                        function (history) {
                            var fileId = history.dischargeSummaryFileId;
                            var url = patientMedicalHistoriesService.getDischargeSummaryFileUrl(fileId);
                            $scope.dto.medicalHistory = history;
                            $scope.dto.dischargeSummary = {
                                dischargeSummaryFileId: fileId,
                                dischargeSummaryFileUrl: url
                            };

                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        },
                        function(disease){
                        }
                    );
                }
            });

            $scope.$watch("dto.medicalHistories", function (newValue, oldValue) {
                if (newValue) {
                }
                patientMedicalHistoriesService.reloadDatas(newValue);
            });

            $scope.submitMedicalHistoryEditor = function(isNew) {
                var patientId = $scope.patientId;
                var history = $scope.dto.medicalHistory;

                var file = $scope.dto.dischargeSummary;
                var historyFileId = file.dischargeSummaryFileId;
                var historyFileData = file.dischargeSummaryFileData;
                var historyFileName = file.dischargeSummaryFileName || "DISCHARGE_SUMMARY.pdf";

                var promises = [];
                if (historyFileData) {
                    var promise = patientService.uploadPatientFile(historyFileId, historyFileName, historyFileData).then(function(result) {
                        file.dischargeSummaryFileId = +result.data;
                        history.dischargeSummaryFileId = +result.data;
                    }, function(result) {
                        console.log(arguments);
                        promise.reject(result.data);
                    });
                    promises.push(promise);
                }
                $q.all(promises).then(function(){
                    if (isNew) {
                        history.patientId = patientId;
                        patientMedicalHistoriesService.insertMedicalHistory(patientId, history).then(function (result) {
                            getMedicalHistories(patientId);
                            patientMedicalHistoriesService.closeModals();
                        }, function (result) {
                            console.log(arguments);
                        });
                    } else {
                        patientMedicalHistoriesService.updateMedicalHistory(patientId, history).then(function (result) {
                            getMedicalHistories(patientId);
                            patientMedicalHistoriesService.closeModals();
                        }, function (result) {
                            console.log(arguments);
                        });
                    }
                });
            }

        })();

        (function initVaccines (){
            function getVaccines(patientId){
                patientVaccinesService.getVaccines(patientId).then(function (data) {
                    $scope.dto.vaccines = data;
                    return data;
                });
            }

            $scope.$watch("patientId", function(newValue, oldValue){
                if (newValue){
                    getVaccines(newValue);
                    oElements = patientVaccinesService.initWidgets(newValue, element, null, null, null,
                        function (vaccine) {
                            $scope.dto.vaccine = vaccine;
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        },
                        function(vaccine){
                            $scope.dto.vaccine.vaccineId = vaccine.id;
                            $scope.dto.vaccine.vaccineName = vaccine.fullName;
                        }
                    );
                }
            });

            $scope.$watch("dto.vaccines", function (newValue, oldValue) {
                if (newValue) {
                }
                patientVaccinesService.reloadDatas(newValue);
            });

            $scope.submitVaccineEditor = function(isNew) {
                var patientId = $scope.patientId;
                var vaccine = $scope.dto.vaccine;
                if (isNew) {
                    vaccine.patientId = patientId;
                    patientVaccinesService.insertVaccine(patientId, vaccine).then(function (result) {
                        getVaccines(patientId);
                        patientVaccinesService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                } else {
                    patientVaccinesService.updateVaccine(patientId, vaccine).then(function (result) {
                        getVaccines(patientId);
                        patientVaccinesService.closeModals();
                    }, function (result) {
                        console.log(arguments);
                    });
                }
            }

        })();

        (function initSocialHistories (){
            function getSocialHistories(patientId){
                patientSocialHistoriesService.getSocialHistories(patientId).then(function (data) {
                    $scope.dto.socialHistory = data[0];
                    return data;
                });
            }

            $scope.$watch("patientId", function(newValue, oldValue){
                if (newValue){
                    getSocialHistories(newValue);
                }
            });

            $scope.editPatientSocialHistory = function(){
                $scope.dto.isSocialHistoryEditing = true;
            };
            $scope.cancelPatientSocialHistory = function(){
                $scope.dto.isSocialHistoryEditing = false;
            };
            $scope.updatePatientSocialHistory = function(isNew) {
                var patientId = $scope.patientId;
                var history = $scope.dto.socialHistory;
                var isNew = !$scope.dto.socialHistory.id
                if (isNew) {
                    history.patientId = patientId;
                    patientSocialHistoriesService.insertSocialHistory(patientId, history).then(function (result) {
                        getSocialHistories(patientId);
                    }, function (result) {
                        console.log(arguments);
                    });
                } else {
                    patientSocialHistoriesService.updateSocialHistory(patientId, history).then(function (result) {
                        getSocialHistories(patientId);
                    }, function (result) {
                        console.log(arguments);
                    });
                }
            }

        })();

    }
]);