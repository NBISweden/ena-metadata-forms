# Readme
This is a web-based form for generating [Study][] and [Sample][] metadata XML files for [programmatic submissions][] to EBI databases.

Generated XML can be saved to local files. Previously saved XML files can also be re-loaded into the form.

For samples, available EBI sample checklist for optional attributes, and taxonomy information (given a valid Taxon ID), are automatically fetched from the EBI. This is done using php proxies to get around the javascript cross-domain request restrictions. Obviously PHP has to be enabled on the server for this to work.

## Dependencies
### Server
* [PHP][]

### Javascript libraries
#### Remotely loaded (no need to download)
* [AngularJS][] - _For managing form data_
* [Bootstrap][] - _For layout and styles_
* [jQuery][] - _Needed by Bootstrap_
* [FileSaver.js][] - _For saving local files_
  * [Blob.js][]

#### Local (need to be downloaded)
_None at the moment_


[Study]: http://www.ebi.ac.uk/ena/submit/preparing-xmls#study
[Sample]: http://www.ebi.ac.uk/ena/submit/preparing-xmls#sample
[programmatic submissions]: http://www.ebi.ac.uk/ena/submit/programmatic-submission
[PHP]: https://secure.php.net/
[AngularJS]: https://angularjs.org/
[Bootstrap]: http://getbootstrap.com/
[jQuery]: https://jquery.com/
[FileSaver.js]: https://github.com/eligrey/FileSaver.js
[Blob.js]: https://github.com/eligrey/Blob.js
