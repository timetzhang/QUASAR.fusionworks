<template>
  <q-editor
    ref="editor"
    :definitions="{
      upload: {
        tip: '上传图片',
        icon: 'image',
        handler: uploadImage
      }
    }"
    :toolbar="[
      [
        {
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
        {
          icon: $q.iconSet.editor.bold,
          fixedLabel: true,
          list: 'no-icons',
          options: ['bold', 'italic', 'strike', 'underline']
        },
        {
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7'
          ]
        },
        {
          label: '列表',
          icon: $q.iconSet.editor.unordered,
          fixedLabel: true,
          options: ['unordered', 'ordered']
        },
        'quote',
        'hr',
        'link',
        'upload'
      ],
      ['print', 'fullscreen']
    ]"
    style="width:100%"
    v-model="details"
    min-height="10rem"
  />
</template>
<script>
import DialogImage from "components/dialogImage";

export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      details: ""
    };
  },
  watch: {
    value(val) {
      this.details = val;
    },
    details(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    uploadImage() {
      this.$q
        .dialog({
          component: DialogImage
        })
        .onOk(result => {
          this.$refs.editor.runCmd(
            "insertHTML",
            "<img style='width:100%' src='" + result.result + "' />"
          );
        });
    }
  }
};
</script>
