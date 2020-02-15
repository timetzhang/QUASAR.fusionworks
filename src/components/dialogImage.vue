<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin bg-grey-3 text-black">
      <q-bar>
        <div>添加图片</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-md">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="url" label="图片URL地址" />
            <q-tab name="upload" label="上传图片" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="url">
              <q-input filled v-model="result" label="请输入URL地址" />
              <img :src="result" style="width:100%" />
              <div class="q-pa-md text-center">
                <q-btn-group>
                  <q-btn
                    color="grey"
                    size="16px"
                    label="取 消"
                    @click="onCancelClick"
                  />
                  <q-btn
                    color="primary"
                    size="16px"
                    label="确 定"
                    @click="onOKClick"
                  />
                </q-btn-group>
              </div>
            </q-tab-panel>

            <q-tab-panel name="upload">
              <q-uploader
                style="width:100%"
                ref="uploader"
                :url="$config.apiHost + 'uploadFile'"
                accept="image/*"
                field-name="file"
                @uploaded="uploaded"
                @added="uploadAdded"
              />
              <div class="q-pa-md text-center">
                <q-btn-group>
                  <q-btn
                    color="grey"
                    size="16px"
                    label="取 消"
                    @click="onCancelClick"
                  />
                  <q-btn
                    color="primary"
                    size="16px"
                    label="确 定"
                    @click="$refs.uploader.upload()"
                  />
                </q-btn-group>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import imageConversion from "image-conversion";

export default {
  props: {},
  data() {
    return {
      tab: "url",
      result: ""
    };
  },
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
      this.$emit("ok", { result: this.result });
      // 或带有有效负载：this.$emit('ok', { ... })

      // 然后隐藏对话框
      this.hide();
    },

    onCancelClick() {
      // 隐藏对话框
      this.hide();
    },
    async uploadAdded(files) {
      //进行文件压缩
      var blob = await imageConversion.compress(files[0], {
        quality: 0.7,
        type: "image/jpeg",
        width: 800
      });

      //将blob转换成file
      var file = new window.File([blob], this.$refs.uploader.files[0].name, {
        type: this.$refs.uploader.files[0].type
      });
      this.$refs.uploader.queuedFiles = [];
      this.$refs.uploader.queuedFiles.push(file);
    },
    uploaded(files) {
      var filename =
        this.$config.uploadsUrl + JSON.parse(files.xhr.response).filename;
      this.$emit("ok", { result: filename });
      this.hide();
    }
  }
};
</script>
