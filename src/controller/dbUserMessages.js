import Vue from "vue";
import gql from "graphql-tag";

var query = {
  userMessages: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($fromUserId: Int!, $toUserId: Int) {
              userMessages(fromUserId: $fromUserId, toUserId: $toUserId) {
                createdAt
                details
                read
                fromUser {
                  id
                  headImage
                  name
                }
                toUser {
                  id
                  headImage
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
          if (res.data.data.userMessages) {
            resolve(res.data.data.userMessages);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  createUserMessage: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($fromUserId: Int!, $toUserId: Int!, $details: String) {
              createUserMessage(
                fromUserId: $fromUserId
                toUserId: $toUserId
                details: $details
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
          if (res.data.data.createUserMessage.id) {
            resolve(res.data.data.createUserMessage.id);
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
