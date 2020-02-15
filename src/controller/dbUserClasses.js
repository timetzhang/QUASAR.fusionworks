import Vue from "vue";
import gql from "graphql-tag";

var query = {
  userClasses: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($userId: Int!) {
              userClasses(userId: $userId) {
                class {
                  id
                  name
                  year
                  department {
                    name
                    college {
                      name
                      university {
                        name
                      }
                    }
                  }
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
          if (res.data.data.userClasses) {
            resolve(res.data.data.userClasses);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  usersUnsubmitWork: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($userIds: String!, $classId: Int!) {
              usersUnsubmitWork(classId: $classId, userIds: $userIds) {
                user {
                  id
                  name
                  cellphone
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
          if (res.data.data.usersUnsubmitWork) {
            resolve(res.data.data.usersUnsubmitWork);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createUserClass: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($userId: Int!, $classId: Int!) {
              createUserClass(userId: $userId, classId: $classId) {
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
          if (res.data.data.createUserClass.id) {
            resolve(res.data.data.createUserClass.id);
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
