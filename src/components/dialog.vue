<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin bg-primary text-white">
      <q-bar>
        <div>{{ title }}</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6">{{ name }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-html="text"> </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-if="cancel"
          class="text-white text-weight-bold"
          flat
          label="取消"
          color="primary"
          v-close-popup
          @click="onCancelClick"
        />
        <q-btn
          flat
          class="text-white text-weight-bold"
          label="是的"
          color="primary"
          v-close-popup
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["title", "name", "text", "cancel"],

  methods: {
    // 以下方法是必需的
    // (不要改变它的名称 --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // 以下方法是必需的
    // (不要改变它的名称 --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // QDialog发出“hide”事件时
      // 需要发出
      this.$emit("hide");
    },

    onOKClick() {
      // 按OK，在隐藏QDialog之前
      // 发出“ok”事件（带有可选的有效负载）
      // 是必需的
      this.$emit("ok");
      // 或带有有效负载：this.$emit('ok', { ... })

      // 然后隐藏对话框
      this.hide();
    },

    onCancelClick() {
      // 隐藏对话框
      this.hide();
    }
  }
};
</script>
