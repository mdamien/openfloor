<?
switch ($this->flag_lib->type) {
	case 'question':
		$fk_id = $question_id;
		break;
	case 'user':
		$fk_id = $user_id;
		break;
	default:
		show_error('flag.php::type: invalid type');
		break;
} 
$html = $this->flag_lib->createFlagHTML($fk_id);
?>

<img class="img-flag-<?=$this->flag_lib->type?>" src="./images/flag.png" <? if(!empty($html)) echo "onclick=\"javascript:queueUpdater.toggleVisibility('flag_{$this->flag_lib->type}$fk_id');queueUpdater.toggleQueue();\"" ?>/>
<?=$html?>

<?//new Effect.toggle('flag_{$this->flag_lib->type}$fk_id','blind', {queue: 'end'});?>