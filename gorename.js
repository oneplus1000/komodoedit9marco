// Don't make this var, or it won't be visible afterwards.
print_to_output_tab = function(str) {
    try {
        // Uncomment to allow for prompting of input text
        //if (!str) {
        //    str  = prompt("What text do you want to input?");
        //}
        // Make sure the command output window is visible
        ko.run.output.show(window, false);
        // Retrieve the run output widget document element
        var runWidgetDoc = ko.widgets.getWidget("runoutput-desc-tabpanel").contentDocument;
        // Make sure we're showing the output pane, not the error list pane.
        var deckWidget = runWidgetDoc.getElementById("runoutput-deck");
        if (deckWidget.getAttribute("selectedIndex") != 0) {
            ko.run.output.toggleView();
        }
        // Now find out which newline sequence the window uses, and write the
        // text to it.
        var scimoz = runWidgetDoc.getElementById("runoutput-scintilla").scimoz;
        var prevLength = scimoz.length;
        var currNL = ["\r\n", "\n", "\r"][scimoz.eOLMode];
        var full_str = str + currNL;
        var full_str_byte_length = ko.stringutils.bytelength(full_str);
        var ro = scimoz.readOnly;
        try {
            scimoz.readOnly = false;
            scimoz.appendText(full_str_byte_length, full_str);
        } finally {
            scimoz.readOnly = ro;
        }
        // Bring the new text into view.
        scimoz.gotoPos(prevLength + 1);
    } catch(ex) {
        alert("problems printing [" + str + "]:" + ex + "\n");
    }
};

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function GoRename() {
    var lang = ko.views.manager.currentView.languageObj.name;
    if (lang != 'Go') {
        print_to_output_tab('Error: Current file is not Go!!!');
        //throw Error('Error: Current file is not Go!!!');
        return;
    }
    
    var scimoz = ko.views.manager.currentView.scimoz; 
    var newname = prompt("rename to ");
    if ( newname == null || myTrim(newname) == '' ) {
        print_to_output_tab('Error: New name is empty!!!');
        return;
    }
    var koDoc = ko.views.manager.currentView.koDoc;
    var gofile =  koDoc.displayPath;
    var gorenamecmd = 'gorename -dryrun=false -offset '+gofile+':#'+scimoz.currentPos+' -to ' + newname;
    //print_to_output_tab(gorenamecmd);
    ko.run.runEncodedCommand(window, gorenamecmd);
}

GoRename();

