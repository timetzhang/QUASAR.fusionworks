import Vue from "vue";
import gql from "graphql-tag";

var query = {
  createUserMedal: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($medalId: Int!, $userId: Int) {
              createUserMedal(medalId: $medalId, userId: $userId) {
                id
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.createUserMedal) {
            resolve(res.data.data.createUserMedal);
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
