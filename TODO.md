
*** eddyystop:
- merge the validate... hooks.
if the last param in the called fcn defn is provided and is a fcn, then assume cb.
else check if a promise is returned.
- ? wrapper hook to conditionally run a nested hook. iff()
DONE - build and coverage badges. Feathersjs accts on Travis & Coverall? 
- ? memoization for hooks.populate
- ? unit test softDelete. Would first require very large changes to feathers-tests-app-user.
Else test on a 'live' db.
- https://github.com/MichaelErmer/feathers-populate-hook
