import Vue from "vue";
import gql from "graphql-tag";

var query = {
  userDepartments: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($userId: Int!) {
              userDepartments(userId: $userId) {
                department {
                  id
                  name
                }
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.userDepartments) {
            resolve(res.data.data.userDepartments);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createUserDepartment: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($userId: Int!, $departmentId: Int!) {
              createUserDepartment(
                userId: $userId
                departmentId: $departmentId
              ) {
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
          if (res.data.data.createUserDepartment.id) {
            resolve(res.data.data.createUserDepartment.id);
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
