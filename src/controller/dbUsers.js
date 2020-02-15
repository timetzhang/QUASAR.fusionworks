import Vue from "vue";
import gql from "graphql-tag";

var query = {
  user: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($id: Int!) {
              user(id: $id) {
                id
                name
                gender
                username
                headImage
                sign
                usertype {
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
          if (res.data.data.user) {
            resolve(res.data.data.user);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  login: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($login: String!, $password: String!) {
              login(login: $login, password: $password) {
                id
                name
                gender
                username
                headImage
                sign
                cellphone
                usertype {
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
          if (res.data.data.login) {
            resolve(res.data.data.login);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  cellphone: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($cellphone: String!) {
              cellphone(cellphone: $cellphone) {
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
          if (res.data.data.cellphone) {
            resolve(res.data.data.cellphone);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createUser: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation(
              $name: String!
              $gender: String!
              $cellphone: String!
              $usertypeId: Int
              $password: String!
              $classId: Int
              $courseId: Int
              $departmentId: Int
              $internalId: String
            ) {
              createUser(
                name: $name
                gender: $gender
                cellphone: $cellphone
                usertypeId: $usertypeId
                password: $password
                classId: $classId
                courseId: $courseId
                departmentId: $departmentId
                internalId: $internalId
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
          if (res.data.data.createUser) {
            resolve(res.data.data.createUser);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateUser: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation(
              $id: Int!
              $name: String
              $gender: String
              $cellphone: String
              $internalId: String
              $headImage: String
              $sign: String
            ) {
              updateUser(
                id: $id
                name: $name
                gender: $gender
                cellphone: $cellphone
                internalId: $internalId
                headImage: $headImage
                sign: $sign
              ) {
                result
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.updateUser) {
            resolve(res.data.data.updateUser);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateUserPassword: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($id: Int!, $oldPassword: String, $newPassword: String) {
              updateUserPassword(
                id: $id
                oldPassword: $oldPassword
                newPassword: $newPassword
              ) {
                result
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.updateUserPassword) {
            resolve(res.data.data.updateUserPassword);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateUserUsername: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($id: Int!, $username: String) {
              updateUserUsername(id: $id, username: $username) {
                result
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.updateUserUsername) {
            resolve(res.data.data.updateUserUsername);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateUserEmail: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($id: Int!, $email: String) {
              updateUserEmail(id: $id, email: $email) {
                result
              }
            }
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.updateUserEmail) {
            resolve(res.data.data.updateUserEmail);
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
