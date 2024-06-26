<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const emit = defineEmits(["refreshPosts"]);
const props = defineProps(["username"]);
const loading = ref(false);
const { isLoggedIn, currentUsername, eventMode } = storeToRefs(useUserStore());
const interval = ref();
const validUsername = ref(false);
const username = ref("");

let messages = ref<Array<Record<string, string>>>([]);
const navColor = ref("#F98A1D");

async function goToMessages() {
  void router.push({ name: "Messages", params: {username: username.value} });
}

async function getMessages() {
  let messageResults;
  try {
    messageResults = await fetchy(`/api/message/user/${username.value}`, "GET")
  } catch (_) {
    return;
  }
  messages.value = messageResults;
}

async function checkProfile() {
  loading.value = true;
  try {
    await fetchy(`/api/profile/user/${username.value}`, "GET", {alert: false});
    validUsername.value = true;
    await getMessages();
  } catch (_) {
    validUsername.value = false;
    messages.value = [];
  }
  loading.value = false;
}

const sendMessage = async (text: string) => {
  if (!text) return;
  try {
    await fetchy(`/api/message/${username.value}`, "POST", {
      body: { text }, alert: false
    });
  } catch (_) {
    return;
  }
  emptyForm();
  await goToMessages();
};

onBeforeMount(async () => {
});

onBeforeUnmount(async () => {
  console.log("unmount");
  clearInterval(interval.value);
});


const emptyForm = () => {
  text.value = "";
};
</script>

<template>
  <div class="messagesSection">
    <section class="profile">
      <form class="userForm" @submit.prevent="sendMessage(text)" :style="(eventMode) ? `background-color: ${navColor}` : ''">
        <label for="userInput">New Message To:</label>
        <input id="userInput" type="text" :class="(validUsername) ? 'valid' : 'invalid'" v-model="username" placeholder="Enter username to message." autocomplete="off" @input="checkProfile"/>
      </form>
    </section>
    <section class="messages">
      <body class = "message" v-for="message in messages">
        <div v-if="message.from === currentUsername" class="sentContainer">
          <p class="sent">
            {{ message.text }}
          </p>
        </div>
        <div v-else class="receivedContainer">
          <p class="received">
            {{ message.text }}
          </p>
        </div>
        <br/>
      </body>
    </section>
    <form v-if="validUsername" @submit.prevent="sendMessage(text)">
      <input id="text" v-model="text" placeholder="Enter text." autocomplete="off"/>
      <button type="submit" class="pure-button-primary pure-button">Send</button>
    </form>
  </div>
</template>

<style scoped>

.profile {
  border-bottom:solid;
  border-radius : 1em;
}

form {
  background-color: var(--dark-bg);
  color: white;
  border-radius: 1em;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 1em;
}

.userForm {
  display:flex;
  align-items: center;

}


.valid {
  color: black;
  width: 50%;
}
.invalid {
  color: darkred;
  width: 50%;
}
.messagesSection {
  border-style: dashed;
  border-radius: 1em;
  background-color: white;
  box-shadow: 0.5em 1em 1em black;
  border-width: .25em;
}

.messages {
  display:flex;
  flex-direction: column-reverse;
}

.sentContainer {
  display:flex;
  justify-content : flex-end;
  padding-right: 2em;
}

.receivedContainer {
  display:flex;
  justify-content : flex-start;
  padding-left: 2em;
}

.sent {
  background-color: plum;
  padding: 0.5em 1em;
  border-radius: 1em;
}

.received {
  padding: 0.5em 1em;
  background-color: lightgray;
  border-radius: 1em;
}

.messagesSection {
  height:90vh;
  width:100%;
}

.messages {
  height: 79%;
  overflow-y: scroll;
}

input {
  width:80%
}

button {
  width: 20%
}

.row {
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  max-width: 100%;
}


.icon {
  width: 1em;
}
.dropdownButton {
  width: 10em;
}

.user {
  font-weight: normal;
}

h1 {
  margin-top: 0;
  margin-bottom: 0;
}

p {
  margin: 0em;
}

img {
  object-fit: cover;
  width: 25%;
  aspect-ratio: 1;
}

.title {
  font-weight: bold;
}

.options {
  display: flex;
  justify-content: space-between;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
