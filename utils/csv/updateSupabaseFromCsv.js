"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sync_1 = require("csv-parse/sync");
var fs_1 = require("fs");
function updateSupabaseFromCsv(filePath) {
    var fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
    var records = (0, sync_1.parse)(fileContent, { columns: true });
    for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
        var record = records_1[_i];
        console.log(record);
    }
    console.log('done');
}
// Get the file path from command-line arguments
var filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a CSV file path as an argument');
    process.exit(1);
}
updateSupabaseFromCsv(filePath);
