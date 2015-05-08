(function(){

  var app = angular.module('enaMetadata', []);

  // ContentController
  app.controller('ContentController', ['$scope',function($scope) { // remove scope?
    var self = this;

    self.tab = 1;

    self.selectTab = function(setTab) {
      this.tab = setTab;
    };

    self.isSelected = function(checkTab){
      return self.tab === checkTab;
    };
  }]);

  // StudyController
  app.controller('StudyController', ['$scope',function($scope) { // passing in $scope to be able to call $scope.apply() in parseXML() to update data bindings
    // this.items = studyItems;
    var self = this;
    self.centerName = {
      label: 'Center name',
      description: 'The name of your institution as specified in your ENA user account',
      value: '',
      placeholder: 'BIOINFORMATICS INFRASTRUCTURE FOR LIFE SCIENCES'
    };

    self.shortName = {
      label: 'Short name',
      description: 'A short descriptive name for the project',
      value: ''
    };

    self.title = {
      label: 'Title',
      description: 'A short description of the project akin to an article title',
      value: ''
    };

    self.studyType = {
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

    self.abstract = {
      label: 'Abstract',
      description: 'A detailed description of the project akin to an article abstract',
      value: ''
    };

    self.studyAttributes = [
      {tag: "", value: ""}
    ];

    self.addNewAttribute = function() {
      self.studyAttributes.push({tag: "", value: ""});
    };

    self.removeAttribute = function() {
      var lastItem = self.studyAttributes.length-1;
      self.studyAttributes.splice(lastItem);
    };

    self.noAttributes = function() {
      return;
    }

    self.saveXML = function() {
      var pre_element = $("#pre-study-xml")[0]; // angular has added a child with the same id, so getting the first child
      var xml_text = pre_element.textContent || pre_element.innerText;
      // console.log(xml_text);
      var blob = new Blob([xml_text], {type: "application/xml;charset=utf-8"});;
      saveAs(blob, "study.xml");
    }

    self.parseXML = function () {

      var input = $("#uploadStudyInput")[0].files[0];
      var reader = new FileReader();
      var content;

      reader.onload = function(e) {
        var content = reader.result;

        var xmlDoc = $.parseXML( content ); // using jquery to parse the xml string
        var $xml = $( xmlDoc );

        $scope.$apply(function() { // to update bindings
          self.centerName.value = $xml.find( "STUDY" ).attr("center_name");
          self.shortName.value = $xml.find( "CENTER_PROJECT_NAME" ).text();
          self.title.value = $xml.find( "STUDY_TITLE" ).text();
          self.studyType.value = $xml.find( "STUDY_TYPE" ).attr("existing_study_type");
          self.abstract.value = $xml.find( "STUDY_ABSTRACT" ).text();

          self.studyAttributes = [];
          var attributes = $xml.find( "STUDY_ATTRIBUTE" );
          attributes.each(function() {
            self.studyAttributes.push(
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
