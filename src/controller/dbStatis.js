import Vue from "vue";
import gql from "graphql-tag";

var query = {
  StudentAssignmentsStatis: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.apiHost + "statis", variables)
        .then(res => {
          if (res.data) {
            resolve(res.data);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
export default query;
