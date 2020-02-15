import Vue from "vue";
import gql from "graphql-tag";

var query = {
  universities: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($name: String) {
              universities(name: $name) {
                id
                name
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors));
          }
          if (res.data.data.universities) {
            resolve(res.data.data.universities);
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
