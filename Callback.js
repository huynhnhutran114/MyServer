function success(result) {
  return result;
}

function failure(error) {
  console.log(error);
}

module.exports = {
    success,
    failure
}