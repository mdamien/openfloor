<? $data['red_head'] = 'Welcome'; ?>
<? $this->load->view('view_includes/header.php',$data); ?>
      <script type="text/javascript" src="http://www.google.com/jsapi?key=ABQIAAAAkKcqFPODFw9EgKwKbb0vmxQMMgp4bRk8oDwCMuUVC3eAkH6yhxRey5JriXQU4hISBErCZHOSAAHL4w"></script>
			<script type="text/javascript">

	    google.load("feeds", "1");
	
	    function initialize() {
	      var feed = new google.feeds.Feed("http://blog.politic20.com/category/home/feed");
	      feed.load(function(result) {
	        if (!result.error) {
	          var container = document.getElementById("feed");
	          for (var i = 0; i < result.feed.entries.length; i++) {
	            var entry = result.feed.entries[i];
              var div = document.createElement("div");
              //create link
              var link = document.createElement("a");
              link.setAttribute("href", entry.link);
              link.className = 'feed_title';
              link.appendChild(document.createTextNode(entry.title));
              div.appendChild(link);
              var text = document.createElement("p");
              //text.setAttribute("href", entry['link']);
              //text.appendChild(document.createTextNode(entry['contentSnippet']));
              text.innerHTML = entry.content;
              div.appendChild(text);
              container.appendChild(div);
            }
	        }
	      });
	    }
	    google.setOnLoadCallback(initialize);
	
	    </script>
<div id="content_div">
            
            <div id='herald'>
            	<img src="./images/thep20herald.png" alt='The P20 Herald'>
            	<br />
            	<hr class='herald_hr'>
            	<strong><?=date('l, F j, Y');?></strong>
            	<hr class='herald_hr'>
            	<h2 class='herald_header'>WHY DON'T AMERICANS VOTE?</h2>
            	<table cellspacing="7" cellpadding="0">
	            	<tr><td width="165" valign='top'>
	            	<span id='herald_left'>
	            		<p style="font-size:14px;">What has happened to democracy in America?</p>
	            		<p>EVERYWHERE, U.S.A. - Who truly holds the power - the government or the people? What can be done about the disillusionment and frustration YOU feel when faced with U.S. politics?</p>

  								<p>&nbsp;&nbsp;These are some of the questions and issues Run Politics was created to address.</p>

  								<p>&nbsp;&nbsp;At Run Politics, you don't have to spend $1000 a plate to sit at the table with your elected official.</p>

  								<p>&nbsp;&nbsp;You don't have to spend hours upon hours sifting through mounds of biased data to find the facts.</p>
	            	</span>
	            	</td>
	            	<td bgcolor='#0058AC' width='2'></td>
	            	<td width="200" valign='top'>
	            	<span id='herald_right'>
	            		<br /><br />
	            		<span style='margin-left:-2px;'><img src="./images/megaphone.png" alt='Speak Your Mind'></span>
	            		<br /><br />
	            		
	            		<p style='width:255px;'>&nbsp;&nbsp;You are given a face, a voice, and a megaphone.</p>

  								<p style='width:295px;'>&nbsp;&nbsp;We're more than a library, more than a search engine, more than a social gathering place. Run Politics is not just a website; it's a place where you finally are as powerful as the people who represent you - the way it <u>should</u> be.</p>
	            	
	            	</span>
	            	</td></tr>
	            </table>
	          </div>
	            <!-- 
	            <p>Read our first press release:<br>
              <center><a href='http://blog.politic20.com/2007/07/30/politic20-to-hold-live-web-based-forum-for-salt-lake-city-mayoral-candidates/'>Politic2.0 to Hold Live Web-Based Forum for Salt Lake City Mayoral Candidates</a></center>
              </p>
              -->
              
            <p<strong>Breaking News</strong></p>  
				    <div id="feed"></div>
            <? /*
            <br><br>
            <div id="zip_form">
              <h2>Start by entering your zip code below.</h3>
              <?= form_open('your_government/index');?>
        				<div>
        					<?= form_input('zip','','class="txt"');?>
        					<input type="image" src="images/btn-go.gif" alt="search" /><br />
        					<input type="checkbox" name="defaultzip" value="true" /> Make this my default zip code.
        				</div>
        			</form>            
            </div><!-- end zip -->
						*/?>
</div>
<? 
$data['foot'] = '<span class="foot_list">To find out more information about what we\'re up to:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="foot_list_right"><a href="http://blog.politic20.com" target="top"><img src="./images/readourblog.png" border="0"></a></span>';
$this->load->view('view_includes/footer.php',$data); 
?>  				