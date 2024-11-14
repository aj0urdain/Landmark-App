#target photoshop

var doc = app.activeDocument;
// Get desktop path based on operating system
var desktopPath;
if ($.os.match(/windows/i)) {
    desktopPath = new Folder(Folder.desktop);
} else {
    desktopPath = new Folder("~/Desktop");
}

// Turn off all layers first
for (var i = 0; i < doc.layers.length; i++) {
    doc.layers[i].visible = false;
}

// Process each layer
for (var i = 0; i < doc.layers.length; i++) {
    // Make current layer visible
    doc.layers[i].visible = true;
    
    // Save as PNG
    var fileName = doc.layers[i].name + ".png";
    var saveFile = new File(desktopPath + "/" + fileName);
    
    var pngOptions = new PNGSaveOptions();
    pngOptions.transparency = true;
    
    doc.saveAs(saveFile, pngOptions, true, Extension.LOWERCASE);
    
    // Hide layer again
    doc.layers[i].visible = false;
}

// Restore original layer visibility
for (var i = 0; i < doc.layers.length; i++) {
    doc.layers[i].visible = true;
}

alert("Export complete! Files have been saved to your desktop."); 