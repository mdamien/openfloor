// ===============
// = PopUP Class =
// ===============
//
//
if(!Control) var Control = {};
Control.PopUp = Class.create();

Control.PopUp.prototype = {
	initialize: function (src_elem_id, options){
		this.src_elem_id = src_elem_id;
		this.popup_div = false;		// Don't have it created right now
		// We have a lot of defaults that we use if not defined
		this.options = Object.extend({
			src_elem_event : 'mousedown',
			popup_placement : 'below',		// Can be "below" or "page_center"
			hijax: 'false', 
			hijax_div_class: 'hijax',
			popup_class: 'popup_class',
			document_hide_event: 'true',
			ajax_update_url: 'none',
			offset_x: 0,					// Both offset values are ignored when placement is "page_center"
			offset_y: 0
		}, options || {});
		// If Hijax is set then create the hijax div and give it the specified class, then hide it
		if(this.options.hijax == 'true'){
			this.hijax_div = document.createElement('div');
			document.body.appendChild(this.hijax_div);
			$(this.hijax_div).addClassName(this.options.hijax_div_class);
			$(this.hijax_div).setStyle({
				visibility: 'hidden',
				display: 'none'
			});
			
			if (typeof document.body.style.maxHeight != "undefined") {			
			  	$(this.hijax_div).setStyle({
					position: 'fixed'
				});
			}
			
		}
		// If page_center and a modern browser, set popup_elem_id to be fixed
		if (this.options.popup_placement == "page_center") {			
		  	$(this.popup_elem_id).setStyle({
				position: 'fixed'
			});
		}
		// Assign Events	
		this.popup_elem_event = this.onPopupElemMouseDown.bindAsEventListener(this);
		if(this.options.src_elem_event == 'mousedown'){
			Event.observe(src_elem_id, 'mousedown', this.onSrcElemMouseDown.bindAsEventListener(this));
			
			if(this.options.document_hide_event == 'true'){
				Event.observe(document, 'mousedown', this.onDocumentMouseDown.bindAsEventListener(this));
			}
			this.cancel_document_event = false;
		}else if(this.options.src_elem_event == 'mouseover'){
			// TODO : add support for mouseover 
		}
	}, 
	getClientDim : function(){
		var client_width;
		var client_height;
		// For crossbrowser compatibility, prototype 1.6 and later makes this easier
		if(typeof( window.innerWidth ) == 'number' ){
			client_width = window.innerWidth;
			client_height = window.innerHeight;
		}else{
			client_width = document.body.clientWidth;
			client_height = document.body.clientHeight;
		}
		return [client_width, client_height];
	},
	showPosition : function(srcElemId){
		if(this.options.popup_placement == 'below'){
			var div_dim = Position.cumulativeOffset($(this.src_elem_id));
			var top = div_dim[1] + ($(this.src_elem_id).getHeight());
			//alert(div_dim[0]+" id:"+$(this.src_elem_id).getOffsetParent().id);
			return [div_dim[0], top];
		}else if(this.options.popup_placement == 'page_center'){
			var client_dim = this.getClientDim();

			return [((client_dim[0] / 2) - ($(this.popup_elem_id).getWidth() / 2)), ((client_dim[1] / 2) - ($(this.popup_elem_id).getHeight() / 2))];
		}else{
			alert('Invalid "popup_palcement" value provided in PopUp definition!')
		}
	},
	onSrcElemMouseDown : function(event){
		this.cancel_document_event = true;
		// When using mousedown we want the abilit to toggle
		if(this.popup_div){
			Event.stopObserving($(this.popup_div), 'mousedown', this.popup_elem_event);
			$(this.popup_div).remove();
			this.popup_div = false;
		}else{
			// If Hijax is set then show it
			if(this.options.hijax == 'true'){
				$(this.hijax_div).setStyle({
					top: "0px",
					left: "0px",
					width: "100%",
					height: "100%",
					display: "block",
					visibility: "visible"
				});
			}
			// Positioning
			var pos = this.showPosition(this.src_elem_id);
			// Set Style
			this.popup_div = document.createElement('div');
			document.body.appendChild(this.popup_div);
			$(this.popup_div).addClassName(this.options.hijax_div_class);
			$(this.popup_div).setStyle({
				position: "absolute",
				left: pos[0]+this.options.offset_x+"px",
				top: pos[1]+this.options.offset_y+"px"
			});
			Event.observe($(this.popup_div), 'mousedown', this.popup_elem_event);
			new Ajax.Updater($(this.popup_div), this.options.ajax_update_url, { method: 'get' });
		}

		
	},
	onDocumentMouseDown : function(event){
		if(!this.cancel_document_event){
			// If Hijax is set hide it
			if(this.options.hijax == 'true'){
				$(this.hijax_div).setStyle({
					display: "none",
					visibility: "hidden"
				});
			}
			// Set Style
			$(this.popup_elem_id).setStyle({
				visibility: 'hidden',
				display: 'none'
			});
		}else{
			this.cancel_document_event = false;		// reset
		}
	},
	onPopupElemMouseDown : function(event){
		this.cancel_document_event = true;
	},
	destroy : function(){
		Event.stopObserving($(this.popup_div), 'mousedown', this.popup_elem_event);
		$(this.popup_div).remove();
		this.popup_div = false;
	}

}