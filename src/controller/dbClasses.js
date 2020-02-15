import Vue from "vue";
import gql from "graphql-tag";

var query = {
  classes: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($departmentId: Int!, $year: String) {
              classes(departmentId: $departmentId, year: $year) {
                id
                name
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.classes) {
            resolve(res.data.data.classes);
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
