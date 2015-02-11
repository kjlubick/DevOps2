var subject = require('./subject.js');
var mock = require('mock-fs');mock({"testPath":{"testFile":"text content","emptyFile":""}});
var testPath = 'testPath';var testFile ='testFile';var doesnotexist = 'doesnotexist';var stillDoesNotExist = 'stillDoesNotExist';var emptyFile = 'emptyFile';
subject.inc('',undefined);
subject.fileTest(testPath,testPath+"/"+testFile);
subject.normalize('');
subject.format('','','');
subject.blackListNumber('');

mock.restore()