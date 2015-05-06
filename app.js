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
      var pre_element = $("#pre-study-xml")[0]; // angular has added a child with the same id, so getting the first child
      var xml_text = pre_element.textContent || pre_element.innerText;
      // console.log(xml_text);
      var blob = new Blob([xml_text], {type: "application/xml;charset=utf-8"});;
      saveAs(blob, "study.xml");
    }

    $scope.parseXML = function () {

      var input = $("#uploadStudyInput")[0].files[0];
      var reader = new FileReader();
      var content;

      reader.onload = function(e) {
        var content = reader.result;

        var xmlDoc = $.parseXML( content ); // using jquery to parse the xml string
        var $xml = $( xmlDoc );

        $scope.$apply(function() { // to update bindings
          $scope.centerName.value = $xml.find( "STUDY" ).attr("center_name");
          $scope.shortName.value = $xml.find( "CENTER_PROJECT_NAME" ).text();
          $scope.title.value = $xml.find( "STUDY_TITLE" ).text();
          $scope.studyType.value = $xml.find( "STUDY_TYPE" ).attr("existing_study_type");
          $scope.abstract.value = $xml.find( "STUDY_ABSTRACT" ).text();

          $scope.studyAttributes = [];
          var attributes = $xml.find( "STUDY_ATTRIBUTE" );
          attributes.each(function() {
            $scope.studyAttributes.push(
              {
                tag: $(this).find("TAG").text(),
                value: $(this).find("VALUE").text()
              });
          });
        });
      };

      reader.readAsText(input, 'UTF-8');

    };

  }]); // app.controller

  app.directive('studyXml', function () {
    return {
      restrict: 'E',
      templateUrl: 'study-xml.html'
    };
  });


})();
