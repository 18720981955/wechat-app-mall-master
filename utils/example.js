//callback
function add_callback(p1, p2, callback) {
  var my_number = p1 + p2;
  callback(my_number);
}
add_callback(5, 15, function (num) {
  console.log("call " + num);
});