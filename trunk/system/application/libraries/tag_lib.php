<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Tag_lib {

	public function __construct()
	{	
		#TODO Do we want to combine tag_lib.php with wordcloud.php?
		$this->CI=& get_instance();
	}
	
	public function createTagLink($arg, $event = null)
	{
		$global = false;
		if(is_array($arg)) $type = true;		// array passed, we want to generate html for a tag cloud
		elseif(is_string($arg)) $type = false;	// string passed, we want to create a single link
		else exit();							// invalid argument
		
		// if an event is specified, then we do not want a dynamic tag link, return a static one
		if(isset($event)) return anchor("forums/queue/event/$event/tag/$arg", $arg);
		
		$segment_array = $this->CI->uri->segment_array();
		
		if($segment_array[3] != 'event') $global = true;
		
		//TEMP CODE, DELETE AFTER EVENT ON NOV 2nd
		if(!$segment_array) {
			$segment_array[1] ="event";
		}
		
		if(is_numeric($segment_array[count($segment_array)]))
			array_pop($segment_array);
		$class = array_shift($segment_array);
		$function = array_shift($segment_array);
		if (($k = array_search('tag', $segment_array)) !== false) array_splice($segment_array, $k, $k+2);
		if (($k = array_search('ajax', $segment_array)) !== false) array_splice($segment_array, $k, $k+2);
		$args = '/'.implode('/', $segment_array);
		
		if ($type) {							// generate cloud
			$cloud = '';
			foreach ($arg as $v)
				if($global)
					$cloud .= ' ' . anchor("forums/queue/tag/{$v['word']}", $v['word'], array('class' => "size{$v['sizeRange']}")) . ' &nbsp;';
				else
					$cloud .= ' ' . anchor("$class/$function/tag/{$v['word']}$args", $v['word'], array('class' => "size{$v['sizeRange']}")) . ' &nbsp;';
			return $cloud;
		} else {								// generate single link
			return anchor("$class/$function/tag/$arg$args", $arg);
		}		
	}
	
	public function createTagLinks(&$result, $event = null)
	{
		foreach($result as $k1=>$question)
		 	if(!empty($question['tags']))
				foreach($question['tags'] as $k2=>$tag) 
					$result[$k1]['tags'][$k2]=$this->createTagLink($tag, $event);
	}
	
	public function createTagCloud($event_id)
	{
		$words = $this->CI->tag->getAllReferencedTags($event_id);
		if(!empty($words)) {
			$cloud = new wordCloud($words);
			$cloud_array = $cloud->showCloud('array');
			return $this->createTagLink($cloud_array);
		}
	}
}