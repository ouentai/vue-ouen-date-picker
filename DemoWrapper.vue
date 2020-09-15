<template>
  <div>

    <h2>DatePicker</h2>

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
      {{calendar1.year}}年{{calendar1.month}}月
    </div>

    <DatePicker
      border
      :year='year*1'
      :month='month'
      :start-week='start_weekday'
      :checked.sync='checked'
      style='border : 1px solid red; border-collapse:collapse'
      class='wid'
      @info:calendar='setCalendar($event,1)'
      />

    <hr>

    <div>
      <div>@days:{{checked}}</div>
    </div>

    <hr>

    <h2>BaseCalendar</h2>

    <div>
      <input type="text" v-model='ym'>
    </div>

    {{calendar2.year}}年{{calendar2.month}}月
    <BaseCalendar
      border
      :ym='ym*1'
      :start-week='start_weekday'
      :checked='checked'
      checked-color='red'
      class='wid'
      :week-labels='weekLabels'
      @click:day='passDay'
      @info:calendar='setCalendar($event,2)'
      />
  </div>
</template>

<script>
import {
  BaseCalendar ,
  DatePicker ,
  // Calendarable ,
} from './index';

export default {
  name: 'Demo',
  components: {
    BaseCalendar ,
    DatePicker ,
  },
  props: {},
  data () {
    return {
      calendar1 : {} ,
      calendar2 : {} ,
      ym : 202010 ,
      year : 2020 ,
      month : 4 ,
      start_weekday : 0 ,
      checked : [1,4,7,10,31],
      days : [],
      dangerous : !true , // add_month,add_weekで想定範囲外の値を選択できるようにする:false->safemode
      weekLabels : [
        {value:'Sun',color:'green'},
        {value:'Mon',color:'rgba(0,0,0,.5)'},
        {value:'Tue',color:''},
        {value:'Wed',color:''},
        {value:'Thu',color:''},
        {value:'Fri',color:''},
        {value:'Sat',color:'yellow'},
      ],
    };
  },
  computed: {},
  methods: {
    setCalendar(cal, index) {
      this['calendar'+index] = cal ;
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
