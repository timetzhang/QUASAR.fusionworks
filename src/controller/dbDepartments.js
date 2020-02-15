import Vue from "vue";
import gql from "graphql-tag";

var query = {
  departments: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($collegeId: Int!) {
              departments(collegeId: $collegeId) {
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
          if (res.data.data.departments) {
            resolve(res.data.data.departments);
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
