<template>
  <header class="header">
    <h1>Azure OpenAI ChatGPT Bot</h1>
  </header>
  <section class="content" ref="msgContainer">
    <ul id="chat-area" v-for="(message, index) in chatMessages" :key="index">
      <li v-if="message.role == 'Bot'">
        <div class="balloon">
          <img class="img-circle" src="openai.png" alt="image" />
          <p class="talk">{{ message.msg }}</p>
        </div>
      </li>
      <li v-else>
        <div class="balloon balloon-r">
          <p class="talk talk-r">{{ message.msg }}</p>
        </div>
      </li>
    </ul>
  </section>
  <footer class="footer">
    <input
      id="msg-send"
      class="msg-input"
      placeholder="請輸入訊息"
      v-model="prompt"
      v-on:keyup.enter="sendMessage()"
    >
    <button class="btn-submit" type="button" @click="sendMessage()">
      傳送
    </button>
  </footer>
</template>

<script>
import axios from 'axios';
import { Toast } from './utils/helpers';

export default {
  name: 'App',
  data() {
    return {
      openaiEndpoint: process.env.VUE_APP_OPENAI_ENDPOINT,
      openaiModelDeploymentName: process.env.VUE_APP_OPENAI_MODEL_DEPLOYMENT_NAME,
      openaiKey: process.env.VUE_APP_OPENAI_KEY,
      prompt: '',
      chatMessages: [],
      botMessageArrayIndex: 0,
    };
  },
  mounted() {
    this.chatMessages.push({
      msg: '您好，我是 Azure OpenAI 的 ChatGPT，有任何問題都可以問我 ^_^',
      role: 'Bot',
    });
  },
  watch: {
    chatMessages: {
      handler() {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      },
      deep: true,
    },
  },
  methods: {
    sendMessage() {
      if (this.prompt !== '') {
        this.showUserMessage();
        this.postOpenAI(this.prompt);
        this.prompt = '';
      } else {
        Toast.fire({
          icon: 'error',
          title: '請輸入訊息 !',
        });
      }
    },
    showUserMessage() {
      this.chatMessages.push({
        msg: this.prompt,
        role: 'User',
      });
    },
    showBotMessage(botMessage) {
      this.chatMessages.push({
        msg: botMessage,
        role: 'Bot',
      });
      this.botMessageArrayIndex = this.chatMessages.length - 1;
    },
    async postOpenAI(userPrompt = '') {
      this.showBotMessage('思考中 ~');
      const reqBody = {
        messages: [
          {
            role: 'system',
            content: '你是一個名叫「OpenAI ChatGPT」的角色。請用小於6歲的孩子能夠聽懂的語言和親切、容易親近的口吻來講話。',
          },
          {
            role: 'user',
            content: userPrompt,
          },
          {
            role: 'assistant',
            content: '',
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 800,
        stop: null,
      };
      try {
        const res = await axios.post(
          `${this.openaiEndpoint}openai/deployments/${this.openaiModelDeploymentName}/chat/completions?api-version=2023-03-15-preview`,
          JSON.stringify(reqBody),
          {
            headers: {
              'content-type': 'application/json',
              'api-key': this.openaiKey,
            },
          },
        );
        this.chatMessages[this.botMessageArrayIndex].msg = res.data.choices[0].message.content;
      } catch (error) {
        console.log(error.response.data.error);
      }
    },
  },
};
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
}
.header {
  top: 0;
  position: sticky;
  z-index: 1;
  width: 100%;
  height: 50px;
  font-size: 10px;
  text-align: center;
  line-height: 50px;
  background-color: rgb(30, 144, 255);
  color: white;
}

.content {
  width: 100%;
  min-height: calc(100vh - 100px);
  margin-bottom: 50px;
  background-color: lightgray;
}

#chat-area {
  padding: 10px;
  list-style: none;
}

.balloon {
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
}
.balloon-r {
  margin-right: 15px;
  justify-content: flex-end;
}

.img-circle {
  width: 50px;
  height: 50px;
  margin: 0 15px;
  border-radius: 25px;
  background-color: white;
}

.talk {
  max-width: 500px;
  padding: 10px;
  border-radius: 10px;
  background: white;
}
.talk-r {
  background-color: skyblue;
}

.footer {
  position: fixed;
  z-index: 1;
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.msg-input {
  width: 70%;
  margin-right: 10px;
  padding: 5px 15px;
  border: 1px solid gray;
  border-radius: 25px;
  background-color: whitesmoke;
}

.btn-submit {
  padding: 6px;
  border: none;
  border-radius: 5px;
  background-color: deepskyblue;
  color: white;
}
</style>
