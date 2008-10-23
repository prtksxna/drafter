Drafter = Class.create({
	initialize: function(){
		this.renderTools();
		this.renderSettings();
		this.renderStyle();
		this.renderHTML();
		this.idCount = 0;
		this.fSpan = 23;
		this.fAppend = 0;
		this.fPrepend = 0;
		this.fPull = 0;
		this.fPush = 0;
	},
	renderStyle: function(){
		Element.insert($("drafter_tools"), {'after':'<div id="drafter_style"></div>'});
		var ht = "<strong>CSS:</strong><br/>"
		
		ht += "<textarea id='css_data_arc'></textarea>"
		$("drafter_style").update(ht);
		
		$("css_data_arc").observe('blur',function(event) {
			if(!God.currSelect) return false;
			$(God.currSelect).writeAttribute("style", this.value);
		});
		
		$("drafter_style").setOpacity(0.75);
		$("drafter_style").hide();
	},
	renderHTML: function(){
		Element.insert($("drafter_tools"), {'after':'<div id="drafter_html"></div>'});
		var ht = "<strong>HTML:</strong><br/>"
		ht += "<textarea id='html_data_arc'></textarea>"
		$("drafter_html").update(ht);
		
		$("html_data_arc").observe('blur',function(event) {
			if(!God.currSelect) return false;
			$(God.currSelect).innerHTML = this.value;
		});
		
		$("drafter_html").setOpacity(0.75);
		$("drafter_html").hide();
	},
	renderSettings: function(){
		Element.insert($("drafter_tools"), {'after':'<div id="drafter_settings"></div>'});
		
		var ht = "<strong>DIV Settings</strong><br/>"
		ht += "Span:"
		ht += '<div id="span_track" class="script_slider"><div id="span_handle"></div></div>';
		
		ht += "<br/>	Append: "
		ht += '<div id="append_track" class="script_slider"><div id="append_handle"></div></div>';
		
		ht += "<br/>	Prepend: "
		ht += '<div id="prepend_track" class="script_slider"><div id="prepend_handle"></div></div>';
		
		ht += "<br/>	Push: "
		ht += '<div id="push_track" class="script_slider"><div id="push_handle"></div></div>';
		
		ht += "<br/>	Pull: "
		ht += '<div id="pull_track" class="script_slider"><div id="pull_handle"></div></div>';
		
		ht += "<br/><label for='is_box'>Box: </label> <input type='checkbox' name='is_box' id='is_box' value='box' /> "
		ht += "<label for='is_last'>Last: </label> <input type='checkbox' name='is_last' id='is_last' value='last' /> "
		ht += "<label for='is_border'>Border: </label> <input type='checkbox' name='is_border' id='is_border' value='border' /> "
		ht += "<label for='is_colborder'>ColBorder: </label> <input type='checkbox' name='is_colborder' id='is_colborder' value='colborder' /> "
		
		$("drafter_settings").update(ht)
		
		
		//Make Sliders
		this.spanSlider = new Control.Slider('span_handle', 'span_track', {
			minimum: 1,
			sliderValue: 0.95,
			onSlide: function(v) { God.slideSpan(v) },
		});
		this.appendSlider = new Control.Slider('append_handle', 'append_track', {
			minimum: 0,
			sliderValue: 0,
			onSlide: function(v) { God.slideAppend(v) },
		});
		this.prependSlider = new Control.Slider('prepend_handle', 'prepend_track', {
			minimum: 0,
			sliderValue: 0,
			onSlide: function(v) { God.slidePrepend(v) },
		});
		this.pushSlider = new Control.Slider('push_handle', 'push_track', {
			minimum: 0,
			sliderValue: 0,
			onSlide: function(v) { God.slidePush(v) },
		});
		this.pullSlider = new Control.Slider('pull_handle', 'pull_track', {
			minimum: 0,
			sliderValue: 0,
			onSlide: function(v) { God.slidePull(v) },
		});
		
		$("is_box").observe('click',function(event) {God.updateSelection();});
		$("is_last").observe('click',function(event) {God.updateSelection();});
		$("is_border").observe('click',function(event) {God.updateSelection();});
		$("is_colborder").observe('click',function(event) {God.updateSelection();});
		
		$("drafter_settings").setOpacity(0.5);
		$("drafter_settings").hide();
	},
	showSettings: function(){
		$("drafter_html").hide();
		$("drafter_style").hide();
		$("drafter_settings").show();
	},
	showStyle: function(){
		$("drafter_html").hide();
		$("drafter_style").show();
		$("drafter_settings").hide();
	},
	showEditHTML: function(){
		$("drafter_html").show();
		$("drafter_style").hide();
		$("drafter_settings").hide();
	},
	renderTools: function(){
		Element.insert($("blueprint"), {'before': '<div id="drafter_tools"></div>'});
		var ht = "<a href='#' onclick='God.toggleGrid()'>Toggle &nbsp; <img src='css/table.png' /></a>";
		ht +="<a href='#' onclick='God.addElem()'>Add Element &nbsp; <img src='css/package_add.png' /></a>";
		ht +="<a href='#' onclick='God.addSpace()'>Add Space &nbsp; <img src='css/shape_align_top.png' /></a>";
		ht +="<a href='#' onclick='God.showSettings()'>Edit Settings &nbsp; <img src='css/application_form_edit.png' /></a>";
		ht +="<a href='#' onclick='God.showStyle()'>Edit Style &nbsp; <img src='css/style_edit.png' /></a>";
		ht +="<a href='#' onclick='God.showEditHTML()'>Edit HTML &nbsp; <img src='css/html.png' /></a>";
		$("drafter_tools").update(ht);
		$("drafter_tools").setOpacity(0.9);
	},
	toggleGrid: function(){
		$("blueprint").toggleClassName("showgrid")
	},
	addElem: function(){
		var fullDiv = "<div style='' class='push-"+this.fPush+" pull-"+this.fPull+" append-"+this.fAppend+" prepend-"+this.fPrepend+" span-"+this.fSpan+" "+this.boxClassName()+" "+this.lastClassName()+" "+this.borderClassName()+" "+this.colborderClassName()+"' id='sample_div_"+this.idCount+"'>DIV</div>"
		
		var position = 'after';
		
		if(!this.currSelect) $("blueprint").insert({ 'bottom': fullDiv});
		if(this.currSelect) $(this.currSelect).insert({'after':fullDiv});
		$("sample_div_"+this.idCount).observe('dblclick',function(event) {
			God.select(this.id);
		});
		this.idCount++;
	},
	addSpace: function(){
		var fullDiv = "<hr id='sample_hr_"+this.idCount+"' class='space'/>"
		
		if(!this.currSelect) $("blueprint").insert({ 'bottom': fullDiv});
		if(this.currSelect) $(this.currSelect).insert({'after':fullDiv});
		
		$("sample_hr_"+this.idCount).observe('dblclick',function(event) {
			God.select(this.id);
		});
		this.idCount++;
	},
	select: function(id){
		if(this.currSelect) $(this.currSelect).removeClassName("highlight");
		if(this.currSelect == id){
			this.currSelect = false;
		}else{
			this.currSelect = id;	
			$(id).addClassName("highlight");
		}
		this.changeSettings();
	},
	changeSettings: function(){
		if(!this.currSelect)return false;
		$(this.currSelect).classNames().each(function(elem) {
			if(elem.startsWith("span")) God.spanSlider.setValue((parseInt(elem.split("-").last()))/24);
			if(elem.startsWith("append")) God.appendSlider.setValue((parseInt(elem.split("-").last()))/24);
			if(elem.startsWith("prepend")) God.prependSlider.setValue((parseInt(elem.split("-").last()))/24);
			if(elem.startsWith("push")) God.pushSlider.setValue((parseInt(elem.split("-").last()))/24);
			if(elem.startsWith("pull")) God.pullSlider.setValue((parseInt(elem.split("-").last()))/24);
		});
		$("is_box").checked = $(this.currSelect).hasClassName("box");
		$("is_last").checked = $(this.currSelect).hasClassName("last");
		$("is_border").checked = $(this.currSelect).hasClassName("border");
		$("is_colborder").checked = $(this.currSelect).hasClassName("colborder");
		$("html_data_arc").value = $(this.currSelect).innerHTML;
		$("css_data_arc").value = $(this.currSelect).readAttribute("style");
	},
	updateSelection: function(){
		if(!this.currSelect) return false;
		$(this.currSelect).classNames().each(function(el) {
			$(God.currSelect).removeClassName(el);
		});
		$(this.currSelect).addClassName("push-"+this.fPush+" pull-"+this.fPull+" append-"+this.fAppend+" prepend-"+this.fPrepend+" span-"+this.fSpan+" "+this.boxClassName()+" "+this.lastClassName()+" "+this.borderClassName()+" "+this.colborderClassName());
		$(this.currSelect).addClassName("highlight");
		
	},
	//Class Name toggles
	boxClassName: function(){
		if($("is_box").checked) return "box";
		return "";
	},
	lastClassName: function(){
		if($("is_last").checked) return "last";
		return "";
	},
	borderClassName: function(){
		if($("is_border").checked) return "border";
		return "";
	},
	colborderClassName: function(){
		if($("is_colborder").checked) return "colborder";
		return "";
	},
	slideSpan: function(v){
		this.fSpan = Math.round(v*24);
		this.updateSelection();
	},
	slideAppend: function(v){
		this.fAppend = Math.round(v*24);
		this.updateSelection();
	},
	slidePrepend: function(v){
		this.fPrepend = Math.round(v*24);
		this.updateSelection();
	},
	slidePush: function(v){
		this.fPush = Math.round(v*24);
		this.updateSelection();
	},
	slidePull: function(v){
		this.fPull = Math.round(v*24);
		this.updateSelection();
	},
});

document.observe("dom:loaded", function(){
	God = new Drafter;
	
});