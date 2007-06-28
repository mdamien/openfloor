<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>		
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<base href="<?= $this->config->site_url();?>" />
	<style media="all" type="text/css">@import "css/all.css";</style>
	<style media="all" type="text/css">@import "css/userWindow.css";</style>
	<!--[if lt IE 7]><link rel="stylesheet" type="text/css" href="css/lt7.css" media="screen"/><![endif]-->
	
	<script type="text/javascript" src="javascript/prototype.js"></script>
	<script src="javascript/scriptaculous.js" type="text/javascript"></script>
	<script src="javascript/effects.js" type="text/javascript"></script>
	<script type="text/javascript" src="javascript/userWindow.js"></script>
	<?php if(isset($this->validation->event_date)) echo @js_calendar_script('my_form');  ?>
	<title>Politic 2.0</title>
	<link rel="icon" href="/p20/favicon.ico" type="image/x-icon"/>
</head>