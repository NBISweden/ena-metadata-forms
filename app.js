(function(){

  var app = angular.module('enaMetadata', []);

  // // will this work?
  // // leave for now
  // app.config(function($httpProvider) {
  //     //Enable cross domain calls
  //     $httpProvider.defaults.useXDomain = true;
  // });

  // ContentController
  app.controller('ContentController', ['$scope',function($scope) { // remove scope?
    var self = this;

    self.tab = 2;

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

  }]); // app.controller - StudyController

  /* ------------------------------------------
   *   SamplesController
   * ------------------------------------------ */
  app.controller('SamplesController', ['$scope','$http',function($scope, $http) { // passing in $scope to be able to call $scope.apply() in parseXML() to update data bindings
    // this.items = studyItems;
    var self = this;

    // self.field_names = [ 'centerName', 'name', 'title'];


    self.common = { // object of data common for all samples in sample set
      centerName: {
        label: 'Center name',
        description: 'The name of your institution as specified in your ENA user account',
        value: '',
        placeholder: 'BIOINFORMATICS INFRASTRUCTURE FOR LIFE SCIENCES'
      },
      name: {
        label: 'Sample name',
        description: 'A unique name for the sample',
        value: '',
        placeholder: 'Sample001'
      },
      title: {
        label: 'Title',
        description: 'A short informative description of the sample',
        value: '',
        placeholder: 'A human sample'
      },
      taxonID: {
        label: 'Organism Taxon ID',
        description: 'Provide NCBI taxon_id for organism (e.g. 9606 for human)',
        value: '',
        placeholder: '9606'
      },
      sci_name: {
        label: 'Organism  scientific name',
        description: 'Scientific name as appears in NCBI taxonomy for the taxon_id (e.g. homo sapiens)',
        value: '',
        placeholder: 'homo sapiens'
      },
      common_name: {
        label: 'Organism common name - optional',
        description: 'The common name for the organism (e.g. human)',
        value: '',
        placeholder: 'human'
      },
      description: {
        label: 'Description - optional',
        description: 'A longer description of sample and how it differs from other samples',
        value: '',
        placeholder: 'Sample from ...'
      },
      attributes: [
        {tag: "", value: "", unit: ""}
      ]
    };

    self.list = []; // list of samples and their data to be filled in


    // // cross domain problems as usual - leave for now
    // self.getTaxonData = function() {
    //   var url = "http://www.ebi.ac.uk/ena/data/taxonomy/v1/taxon/tax-id/" + self.common.taxonID.value;
    //   $http.get(url).then(function(response) {
    //     $scope.$apply(function() {
    //       self.common.sci_name = response.data.scientificName;
    //       self.common.common_name = response.data.commonName;
    //     });
    //   });
    // };

    self.addNewAttribute = function(sample) {
      sample.attributes.push({tag: "", value: ""});
    };

    self.removeAttribute = function(sample) {
      var lastItem = sample.attributes.length-1;
      sample.attributes.splice(lastItem);
    };

    self.loadChecklist = function(sample) {
      if (!sample.attributes[0].tag) { sample.attributes = []; } // clear array if it only contains one empty attribute
      $http.get("ERC000011.json").then(function(response){
        var attrs = response.data;
        for (var i = 0; i < attrs.length; i++) {
          sample.attributes.push(
            attrs[i]
          );
        }
      });
    };

    self.filterEmptyAttributes = function(element) {
      return element.value;
    };

    self.addNewSample = function() { // should refactor this to one sample creating function
      var tmp = {
        centerName: {
          label: 'Center name',
          description: 'The name of your institution as specified in your ENA user account',
          value: self.common.centerName.value,
          placeholder: 'BIOINFORMATICS INFRASTRUCTURE FOR LIFE SCIENCES'
        },
        name: {
          label: 'Sample name',
          description: 'A unique name for the sample',
          value: self.common.name.value,
          placeholder: 'Sample001'
        },
        title: {
          label: 'Title',
          description: 'A short informative description of the sample',
          value: self.common.title.value,
          placeholder: 'Sample001'
        },
        taxonID: {
          label: 'Organism Taxon ID',
          description: 'Provide NCBI taxon_id for organism (e.g. 9606 for human)',
          value: self.common.taxonID.value,
          placeholder: '9606'
        },
        sci_name: {
          label: 'Organism scientific name',
          description: 'Scientific name as appears in NCBI taxonomy for the taxon_id (e.g. homo sapiens)',
          value: self.common.sci_name.value,
          placeholder: 'homo sapiens'
        },
        common_name: {
          label: 'Organism common name - optional',
          description: 'The common name for the organism (e.g. human)',
          value: self.common.common_name.value,
          placeholder: 'human'
        },
        description: {
          label: 'Description - optional',
          description: 'A longer description of sample and how it differs from other samples',
          value: self.common.description.value,
          placeholder: 'Sample from ...'
        },
        attributes: []
      };

      // Add attributes
      for (var i=0; i<self.common.attributes.length; i++) {
        tmp.attributes.push(
          {
            tag: self.common.attributes[i].tag,
            value: self.common.attributes[i].value,
            unit: self.common.attributes[i].unit
          });
      };

      self.list.push(tmp);

    }

    self.saveXML = function() {
      var pre_element = $("#pre-samples-xml")[0]; // angular has added a child with the same id, so getting the first child
      var xml_text = pre_element.textContent || pre_element.innerText;
      var blob = new Blob([xml_text], {type: "application/xml;charset=utf-8"});;
      saveAs(blob, "sample.xml");
    }

    self.parseXML = function () {
      var input = $("#uploadSampleInput")[0].files[0];
      var reader = new FileReader();
      var content;

      reader.onload = function(e) {
        var content = reader.result;

        var xmlDoc = $.parseXML( content ); // using jquery to parse the xml string
        var $xml = $( xmlDoc );

        $scope.$apply(function() { // to update bindings

          var samples = $xml.find("SAMPLE");
          samples.each(function(){
            // var newSample = {};
            var attr_nodes = $(this).find("SAMPLE_ATTRIBUTE");
            var attrs = [];
            attr_nodes.each(function() {
              attrs.push({
                tag: $(this).find("TAG").text(),
                value: $(this).find("VALUE").text(),
                unit: $(this).find("UNIT").text()
              })
            });

            var newSample = self.createSample (
              $(this).attr( "center_name" ), // centerName
              $(this).attr( "alias" ),  // name
              $(this).find( "TITLE" ).text(), // title
              $(this).find( "TAXON_ID" ).text(), // taxon ID
              $(this).find( "SCIENTIFIC_NAME" ).text(), // sci_name
              $(this).find( "COMMON_NAME" ).text(), // common_name
              $(this).find( "DESCRIPTION" ).text(), // description
              attrs // attributes
            );

            self.list.push(newSample);
            self.checkUnique(newSample); // make effort to find common data between samples
          });
        });
      };

      reader.readAsText(input, 'UTF-8');

    };

    // To check and set unique values in the common sample info object
    // Only removes non-unique values.
    // NB! Does not check that all samples have these values
    self.checkUnique = function (sample) {
      for (var field in sample) {
        if (field !== 'attributes') {
          if (self.common[field].unique === undefined) {
            self.common[field].unique = true;
            self.common[field].value = sample[field].value;
          } else if (self.common[field].unique && self.common[field].value !== sample[field].value) {
            self.common[field].unique = false;
            self.common[field].value = "";
          }
        };
      };

      // Now the attributes
      for (var i = 0; i < sample.attributes.length; i++) {

        if(self.common.attributes[0].tag === "") { self.common.attributes = []; }

        var curr_attr = sample.attributes[i];
        var cmp_attr;
        if ( cmp_attr = self.isInCommonAttributes(curr_attr) ) { // tags will be equal
          if (cmp_attr.unique === undefined) {
            if (cmp_attr.value === curr_attr.value) {
              cmp_attr.unique = true;
              if (cmp_attr.value === undefined) { cmp_attr.value = curr_attr.value; }
            } else {
              cmp_attr.unique = false;
            }
          } else if (cmp_attr.unique && cmp_attr.value !==  curr_attr.value) {
            cmp_attr.unique = false;
            cmp_attr.value = "";
          }

        } else {
          curr_attr.unique = true;
          self.common.attributes.push(curr_attr);
        }

      }


    };

    // To find if an attribute is present in the common attributes list
    // Assumes that it is only legal to have one attribute with the same tag
    self.isInCommonAttributes = function(attr) {
      for (var i = 0; i < self.common.attributes.length; i++) {
        if (self.common.attributes[i].tag === attr.tag) { return self.common.attributes[i]; }
      }
      return false;
    };

    self.createSample = function(center, n, tit, taxID, scin, commonn, descr, attr) {
      return {
        centerName: {
          label: 'Center name',
          description: 'The name of your institution as specified in your ENA user account',
          value: center,
          placeholder: 'BIOINFORMATICS INFRASTRUCTURE FOR LIFE SCIENCES'
        },
        name: {
          label: 'Sample name',
          description: 'A unique name for the sample',
          value: n,
          placeholder: 'Sample001'
        },
        title: {
          label: 'Title',
          description: 'A short informative description of the sample',
          value: tit,
          placeholder: 'Sample001'
        },
        taxonID: {
          label: 'Organism Taxon ID',
          description: 'Provide NCBI taxon_id for organism (e.g. 9606 for human)',
          value: taxID,
          placeholder: '9606'
        },
        sci_name: {
          label: 'Organism scientific name',
          description: 'Scientific name as appears in NCBI taxonomy for the taxon_id (e.g. homo sapiens)',
          value: scin,
          placeholder: 'homo sapiens'
        },
        common_name: {
          label: 'Organism common name - optional',
          description: 'The common name for the organism (e.g. human)',
          value: commonn,
          placeholder: 'human'
        },
        description: {
          label: 'Description - optional',
          description: 'A longer description of sample and how it differs from other samples',
          value: descr,
          placeholder: 'Sample from ...'
        },
        attributes: attr
      };
    };

  }]); // app.controller - SamplesController


  app.directive('studyXml', function () {
    return {
      restrict: 'E',
      templateUrl: 'study-xml.html'
    };
  });

  app.directive('samplesXml', function () {
    return {
      restrict: 'E',
      templateUrl: 'samples-xml.html'
    };
  });


})();
