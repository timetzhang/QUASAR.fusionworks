<template>
  <div>
    <q-list bordered>
      <div v-for="(item, index) in messages" :key="index">
        <q-item clickable v-ripple @click="showDialogChat(index)">
          <q-item-section avatar>
            <q-img
              :src="
                item.headImage
                  ? item.headImage
                  : 'https://cdn.quasar.dev/img/boy-avatar.png'
              "
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <q-item-label caption lines="2">{{
              item.messages[item.messages.length - 1].details
            }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              {{
                $datetime.formatDate(
                  item.messages[item.messages.length - 1].createdAt
                ).full
              }}</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>
    <q-dialog
      v-model="dialogChat"
      transition-show="rotate"
      transition-hide="rotate"
      full-height
    >
      <q-layout view="hHh Lpr fFf" container id="messagesBox">
        <q-header>
          <q-toolbar>
            <q-toolbar-title>
              {{ chat.name }}
            </q-toolbar-title>
            <q-space />
            <q-btn icon="close" v-close-popup dense flat />
          </q-toolbar>
        </q-header>

        <q-page-container class="bg-grey-1">
          <q-page padding>
            <q-chat-message
              v-for="(item, index) in chat.messages"
              :key="index"
              :name="item.fromUser.name"
              avatar="https://cdn.quasar.dev/img/avatar3.jpg"
              :text="[item.details]"
              :stamp="$datetime.formatDate(item.createdAt).full"
              :sent="item.fromUser.name != user.name"
              :bg-color="item.fromUser.name != user.name ? 'grey-4' : 'amber-7'"
            />
          </q-page>
        </q-page-container>
        <q-footer class="q-pa-md bg-grey-4">
          <q-input
            bottom-slots
            v-model="inputedChatMessage"
            dense
            autogrow
            @keyup="sendByKeyboard"
          >
            <template v-slot:before>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>

            <template v-slot:append>
              <q-icon
                v-if="inputedChatMessage !== ''"
                name="close"
                @click="inputedChatMessage = ''"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:after>
              <q-btn round dense flat icon="send" @click="send" />
            </template>
          </q-input>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
import dbUserMessages from "../../controller/dbUserMessages";
import { QSpinnerGears } from "quasar";
import login from "../../utils/login";

import { scroll } from "quasar";
const { getScrollPosition, setScrollPosition } = scroll;

export default {
  name: "info",

  components: {},

  data() {
    return {
      dialogChat: false,
      inputedChatMessage: "",
      user: {},
      messages: [],
      chat: []
    };
  },
  mounted() {
    if (login.check({ redirect: true })) {
      this.init();
    }
  },
  methods: {
    async init() {
      this.user = JSON.parse(localStorage.getItem("user"));

      /* Loading begins */
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: "正在载入数据，请稍后..."
      });
      /* End of Loading */

      const data = await dbUserMessages.userMessages({
        toUserId: this.user.id,
        fromUserId: this.user.id
      });

      //将所有相关messages group成对话
      var groups = [];
      data.forEach(item => {
        if (item.toUser.id != this.user.id) {
          const toUserId = item.toUser.id;
          if (groups[toUserId] == undefined) {
            groups[toUserId] = {
              id: toUserId,
              name: item.toUser.name,
              headImage: item.toUser.headImage,
              messages: []
            };
          }
          groups[toUserId].messages.push(item);
        }
        if (item.fromUser.id != this.user.id) {
          const fromUserId = item.fromUser.id;
          if (groups[fromUserId] == undefined) {
            groups[fromUserId] = {
              id: fromUserId,
              name: item.fromUser.name,
              headImage: item.fromUser.headImage,
              messages: []
            };
          }
          groups[fromUserId].messages.push(item);
        }
      });

      Object.keys(groups).forEach((item, index) => {
        this.messages.push(groups[item]);
      });

      /* Loading finished */
      this.$q.loading.hide();

      console.log(this.messages);
    },
    showDialogChat(index) {
      this.dialogChat = true;

      this.chat = this.messages[index];
      console.log(this.chat);

      setTimeout(() => {
        document.querySelector(
          "#messagesBox .scroll"
        ).scrollTop = document.querySelector(
          "#messagesBox .scroll"
        ).scrollHeight;
      }, 5);
    },
    sendByKeyboard(e) {
      var stat = false;
      if (e.keyCode == 17) {
        stat = true;
        //取消等待
        setTimeout(function() {
          stat = false;
        }, 300);
      }
      if (event.keyCode == 13 && (stat || e.ctrlKey)) {
        this.send();
      }
    },
    async send() {
      if (this.inputedChatMessage) {
        const now = new Date();
        this.chat.messages.push({
          createdAt: now.getTime(),
          details: this.inputedChatMessage,
          fromUser: {
            id: this.user.id,
            name: this.user.name
          },
          toUser: {
            id: this.chat.id,
            name: this.chat.name
          }
        });

        const data = await dbUserMessages.createUserMessage({
          fromUserId: this.user.id,
          toUserId: this.chat.id,
          details: this.inputedChatMessage
        });
        this.inputedChatMessage = "";
      }
    }
  }
};
</script>

<style></style>
