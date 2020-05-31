<template>
    <div>
        <flexbox>
            <flexbox-item>
            pwma
            <input class='pwm' type='number' min=1 max=10 v-model='pwma' @change='syncCar'/>
            </flexbox-item>
            <flexbox-item>
            pwmb
            <input class='pwm' type='number' min=1 max=10 v-model='pwmb' @change='syncCar'/>
            </flexbox-item>            
        </flexbox>          
        <flexbox>
            <flexbox-item>
                <button @click="doCmd('U')">U</button>
            </flexbox-item>
            <flexbox-item>
                 <button @click="doCmd('D')">D</button>
            </flexbox-item>
            <flexbox-item>
                <button @click="doCmd('L')">L</button>
            </flexbox-item>
            <flexbox-item>
                <button @click="doCmd('R')">R</button>
            </flexbox-item>
            <flexbox-item>
                <button @click="doCmd('S')">S</button>
            </flexbox-item>
            <flexbox-item v-if="!car.keep">
                <button @click="doCmd('KT')">KT</button>
            </flexbox-item>
            <flexbox-item v-if="car.keep">
                <button @click="doCmd('KF')">KF</button>
            </flexbox-item>
        </flexbox> 
        <flexbox>  
            <flexbox-item>  
                距离
                {{joystick.distance}}
            </flexbox-item>
            <flexbox-item>
                角度
                {{joystick.angle.degree}}
            </flexbox-item>    
            <flexbox-item>
                方向
                {{direction}}
            </flexbox-item>    
            <flexbox-item>
                Keep
                {{car.keep}}
            </flexbox-item>    
        </flexbox>           
        <div class="joystick_area" ref="joystick" :style="joyStyle">
           
        </div>

    </div>    
</template>

<script>
    let moment = require('moment');   
    import {Flexbox, FlexboxItem} from 'vux' 
    const TouchLimit = 50;//圆周半径
    export default {
        name: "control",
        data() {
            return {
                pwma: 10,
                pwmb: 10,
                car: {keep: false, pwma: 10, pwmb:　10},
                busy: false,
                now: moment().format('YYYY-MM-DD HH:mm:ss'),
                timerCheck: 0,
                joystick: this.getEmptyStick()
            }
        },  
        created(){
            let objSelf = this;
            (function poll() {
                clearTimeout(objSelf.timerCheck);
                objSelf.now = moment().format('YYYY-MM-DD HH:mm:ss');
                objSelf.timerCheck = setTimeout(poll, 1000);
                if (objSelf.joystick.touching && objSelf.joystick.distance >= TouchLimit) {
                    objSelf.doCmd(objSelf.direction)
                }
            })();            
        },      
        mounted() {
            let objSelf = this;
            var options = {
                zone: this.$refs.joystick,
                color: 'red'
            };
            var objJoystick = require('nipplejs').create(options);
            objJoystick.on('start end', function (evt, data) {
                // dump(evt.type);
                // debug(data);
                switch (evt.type) {
                    case 'start':
                        objSelf.joystick.touching = true;
                        objSelf.joystick.position = data.position;
                        objSelf.joystick.touchBeginAt = moment();

                        break;
                    case 'end':
                        if (objSelf.joystick.touching) {
                            objSelf.doCmd("S");
                        }
                        objSelf.joystick = objSelf.getEmptyStick();
                        break;
                }
            })
                .on('move', function (evt, data) {
                    objSelf.joystick.angle.degree = data.angle.degree;
                    objSelf.joystick.distance = data.distance;
                })
                .on('dir:up plain:up dir:left plain:left dir:down ' +
                    'plain:down dir:right plain:right',
                    function (evt, data) {
                        // console.log(evt.type);
                        // console.log('direction');
                        // console.log(data);
                    }
                )
                .on('pressure', function (evt, data) {
                    console.log('pressure');
                    // debug({
                    //   pressure: data
                    // });
                });

        },         
        methods: { 
          syncCar(){
            if (this.busy)
            {
                return;
            }
            this.busy = true;
            let objOptions = {};
            objOptions.url = '/sync';
            objOptions.action = '同步参数';
            objOptions.json = {car: {
               keep: false, pwma: this.pwma*100, pwmb:　this.pwmb*100
            }};
            objOptions.func = (json) => {
                this.busy = false;
                this.car = json.car;
                this.syncParams();
            }
            this.request(objOptions);
          },
          syncParams(){
                this.pwma = this.car.ena/ 100;
                this.pwmb = this.car.enb/ 100;
          },   
          getEmptyStick() {
                return {
                    touching: false,
                    distance: 0,
                    position: {x: 0, y: 0},
                    touchBeginAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    touchEndAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    angle: {degree: 0},
                };
            },                        
          doCmd(cmd){
            if (this.busy)
            {
                return;
            }
            this.busy = true;
            let objOptions = {};
            objOptions.url = '/cmd';
            objOptions.action = '发送命令';
            objOptions.json = {cmd};
            objOptions.func = (json) => {
                this.busy = false;
                this.car = json.car;
                this.syncParams();
            }
            this.request(objOptions);
          }
        },
        components: {Flexbox, FlexboxItem},
        computed: {
            direction(){
                let sRet = ''
                if (this.joystick.distance > 0)
                {
                    if (this.joystick.angle.degree > 45 && this.joystick.angle.degree <= 135) 
                    {
                        sRet = 'U';
                    }
                    else if (this.joystick.angle.degree > 135 && this.joystick.angle.degree <= 225) {
                        sRet = 'L';
                    }
                    else if (this.joystick.angle.degree > 225 && this.joystick.angle.degree <= 315) {
                        sRet = 'D';
                    }
                    else {
                        sRet = 'R';
                    }
                }
                return sRet;
            },
            joyStyle() {
                let iWidth = document.body.clientWidth;
                let objStyle = {
                    width: iWidth + 'px',
                    height: iWidth + 'px',
                    border: '1px solid'
                };
                return objStyle;
            },
        }
    }
</script>

<style scoped>
    .pwm{
      
    }
</style>
