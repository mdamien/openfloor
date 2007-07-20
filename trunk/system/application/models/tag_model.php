<?php
class Tag_model extends Model 
{
 	function __construct()
    {
        // Call the Model constructor
        parent::Model();
    }
    
	public function insertTag($value)
	{
		$query = $this->db->query("INSERT INTO cn_tags (value) VALUES ('$value')");
		if($this->db->insert_id() > 0)
			return $this->db->insert_id();
		else
			return false;	
	}
	
	public function insertTagAssociation($questionID, $tagID, $userID)
	{
		$query = "INSERT INTO cn_idx_tags_questions (fk_question_id, fk_tag_id, fk_user_id) ";
		$query .="VALUES ($questionID, $tagID, $userID)";
		$this->db->query($query);
	}
	
	public function getTagsInSet($set)
	{
		foreach($set as $k=>$v) $set[$k] = '\'' . $v . '\'';		
		return $this->db->query('SELECT tag_id, value FROM cn_tags WHERE value IN (' . implode(',',$set) . ')');
	}
	
	public function getAllReferencedTags($event_id = null)
	{
		$result = ($event_id === null) ? 
		$this->db->query('SELECT value FROM cn_idx_tags_questions, cn_tags WHERE fk_tag_id = tag_id')->result_array() : 
		$this->db->query("SELECT value FROM cn_idx_tags_questions, cn_tags WHERE fk_tag_id = tag_id AND fk_question_id IN (SELECT question_id FROM cn_questions WHERE fk_event_id=$event_id)")->result_array() ;
		
		$words = array();
		foreach($result as $v)
			$words[] = $v['value'];
		return $words;	
	}
	
	public function get_id_from_tag($value)
	{
		$result = $this->db->getwhere('cn_tags', array('value' => $value))->result_array();
		return $result[0]['tag_id'];
	}
}
?>