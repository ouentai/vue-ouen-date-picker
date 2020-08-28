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

    <MyCalendar
      :year='year*1'
      :month='month'
      :start_weekday='start_weekday'
      :checked='checked'
      label_position
      @days='days=$event'
      @calendar='calendar=$event'
      class='wid'
      />

    <div>
      <div>@calendar:{{calendar}}</div>
      <div>@days:{{days}}</div>
    </div>
  </div>
</template>

<script>
import MyCalendar from './DatePicker.vue';
export default {
  name: 'Demo',
  components: {
    MyCalendar ,
  },
  props: {},
  data () {
    return {
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
