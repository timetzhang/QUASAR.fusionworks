import Vue from "vue";
import gql from "graphql-tag";

var query = {
  assignmentNoDetails: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        query($id: ID) {
          assignment(id: $id) {
            id
            name
            deadline
            active
            course {
              id
              name
            }
            class {
              id
              name
              year
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.assignment) {
            resolve(res.data.data.assignment);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  assignment: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        query($id: ID) {
          assignment(id: $id) {
            id
            name
            deadline
            details
            active
            course {
              id
              name
            }
            class {
              id
              name
              year
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.assignment) {
            resolve(res.data.data.assignment);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  teacherAssignments: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      //通过UserId查询作业
      //通常用于老师来查询自己布置的作业
      queryString = gql`
        query($userId: Int, $active: Boolean) {
          teacherAssignments(userId: $userId, active: $active) {
            id
            name
            deadline
            createdAt
            updatedAt
            course {
              id
              name
            }
            class {
              id
              name
              year
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.teacherAssignments) {
            resolve(res.data.data.teacherAssignments);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  teacherAssignmentsTodoCount: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($userId: Int) {
          teacherAssignmentsTodoCount(userId: $userId) {
            result
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.teacherAssignmentsTodoCount) {
            resolve(res.data.data.teacherAssignmentsTodoCount);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  studentAssignmentsTodo: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($userId: Int, $classId: Int) {
          studentAssignmentsTodo(userId: $userId, classId: $classId) {
            id
            name
            deadline
            course {
              id
              name
            }
            user {
              name
            }
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.studentAssignmentsTodo) {
            resolve(res.data.data.studentAssignmentsTodo);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  studentAssignmentsTodoCount: variables => {
    return new Promise((resolve, reject) => {
      var queryString = ""; //查询字段
      queryString = gql`
        query($userId: Int, $classId: Int) {
          studentAssignmentsTodoCount(userId: $userId, classId: $classId) {
            result
          }
        }
      `.loc.source.body;

      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: queryString,
          variables: variables
        })
        .then(res => {
          if (res.data.errors) {
            reject(Vue.prototype.$error.format(res.data.errors).message);
          }
          if (res.data.data.studentAssignmentsTodoCount) {
            resolve(res.data.data.studentAssignmentsTodoCount);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createAssignment: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation(
              $courseId: Int!
              $classId: Int!
              $userId: Int!
              $name: String!
              $details: String!
              $deadline: String!
            ) {
              createAssignment(
                courseId: $courseId
                classId: $classId
                userId: $userId
                name: $name
                details: $details
                deadline: $deadline
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
          if (res.data.data.createAssignment) {
            resolve(res.data.data.createAssignment);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateAssignment: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation(
              $id: ID
              $name: String
              $details: String
              $deadline: String
            ) {
              updateAssignment(
                id: $id
                name: $name
                details: $details
                deadline: $deadline
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
          if (res.data.data.updateAssignment) {
            resolve(res.data.data.updateAssignment);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  deleteAssignment: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($id: ID) {
              deleteAssignment(id: $id) {
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
          if (res.data.data.deleteAssignment) {
            resolve(res.data.data.deleteAssignment);
          } else {
            resolve(0);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  deactiveAssignment: variables => {
    return new Promise((resolve, reject) => {
      Vue.prototype.$http
        .post(Vue.prototype.$config.graphQLHost, {
          query: gql`
            mutation($id: ID) {
              updateAssignment(id: $id, active: false) {
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
          if (res.data.data.updateAssignment) {
            resolve(res.data.data.updateAssignment);
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
