/**
* Create an icon for the location bar
**/

ccffext.ui.icon.init(document,function() {
    // Open a tab in the "Page Info" dialog
    BrowserPageInfo(null,'ccffext-tab'); 
});

/**
* Register a page load listener that would look for licensing
* information on pages properly responding for it. Gathered
* information is cached for performance reasons		 
**/
window.addEventListener("load",function() {
    gBrowser.addProgressListener(
	{
	    // A tab is opened, closed, or switched to
	    onLocationChange : function(progress,request,uri)
	    {
		// Hide the location bar icon
		ccffext.ui.icon.hide();
		
		const doc = progress.DOMWindow.document;

		if (doc instanceof HTMLDocument)
		{
		    // Show the icon back if the document is cached and contains licensed objects
		    ccffext.objects.callbackify(doc,ccffext.ui.icon.show);
		}
	    },
	    
	    // A document in an existing tab stopped loading
	    onStateChange : function(progress,request,flag,status)
	    {
		if (flag & Components.interfaces.nsIWebProgressListener.STATE_STOP)
		{
		    const doc = progress.DOMWindow.document;

		    if (doc instanceof HTMLDocument) 
		    {
			// Parse the information and put it to cache.
			// Show the icon back if the document contains licensed objects
			
			ccffext.objects.callbackify(
			    doc,
			    ccffext.ui.icon.show,
			    function(document,callbackDocument)
			    {
				ccffext.objects.parse(document.location.href,document,RDFA,XH);
			    });
		    }
		}
	    },
	    
	    onProgressChange: function() {},
	    onStatusChange: function() {},
	    onSecurityChange: function() {}
	},Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
},false);
