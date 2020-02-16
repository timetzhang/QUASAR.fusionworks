import Vue from "vue";
import gql from "graphql-tag";

var query = {
  medals: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($usertypeId: Int!, $userId: Int) {
              medals(usertypeId: $usertypeId, userId: $userId) {
                id
                name
                content
                condition
                image
                archieved
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.medals) {
            resolve(res.data.data.medals);
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
