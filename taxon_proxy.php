<?php
	// Debugging stuff
	// ini_set('display_errors', 'On');
	// error_reporting(E_ALL | E_STRICT);

	if( isset($_GET['id']) && is_numeric($_GET['id']) ) { // taxonID
		$taxon_url = "http://www.ebi.ac.uk/ena/data/taxonomy/v1/taxon/tax-id/" . $_GET['id'];
		$ch = curl_init($taxon_url);

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch,  CURLOPT_RETURNTRANSFER, 1);

		$result = curl_exec($ch);
		curl_close($ch);
		echo $result;
	}

?>
