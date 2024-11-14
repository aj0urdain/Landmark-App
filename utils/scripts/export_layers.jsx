#target photoshop

var doc = app.activeDocument;
var path = doc.path;

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
    var saveFile = new File(path + "/" + fileName);
    
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

alert("Export complete!");