/**
 * Create a panel for a tab at the top
 **/
{
    // Main outer panel
    const panel = document.createElement("vbox");
    panel.setAttribute("id","ccffextPanel");
    document.getElementById("mainDeck").appendChild(panel);
    
    // Horizontal box at the top
    const topLine = document.createElement("hbox");
    panel.appendChild(topLine);
    
    // Label showing the number of licensed objects
    const numberLabel = document.createElement("label");
    numberLabel.setAttribute("flex","1");
    topLine.appendChild(numberLabel);
    
    // Checkbox indicating whether to highlight licensed objects on page or not
    const highlightBox = document.createElement("checkbox");
    highlightBox.setAttribute("id","ccffext-highlight");
    highlightBox.setAttribute("label",ccffext.l10n.get("checkbox.highlight.label"));
    highlightBox.setAttribute("checked","true"); // By default, the objects are highlighted
    topLine.appendChild(highlightBox);
    
    // List of licensed objects
    const list = document.createElement("vbox");
    list.setAttribute("id","ccffext-objects");
    list.setAttribute("flex","1");
    panel.appendChild(list);
    
    // List of added items
    var items = [];
}

/**
 * Add a tab at the top
 **/
{
    const tab = document.createElement("radio");
    
    with (tab)
    {
	setAttribute("id","ccffext-tab");
	setAttribute("label",ccffext.l10n.get("tab.title.label"));
	setAttribute("accesskey",ccffext.l10n.get("tab.title.key"));
	
	addEventListener("command",function() {
	    const doc = window.opener.content.document;
	    const objects = ccffext.objects.extract(doc);

	    // Update the label showing the number of objects
	    numberLabel.setAttribute("value",
				     ccffext.l10n.get("label.number.label",objects.length));
	    
	    // Remove all previously added items from the list
	    for (let i = 0; i < items.length; ++i)
	    {
		list.removeChild(items[i]);
	    }
	    
	    items = [];
	    
	    var convertStrings = function(strings,part)
	    {
		var converted = [];
		
		for (let i = 0; i < strings.length; ++i)
		{
		    let name = strings[i].toLowerCase().replace(/[^a-z]/g,"");
		    converted.push(ccffext.l10n.get("object.license." + part + "." + name + ".label"));
		}
		
		var line = converted.join(", ");
		return line.substring(0,1).toUpperCase() + line.substring(1);
	    }
	    
	    // Add new items to the list
	    for (let i = 0; i < objects.length; ++i)
	    {
		const item = document.createElement("hbox");
		item.setAttribute("class","item");
		items.push(item);
		list.appendChild(item);
		
		const leftPanel = document.createElement("vbox");
		leftPanel.setAttribute("class","primary");
		leftPanel.setAttribute("flex","1");
		item.appendChild(leftPanel);
		
		const title = document.createElement("label");
		title.setAttribute("class","title");
		title.setAttribute("value",ccffext.objects.getTitle(doc,objects[i]));
		leftPanel.appendChild(title);
		
		const sourceLine = document.createElement("hbox");
		sourceLine.setAttribute("class","line primary");
		leftPanel.appendChild(sourceLine);
		
		const sourceTitle = document.createElement("label");
		sourceTitle.setAttribute("class","line-title");
		sourceTitle.setAttribute("value",ccffext.l10n.get("object.source.title.label"));
		sourceLine.appendChild(sourceTitle);
		
		var source = ccffext.objects.getSource(doc,objects[i]);
		const sourceValue = document.createElement("label");
		sourceValue.setAttribute("class","anchor");
		sourceValue.setAttribute("value",source);
		sourceValue.setAttribute("uri",source);
		sourceValue.addEventListener("click",function() {
		    window.open(this.getAttribute("uri"));
		},true);
		sourceLine.appendChild(sourceValue);
		
		var type = ccffext.objects.getType(doc,objects[i]);
		if ("undefined" != typeof type)
		{
		    const typeLine = document.createElement("hbox");
		    typeLine.setAttribute("class","line");
		    leftPanel.appendChild(typeLine);
		    
		    const typeTitle = document.createElement("label");
		    typeTitle.setAttribute("class","line-title");
		    typeTitle.setAttribute("value",ccffext.l10n.get("object.type.title.label"));
		    typeLine.appendChild(typeTitle);
		    
		    const typeValue = document.createElement("label");
		    var line = ccffext.l10n.get("object.type."
						+ type.toLowerCase().replace(/[^a-z]/g,"") + ".label");
		    typeValue.setAttribute("value",line.substring(0,1).toUpperCase() + line.substring(1));
		    typeLine.appendChild(typeValue);
		}
		
		var author = ccffext.objects.getAuthor(doc,objects[i]);
		var authorUri = ccffext.objects.getAuthorUri(doc,objects[i]);
		if ("undefined" != typeof author)
		{
		    const authorLine = document.createElement("hbox");
		    authorLine.setAttribute("class","line");
		    leftPanel.appendChild(authorLine);
		    
		    const authorTitle = document.createElement("label");
		    authorTitle.setAttribute("class","line-title");
		    authorTitle.setAttribute("value",ccffext.l10n.get("object.author.title.label"));
		    authorLine.appendChild(authorTitle);
		    
		    const authorValue = document.createElement("label");
		    authorValue.setAttribute("value",author);
		    authorLine.appendChild(authorValue);
		    
		    if ("undefined" != authorUri)
		    {
			authorValue.setAttribute("class","anchor");
			authorValue.setAttribute("uri",authorUri.uri);
			authorValue.addEventListener("click",function(event) {
			    window.open(this.getAttribute("uri"));
			},true);
		    }
		}
		
		var license = ccffext.objects.getLicense(doc,objects[i],window.opener.content,RDFA,XH);
		const licenseLine = document.createElement("hbox");
		licenseLine.setAttribute("class","line primary");
		leftPanel.appendChild(licenseLine);
		
		const licenseTitle = document.createElement("label");
		licenseTitle.setAttribute("class","line-title");
		licenseTitle.setAttribute("value",ccffext.l10n.get("object.license.title.label"));
		licenseLine.appendChild(licenseTitle);
		
		const licenseValue = document.createElement("label");
		licenseValue.setAttribute("class","anchor");
		licenseValue.setAttribute("value",license.name);
		licenseValue.setAttribute("uri",license.uri);
		licenseValue.addEventListener("click",function(event) {
		    window.open(this.getAttribute("uri"));
		},true);
		licenseLine.appendChild(licenseValue);
		
		const licensePermLine = document.createElement("hbox");
		licensePermLine.setAttribute("class","line");
		leftPanel.appendChild(licensePermLine);
		
		const licensePermTitle = document.createElement("label");
		licensePermTitle.setAttribute("class","line-title");
		licensePermTitle.setAttribute("value",
					      ccffext.l10n.get("object.license.permissions.title.label"));
		licensePermLine.appendChild(licensePermTitle);

		const licensePermValue = document.createElement("label");
		licensePermValue.setAttribute("value",convertStrings(license.permissions,"permissions"));
		licensePermLine.appendChild(licensePermValue);
		
		const licenseReqLine = document.createElement("hbox");
		licenseReqLine.setAttribute("class","line");
		leftPanel.appendChild(licenseReqLine);
		
		const licenseReqTitle = document.createElement("label");
		licenseReqTitle.setAttribute("class","line-title");
		licenseReqTitle.setAttribute("value",
					     ccffext.l10n.get("object.license.requirements.title.label"));
		licenseReqLine.appendChild(licenseReqTitle);
		
		const licenseReqValue = document.createElement("label");
		licenseReqValue.setAttribute("value",convertStrings(license.requirements,"requirements"));
		licenseReqLine.appendChild(licenseReqValue);
		
		if (0 < license.prohibitions.length)
		{
		    const licenseProhLine = document.createElement("hbox");
		    licenseProhLine.setAttribute("class","line");
		    leftPanel.appendChild(licenseProhLine);
		    
		    const licenseProhTitle = document.createElement("label");
		    licenseProhTitle.setAttribute("class","line-title");
		    licenseProhTitle.setAttribute("value",
						  ccffext.l10n.get("object.license.prohibitions.title.label"));
		    licenseProhLine.appendChild(licenseProhTitle);
		    
		    const licenseProhValue = document.createElement("label");
		    licenseProhValue.setAttribute("value",convertStrings(license.prohibitions,"prohibitions"));
		    licenseProhLine.appendChild(licenseProhValue);
		}
		
		const rightPanel = document.createElement("vbox");
		item.appendChild(rightPanel);
		
		const imagePlace = document.createElement("vbox");
		imagePlace.setAttribute("flex","1");
		rightPanel.appendChild(imagePlace);
		
		const attribButton = document.createElement("button");
		attribButton.setAttribute("label",ccffext.l10n.get("object.button.attribution.label"));
		attribButton.setAttribute("accesskey",ccffext.l10n.get("object.button.attribution.key"));
		attribButton.setAttribute("type","menu");
		rightPanel.appendChild(attribButton)
		
		const attribButtonPopup = document.createElement("menupopup");
		attribButton.appendChild(attribButtonPopup);
		
		const attribButtonHtml = document.createElement("menuitem");
		attribButtonHtml.setAttribute("label",ccffext.l10n.get("object.button.attributionashtml.label"));
		attribButtonHtml.setAttribute("accesskey",ccffext.l10n.get("object.button.attributionashtml.key"));
		attribButtonHtml.addEventListener("click",function()
						  {
						      const clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
							  getService(Components.interfaces.nsIClipboardHelper);
						      clipboard.copyString(license.infoHtml);
						  },true);
		attribButtonPopup.appendChild(attribButtonHtml);
		
		const attribButtonText = document.createElement("menuitem");
		attribButtonText.setAttribute("label",ccffext.l10n.get("object.button.attributionastext.label"));
		attribButtonText.setAttribute("accesskey",ccffext.l10n.get("object.button.attributionastext.key"));
		attribButtonText.addEventListener("click",function()
						  {
						      const clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
							  getService(Components.interfaces.nsIClipboardHelper);
						      clipboard.copyString(license.infoText);
						  },true);
		attribButtonPopup.appendChild(attribButtonText);
	    }
	    
	    // Eventually switch to the tab
	    showTab('ccffext'); // Activates a panel with the "ccffextPanel" id
	},true);
    }
    
    document.getElementById("viewGroup").appendChild(tab);
}
