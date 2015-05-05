(function(){

  var app = angular.module('enaMetadata', []);

  app.controller('StudyController', ['$scope',function($scope) {
    // this.items = studyItems;
    $scope.centerName = {
      label: 'Center name',
      description: 'The name of your institution as specified in your ENA user account',
      value: '',
      placeholder: 'BIOINFORMATICS INFRASTRUCTURE FOR LIFE SCIENCES'
    };

    $scope.shortName = {
      label: 'Short name',
      description: 'A short descriptive name for the project',
      value: ''
    };

    $scope.title = {
      label: 'Title',
      description: 'A short description of the project akin to an article title',
      value: ''
    };

    $scope.studyType = {
      label: 'Study type',
      description: '',
      options: [
        "Whole Genome Sequencing",
        "Metagenomics",
        "Transcriptome Analysis",
        "Resequencing",
        "Epigenetics",
        "Synthetic Genomics",
        "Forensic or Paleo-genomics",
        "Gene Regulation Study",
        "Cancer Genomics",
        "Population Genomics",
        "RNASeq",
        "Exome Sequencing",
        "Pooled Clone Sequencing",
        "Other"
      ],
      value: 'Whole Genome Sequencing'
    };

    $scope.abstract = {
      label: 'Abstract',
      description: 'A detailed desciption of the project akin to an article abstract',
      value: ''
    };

    $scope.studyAttributes = [
      {tag: "", value: ""}
    ];

    $scope.addNewAttribute = function() {
      $scope.studyAttributes.push({tag: "", value: ""});
    };

    $scope.removeAttribute = function() {
      var lastItem = $scope.studyAttributes.length-1;
      $scope.studyAttributes.splice(lastItem);
    };

    $scope.noAttributes = function() {
      return;
    }

    $scope.saveXML = function() {
      var pre_element = $("#pre-xml")[0]; // angular has added a child with the same id, so getting the first child
      var xml_text = pre_element.textContent || pre_element.innerText;
      // console.log(xml_text);
      var blob = new Blob([xml_text], {type: "application/xml;charset=utf-8"});;
      saveAs(blob, "study.xml");
    }


  }]);

  app.directive('studyXml', function () {
    return {
      restrict: 'E',
      templateUrl: 'study-xml.html'
    };
  });


})();
