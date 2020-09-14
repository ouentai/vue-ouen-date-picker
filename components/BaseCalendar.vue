<!--
  カレンダーコンポーネント
  - input : props
    - border : boolean : カレンダーの枠線の有無
    - ym : number : YYYYMM型 190001-209912: year monthより優先 : 月が範囲を越えると自動で年で調整する Dateの扱い
    - year : number : YYYY型
    - month : number : 1-12
    - week-labels : array <labels> : array.length must be 7 : 曜日の色とか
      - labels : object : { value : string , color : string }
    - start-week : number : 0-6 : 0:sun, 1:mon ...
    - disabled : boolean : clickイベントを無効にする
    - checked-color : string : cssで使える値 : clickedで渡されたものの中にあったときの背景色
    - checked : array <number> : 背景を変えたい日付の配列
  - output : emit
    - info:calendar : object : 表示されているカレンダーの情報
    - click:day : number : クリックされた日付
-->
<script>
export default {
  name: 'BaseCalendar',
  props: {
    border : Boolean , // カレンダーの枠線の有無
    ym : Number ,
    year: {
      type: Number ,
      default: 2020,
    },
    month: {
      type: Number ,
      default: 9 ,
      validator: val => val <=12 && val >=1,
    },
    weekLabels: {
      type: Array ,
      default: () => [
        { value : '日' , color : 'red'  },
        { value : '月' , color : null   },
        { value : '火' , color : null   },
        { value : '水' , color : null   },
        { value : '木' , color : null   },
        { value : '金' , color : null   },
        { value : '土' , color : 'blue' },
      ],
      validator: arr => arr.length === 7 ,
    },
    startWeek: { // カレンダーの左端の曜日
      type: Number ,
      default: 0 ,
      validator: val => val <=6 && val >=0,
    },
    disabled : Boolean , // click無効
    checkedColor : String , // checkされたセルの背景色
    checked: { // defaultでチェック済みにする日付の配列
      type: Array ,
      default: () => [],
    },
  },
  data () {
    return {
      firstWeek : null , // 1日の曜日
      lastDay   : null , // 月末日
      weeks     : null , // 当月の週数
    };
  },
  computed: {
    shiftFirstWeek() {
      let val = this.firstWeek - this.startWeek ;
      while (val < 0) {
        val += 7 ;
      }
      return val ;
    },
    shiftWeekArr() {
      return this.weekLabels.slice(this.startWeek)
                         .concat(this.weekLabels.slice(0,this.startWeek));
    },
  },
  watch: {
    ym        () { this.setMonthData(); },
    year      () { this.setMonthData(); },
    month     () { this.setMonthData(); },
    startWeek () { this.setMonthData(); },

  },
  created() {
    this.setMonthData();
  },
  methods: {
    setMonthData() {
      const useYm = 190000 < this.ym && this.ym < 209913 ;
      const y = useYm ? ~~(this.ym/100) : this.year ;
      const m = useYm ? this.ym%100 : this.month ;
      const date = new Date(y, m, 0) ; // 指定月の月末日
      this.lastDay = date.getDate() ;
      date.setDate(1) ; // 1日に変更
      this.firstWeek = date.getDay() ;
      this.weeks = Math.ceil((this.lastDay + this.shiftFirstWeek) / 7) ;
      this.$emit('info:calendar', {
        year      : date.getFullYear() ,
        month     : date.getMonth() + 1 ,
        firstWeek : this.firstWeek ,
        lastDay   : this.lastDay ,
      });
    },
    calcDay(weekIndex, dayIndex) {
      let day = ( weekIndex - 1 ) * 7 + dayIndex - this.shiftFirstWeek ;
      if (day<1||this.lastDay<day) {
        return null ;
      }
      return day ;
    },
    tdStyle(weekIndex, dayIndex) {
      const day = this.calcDay(weekIndex, dayIndex) ;
      if (!day) { return ; }
      const bgFlag = this.checked.includes(day) ;
      const bgColor = this.checkedColor || 'rgba(0,0,0,.5)' ;
      return {
        color : this.shiftWeekArr[dayIndex-1].color ,
        backgroundColor : bgFlag ? bgColor : null ,
      };
    },
    clicked(e) {
      if (this.disabled) {
        return ;
      }
      const day = e.target.innerText * 1 ;
      if (isNaN(day)||day===0) {
        return ;
      }
      this.$emit('click:day', day);
    },
  },
};
</script>

<template>
  <table :border='border' @click='clicked'>
    <thead>
      <tr>
        <th v-for='(d,i) of shiftWeekArr' :key='"weekLabel_"+i' :style='{color:d.color}'>{{d.value}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for='w of weeks' :key='w'>
        <td v-for='d of 7' :key='w+"_"+d' :style='tdStyle(w,d)'>{{calcDay(w,d)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width : 100%;
  height: 100%;
  text-align: center;
}
table td {
  cursor: pointer;
}
</style>
