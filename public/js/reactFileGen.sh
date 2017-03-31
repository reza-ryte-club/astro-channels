#! /bin/bash
browserify -t [ babelify --presets [ react ] ] journal.js -o autoJournal.js
