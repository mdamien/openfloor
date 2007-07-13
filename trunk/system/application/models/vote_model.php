<?php

class Vote_model extends Model 
{
	//vars

	
 	function __construct()
    {
        // Call the Model constructor
        parent::Model();
    }
    
	
	public function voteup($fk_user_id, $fk_question_id)
	{
		$this->db->query("INSERT INTO cn_votes (vote_value, fk_user_id, fk_question_id) VALUES (10, $fk_user_id, $fk_question_id)");
	}
	
	public function votedown($fk_user_id, $fk_question_id)
	{
		$this->db->query("INSERT INTO cn_votes (vote_value, fk_user_id, fk_question_id) VALUES (-10, $fk_user_id, $fk_question_id)");
	}
	
	public function alreadyVoted($question_id, $user_id)
	{
		return ($this->db->query("SELECT vote_id FROM cn_votes WHERE fk_user_id=$user_id AND fk_question_id=$question_id")->num_rows() > 0) ? true : false ;		
	}
	
	public function votedScore($question_id, $user_id)
	{
		$query = $this->db->query("SELECT vote_value FROM cn_votes WHERE fk_user_id=$user_id AND fk_question_id=$question_id order by timestamp desc");
		$voted = ($query ->num_rows() > 0) ? true : false ;
		if ($voted) 
		{
			$array = $query->result_array();
			return $array[0]['vote_value'];
		}
		else return $voted;		
	}
}
?>