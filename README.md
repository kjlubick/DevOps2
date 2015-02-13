### DevOPs HW #2 Test Generation


<pre>
=============================== Coverage summary ===============================

Statements   : 98.73% ( 78/79 )
Branches     : 93.75% ( 15/16 )
Functions    : 100% ( 5/5 )
Lines        : 98.63% ( 72/73 )
================================================================================
</pre>

I was unable to figure out a general way to statically analyze `blackListNumber` and determine to make a phone number with a 212 area code.

My general strategy was to make a list of constraints for each parameter and then permute all combinations of those constraints when generating tests.
For example, if I see a parameter being compared to a number, I add that number, number+1 and number-1 to the constraints.
Then, at least three tests will be generated excercising this parameter.