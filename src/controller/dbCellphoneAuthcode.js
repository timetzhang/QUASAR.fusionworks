import Vue from "vue";
var query = {
  send: variables => {
    Vue.prototype.$http.post(
      Vue.prototype.$config.apiHost + "sendCellphoneAuthcode",
      variables
    );
  },
  validate: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(
          Vue.prototype.$config.apiHost + "validateCellphoneAuthcode",
          variables
        )
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
export default query;
