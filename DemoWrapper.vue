<template>
  <div>

    <div>
      <button @click='dangerous=!dangerous'>月・曜日範囲外選択</button>{{dangerous}}
    </div>

    <div>
      <button @click='add_week(+1)'>曜日：左へ</button>
      <button @click='add_week(-1)'>曜日：右へ</button>
      {{start_weekday}}
    </div>

    <div>
      <input type='number' v-model='year'>
      <button @click='add_month(-1)'>前月</button>
      <button @click='add_month(+1)'>次月</button>
    </div>
    <div>
      {{year}}年{{month}}月
    </div>

    <div>
      <div>@calendar:{{calendar}}</div>
      <div>@days:{{days}}</div>
    </div>

    <div>
      <input type="text" v-model='ym'>
    </div>

    {{monthInfo.year}}年{{monthInfo.month}}月
    <BaseCalendar
      border
      :ym='ym*1'
      :year='year*1'
      :month='month'
      :start-week='start_weekday'
      :checked='checked'
      checked-color='red'
      class='wid'
      @click:day='passDay'
      @info:calendar='passInfo'
      />
  </div>
</template>

<script>
import BaseCalendar from './components/BaseCalendar';

export default {
  name: 'Demo',
  components: {
    BaseCalendar ,
  },
  props: {},
  data () {
    return {
      monthInfo : {} ,
      ym : 202010 ,
      year : 2020 ,
      month : 4 ,
      start_weekday : 0 ,
      checked : [1,4,7,10,31],
      days : [],
      calendar : null ,
      dangerous : true , // add_month,add_weekで想定範囲外の値を選択できるようにする:false->safemode
    };
  },
  computed: {},
  methods: {
    passInfo(val) {
      this.monthInfo = val ;
    },
    passDay(val) {
      const index = this.checked.indexOf(val);
      if (index===-1) {
        this.checked.push(val);
      } else {
        this.checked.splice(index,1);
      }
    },
    add_month(val) {
      let m = this.month + val ;
      if (this.dangerous) {
        this.month = m ;
      } else {
        if      (m< 1) { this.year -= 1; this.month = 12 ; }
        else if (m>12) { this.year += 1; this.month =  1 ; }
        else           { this.month = m ; }
      }
    },
    add_week(val) {
      let w = this.start_weekday + val ;
      if (this.dangerous) {
        this.start_weekday = w ;
      } else {
        this.start_weekday =
          w <  0 && 6 ||
          w <= 6 && w ||
          0 ;
      }
    },
  },
};
</script>

<style scoped>
.wid
{
  width: 200px;
  height: 200px;
}
</style>
