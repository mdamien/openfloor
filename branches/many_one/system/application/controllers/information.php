<?php

class Information extends Controller {

	function __construct()
	{
		parent::Controller();
		$this->load->library('tag_lib');
		$this->load->library('wordcloud');
		$this->load->model('tag_model', 'tag');
		$this->load->model('Cms_model','cms');
		$this->load->model('question_model', 'question');
		$this->load->library('wordcloud');
		$this->load->model('Cms_model','cms');
		$this->load->library('validation');
		$this->load->helper('url');//for redirect
		$this->load->helper('form');

		$this->load->scaffolding('cms');
	}
	
	
	function index()
	{		
		$this->failSafe();
	}
	
	function failSafe()
	{
		$this->load->view('welcome_message');
	}
	
	function view ($cms_string)
	{
		$data['cms_id'] = 0;
		if ( is_string($cms_string) ) {
			$data['cms_id'] = $this->cms->get_id_from_url($cms_string);
			if ($data['cms_id']>0) 
				$data = $this->cms->get_cms($data['cms_id']);	
		}
		
		if (count($data) > 1) 
			$this->load->view('view_message',$data);
		else if ($this->userauth->isAdmin()){
			redirect('admin/cms/'.$cms_string);
			ob_clean();
			exit();
		}else 
			$this->failSafe();
	}
	
	/**
	 * this function is used to return ajax data
	 */
	function viewAjax ()
	{
		/* 	
			edit by Rob Stefanussen to allow this function to also serve 
		 	as a mechanism for viewing question responses	
		*/
		$uri_array = $this->uri->uri_to_assoc(3);
		if(isset($uri_array['watch'])) {
			$this->question->question_id = $uri_array['watch'];
			exit('<p>' . $this->question->get('question_answer') . '</p>');
		}
		/*
			end edit
		*/
		
		$data['cms_id'] = 0;
		if ( is_string($this->uri->segment(3)) ) {
			$data['cms_id'] = $this->cms->get_id_from_url($this->uri->segment(3));
			if ($data['cms_id']>0) $data = $this->cms->get_cms($data['cms_id']);	
		}
		
		if (count($data)>1) $output = $data['cms_text'];
		else $output = 'no page found!';
		
		if ($this->userauth->isSuperAdmin()) $output .= "<div>".anchor('admin/cms/'.$data['cms_url'], 'edit')."</div>";
		
		echo $output;
		
		return $output;
		
		exit();
	}
	
	/**
	 * Used for the "About Us" Section
	 *
	 * @return void
	 * @author Clark Endrizzi
	 **/
	public function aboutUs()
	{
		$data['breadcrumb'] = array('Home'=>$this->config->site_url(),"About Us"=>"");
		$data['info'] = $this->cms->GetAboutUsBios();
		
		foreach($data['info'] as $name => $value){
			$img_size = getimagesize("./images/about/".$name."_off.jpg");
			$data['info'][$name]['img_size'] = $img_size[0];
		}
		$this->load->view('about/about_us', $data);
	}
}
?>