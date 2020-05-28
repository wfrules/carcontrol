//扩展vue对象的方法单元

import axios from 'axios'
import * as types  from '../store/mutation-types.js'

let request = function(opt) {
  if (opt.loading)
  {
    this.$vux.loading.show({
      text: '加载中'
    });
  }

  if (opt.json == "" || opt.json == undefined) {
    opt.json = "{}";
  }
  var arrMyParams = opt.json;
  let params = new URLSearchParams();
  params.append('func', opt.action == undefined ? '' : opt.action);
  params.append('parms', JSON.stringify(arrMyParams));
  params.append('api_token', this.$store.state.token);
  axios.post( opt.url.toLowerCase(), params).then( res=>{
      this.$vux.loading.hide();
      if (res.data.result == 0) {
        opt.func(res.data);
      }
      else {
        console.log(opt.action == undefined ? '' : opt.action);
        if (opt.errorfunc != undefined && opt.errorfunc != "") {
          opt.errorfunc(res.data);
        } else {
          if (res.data.message) {
            this.$vux.alert.show({
              title: '出错了1',
              content: res.data.error,
            });
          }
          else
          {
            this.$vux.alert.show({
              title: '出错了2',
              content: res.data
            });
          }
        }
      }
    }
  ).catch(err=>{
    let sMessage = err.response.data.message;
    this.$vux.loading.hide();
    this.$vux.alert.show({
      title: '接口异常',
      content: sMessage,
    });   
  });
};

export {
    request,
    checkGrant,
}
