<?php

class Reaction_model extends Model 
{
	var $question_id = 0;
	var $user_id = 0;
	var $where;
	
	function __construct()
    {
        // Call the Model constructor
        parent::Model();
		$this->where = array();
    }

	public function canUserReaction($can_id)
	{
		$this->where['fk_question_id'] 	= $this->question_id;
		$this->where['fk_user_id'] 		= $this->user_id;
		$this->where['fk_can_id'] 		= $can_id;
		$reaction = $this->db->select('reaction')->from('cn_reactions')->where($this->where)->get()->row();
		return empty($reaction) ? 5 : $reaction->reaction ;																			
	}
	
	public function overallReaction($can_id)
	{
		$reaction = $this->db->query("	SELECT avg(reaction) AS overall_reaction 
										FROM cn_reactions 
										WHERE fk_can_id = $can_id AND fk_question_id = {$this->question_id} 
										GROUP BY fk_can_id")->row();
		return empty($reaction) ? 5 : $reaction->overall_reaction ;										
	}
	
	public function react($value, $can_id, $question_id, $user_id)
	{
		$this->where['fk_question_id'] 	= $this->question_id 	= $question_id;
		$this->where['fk_user_id'] 		= $this->user_id		= $user_id;
		$this->where['fk_can_id'] 		= $can_id;
		
		// $this->db->delete('cn_reactions', $this->where);
		
		$this->where['reaction'] 		= $value;
		$this->db->insert('cn_reactions', $this->where);
	}
}

?>