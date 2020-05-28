<template>
    <div>
        遥控器
        <button @click="doCmd('U')">U</button>
        <button @click="doCmd('D')">D</button>
        <button @click="doCmd('L')">L</button>
        <button @click="doCmd('R')">R</button>
    </div>    
</template>

<script>
    export default {
        name: "control",
        methods: {
          doCmd(cmd){
            let objOptions = {};
            objOptions.url = '/cmd';
            objOptions.action = '发送命令';
            objOptions.json = {cmd};
            objOptions.func = (json) => {
              console.log(json);
            }
            this.request(objOptions);
          }
        }
    }
</script>

<style scoped>

</style>
