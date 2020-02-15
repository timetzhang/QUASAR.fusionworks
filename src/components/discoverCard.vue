<template>
  <q-card flat bordered @click="$emit('click')">
    <q-img
      :src="image"
      :ratio="$q.platform.is.mobile ? 1 : 13 / 15"
      style="cursor:pointer"
    >
      <div class="absolute-bottom">
        <q-item>
          <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
            <q-item-label class="text-grey" caption lines="2" v-html="">
              {{ details.replace(/<[^>]+>/g, "") }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </div>
    </q-img>

    <q-separator />

    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img :src="head" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ user }}</q-item-label>
        <q-item-label caption>
          {{ date }}
        </q-item-label>
      </q-item-section>
      <q-item-section style="text-align:right">
        <q-item-label caption>
          {{ course }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script>
export default {
  name: "discoverCard",
  props: {
    title: {
      type: String,
      required: true
    },
    details: {
      type: String
    },
    image: {
      type: String,
      default: "https://cdn.quasar.dev/img/parallax2.jpg"
    },
    head: {
      type: String,
      default: "https://cdn.quasar.dev/img/boy-avatar.png"
    },
    user: {
      type: String
    },
    date: {
      type: String
    },
    course: {
      type: String
    }
  },
  data() {
    return {};
  }
};
</script>
