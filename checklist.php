<?php
	// Debugging stuff
	// ini_set('display_errors', 'On');
	// error_reporting(E_ALL | E_STRICT);

	$checklist_url = "ftp://ftp.sra.ebi.ac.uk/meta/xml/checklist.xml";
	$ch = curl_init($checklist_url);

	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch,  CURLOPT_RETURNTRANSFER, 1);

	$result = curl_exec($ch);
	curl_close($ch);
	echo $result;
?>
