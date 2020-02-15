import Vue from "vue";
import gql from "graphql-tag";

var query = {
  userCourses: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            query($userId: Int!) {
              userCourses(userId: $userId) {
                course {
                  id
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
          `.loc.source.body,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.userCourses) {
            resolve(res.data.data.userCourses);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createUserCourse: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($userId: Int!, $classId: Int!) {
              createUserCourse(userId: $userId, courseId: $courseId) {
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
          if (res.data.data.createUserCourse.id) {
            resolve(res.data.data.createUserCourse.id);
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
