<?php
class Question extends Controller 
{
	function __construct()
	{
		parent::Controller();
		$this->load->model('Tag_model','tag');
		$this->load->model('Question_model','question');
		$this->load->model('Event_model','event');
		$this->load->library('validation');
		$this->load->helper('url');//for redirect
	}
	
	function index () {
		$this->add();
	}
	
	function add()
	{				
		#check that user is allowed
		$this->userauth->check();
		
		
		//make sure there is an event id
		//get the event id
		$uri_array = $this->uri->uri_to_assoc(3);		
		$data['event_url'] = $this->uri->assoc_to_uri($uri_array);
		//event
		if (isset($uri_array['event'])) 
		{
			$uri_array = $this->event->get_event(0,$uri_array['event']);
			$data['event_id'] = $uri_array['event_id'];
			$data['event_name'] = $uri_array['event_name']; 
		}
		else
		{
			$data['event_id'] = 0;
			$data['event_name'] = '';
		}

		$data['error'] = '';
		#FORM VALIDATE
		if (isset($_POST['event']) && $_POST['event']=='0') $data['error'] .= 'Please select an Event.<br />';

		$rules['event'] = "required";
		$rules['question'] = "trim|required|min_length[10]|max_length[150]|xss_clean";
		$rules['desc'] = "trim|max_length[250]|xss_clean";
		$rules['tags'] = "trim|strtolower|xss_clean";
		
		$this->validation->set_rules($rules);
				
		if ($this->validation->run() == FALSE) {
			$data['error'] .= $this->validation->error_string;
		} else {
			$questionID = $this->addQuestion();
			if( is_numeric($questionID) ) {
				//redirect to question view page
				redirect('question/voteup/'.$questionID);
				ob_clean();
				exit();
			} else {
				$data['error'] = 'Error Adding Question';
			}
		}
		
		//this makes the info sticky 
		$fields['event']	= ( isset($_POST['event']) ) ? $_POST['event']:"";
		$fields['question']	= ( isset($_POST['question']) ) ? $_POST['question']:"";
		$fields['desc']	= ( isset($_POST['desc']) ) ? $_POST['desc']:"";
		$fields['tags']	= ( isset($_POST['tags']) ) ? $_POST['tags']:"";
		$this->validation->set_fields($fields);
		
		$data['events'] = $this->populateEventsSelect();
		$this->load->view('view_submit_question', $data);
	}

	function addQuestion()
	{
		#check that user is allowed
		$this->userauth->check();
		
		$eventID = $_POST['event'];
		$userID = $this->session->userdata('user_id');
		$questionName = $_POST['question'];
		$questionDesc = $_POST['desc'];
		$tags = $_POST['tags'];		
		
		/* deal with tags first */
		$tags = str_replace(array(' ', "\t"), '', $tags);
		//make sure we have some tags
		if (!empty($tags)) {
			$tagsExist = true;
			$a = explode(',',$tags);
			$tags = array();
			foreach($a as $v) if(!empty($v)) $tags[] = $v;

			$query = $this->tag->getTagsInSet($tags);

			$existingKs = array();
			$existingVs = array();
			foreach($query->result_array() as $row)
			{
				$existingKs[] = $row['tag_id'];
				$existingVs[] = $row['value'];
			}

			$diff = array_diff($tags, $existingVs);

			$newKs = array();
			if(!empty($diff)) foreach($diff as $v) if($k=$this->tag->insertTag($v)) $newKs[] = $k;

			$newKs = array_merge($newKs, $existingKs);
		}
		
		
		/* insert the question*/
		$questionID = $this->question->insertQuestion($questionName, $questionDesc, $userID, $eventID,url_title($questionName));
			
		/* insert proper associations */
		if(isset($tagsExist)) if(isset($questionID)) foreach($newKs as $v) $this->tag->insertTagAssociation($questionID, $v, $userID);
	
		return $questionID;
	}

	function populateEventsSelect()
	{
		$events = $this->event->getEvents();
		
		$output='';
		foreach($events as $v) $output .= "<option value=\"{$v['event_id']}\" ". $this->validation->set_select('event', $v['event_id']) .">{$v['event_name']}</option>";
		return $output;
	}
	
	function view () {
		if (!$this->uri->segment(3))
		{
			redirect('event/');
			ob_clean();
			exit();
		} 
		else 
		{
			$this->load->model('Question_model','question2');
			//set restrictions
			if (is_numeric($this->uri->segment(3))) $this->question2->question_id = $this->uri->segment(3); 
			$data['results'] = $this->question2->questionQueue();
			$this->load->view('view_queue',$data);	
		}
	}
	
	function queue()
	{		
		//get data from url
		$uri_array = $this->uri->uri_to_assoc(3);
		if (!is_array($uri_array))
		{
			redirect('event/');
			ob_clean();
			exit();
		} 
		else 
		{
			$this->load->model('Question_model','question2');
			//set restrictions
			//event
			if (isset($uri_array['event']) && is_numeric($uri_array['event'])) $this->question2->event_id = $uri_array['event'];
			if (isset($uri_array['event']) && is_string($uri_array['event'])) $this->question2->event_id = $this->event->get_id_from_url($uri_array['event']); 
			//questoin
			if (isset($uri_array['question']) && is_numeric($uri_array['question'])) $this->question2->question_id = $uri_array['question'];
			if (isset($uri_array['question']) && is_string($uri_array['question'])) $this->question2->question_id = $this->question->get_id_from_url($uri_array['question']);
			//user
			if (isset($uri_array['user']) && is_numeric($uri_array['user'])) $this->question2->user_id = $uri_array['user'];
			if (isset($uri_array['user']) && is_string($uri_array['user'])) $this->question2->user_id = $this->user->get_id_from_name($uri_array['user']); 
			//tag
			if (isset($uri_array['tag']) && is_numeric($uri_array['tag'])) $this->question2->tag_id = $uri_array['tag'];
			if (isset($uri_array['tag']) && is_string($uri_array['tag'])) $this->question2->tag_id = $this->tag->get_id_from_tag($uri_array['tag']);
			
			$data['results'] = $this->question2->questionQueue();
			$data['event_url'] = $this->uri->assoc_to_uri($uri_array);
			$this->load->view('view_queue',$data);	
		}		
		
	}
	
	function voteup()
	{
		#check that user is allowed
		if(!$this->userauth->check() || $this->question->alreadyVoted($this->uri->segment(3), $this->session->userdata('user_id'))) {
			$this->queue();
			return;
		}
		
		#TODO validation and trending need to be considered
		$id = $this->uri->segment(3);
		$this->question->voteup($this->session->userdata('user_id'), $id);
		$this->queue();
	}
	
	function votedown()
	{
		#check that user is allowed
		if(!$this->userauth->check() || $this->question->alreadyVoted($this->uri->segment(3), $this->session->userdata('user_id'))) {
			$this->queue();
			return;
		}
		
		#TODO validation and trending need to be considered
		$id = $this->uri->segment(3);
		$this->question->votedown($this->session->userdata('user_id'), $id);
		$this->queue();
	}
}
?>