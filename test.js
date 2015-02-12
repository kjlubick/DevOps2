var subject = require('./subject.js');
var mock = require('mock-fs');mock({"testPath":{"testFile":"text content","emptyFile":""}});
var testPath = 'testPath';var testFile ='testFile';var doesnotexist = 'doesnotexist';var stillDoesNotExist = 'stillDoesNotExist';var emptyFile = 'emptyFile';
subject.inc('','');
subject.inc('',undefined);
subject.fileTest('',testPath+"/"+testFile);
subject.fileTest(testPath,testPath+"/"+testFile);
subject.fileTest(doesnotexist,testPath+"/"+testFile);
subject.fileTest('',testPath+"/"+emptyFile);
subject.fileTest(testPath,testPath+"/"+emptyFile);
subject.fileTest(doesnotexist,testPath+"/"+emptyFile);
subject.fileTest('',testPath+"/"+stillDoesNotExist);
subject.fileTest(testPath,testPath+"/"+stillDoesNotExist);
subject.fileTest(doesnotexist,testPath+"/"+stillDoesNotExist);
subject.fileTest('',testPath+"/"+testFile);
subject.fileTest(testPath,testPath+"/"+testFile);
subject.fileTest(doesnotexist,testPath+"/"+testFile);
subject.fileTest('',doesnotexist+"/"+stillDoesNotExist);
subject.fileTest(testPath,doesnotexist+"/"+stillDoesNotExist);
subject.fileTest(doesnotexist,doesnotexist+"/"+stillDoesNotExist);
subject.normalize('');
subject.format('','','');
subject.blackListNumber('');

mock.restore()