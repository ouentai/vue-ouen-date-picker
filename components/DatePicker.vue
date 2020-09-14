<!--
  複数選択できるdate pickerカレンダーコンポーネント

  point
    propsのmonth,start_weekdayが範囲外でもそれなりに良い動作をするようにした。
      ※devlopmentではコンソールでエラーがでるが、productionだと何も警告なし。

  props
    year : int  : 西暦4桁
    month: 1-12 : 月
      ※範囲外は1or12に整形
    start_weekday:0-6:カレンダ左端列の曜日
      ※範囲外は0-6に整形
    disabled:チェック無効フラグ
    border:カレンダーの枠線
    checked:array:初期チェック済みにする日付の配列
    label_position:年月ラベルの表示位置:true,top/right/left/bottom

  $emit
    calendar:表示されているカレンダーの情報
    days:チェックされた日付の配列:クリック順
      要素は単純int
-->

<template>
  <div style='text-align:center' :style='style_position'>
    <div
      v-if='label_position'
      :style='style_children.label'
      >
      {{`${year}年${month_info.month}月`}}
    </div>

    <table
      :style='style_children.table'
      :border='border'
      >

      <tr>
        <td v-for='w in _week' :key='"datepicker_label_" + w.value'>
          <font :style='{color:w.color}'>
            {{w.value}}
          </font>
        </td>
      </tr>

      <tr v-for='row in calendar.weeks' :key='"datepicker_row"+row'>
        <td
          v-for='col in 7'
          :key='`datepicker_row${row}_${col}`'
          :style='check_style(row,col)'
          @click='click_day(row,col)'
          data-test:jest='click'
          >
          <font :style='{color:_week[col-1].color}'>
            {{calc_day(row,col)}}
          </font>
        </td>
      </tr>

    </table>
  </div>
</template>

<script>
import is_same_arr from '../lib/is_same';

export default {
  name: 'DatePicker',
  props: {
    year: {
      type: Number,
      default: 2020,
    },
    month: {
      type: Number,
      default: 4,
      validator: val => val <=12 && val >=1,
    },
    start_weekday: { // カレンダーの左端の曜日
      type: Number,
      default: 0,
      validator: val => val <=6 && val >=0,
    },
    disabled: { // click無効
      type: Boolean,
      default: false,
    },
    checked: { // defaultでチェック済みにする日付の配列
      type: Array,
      default: () => [],
    },
    border: { // カレンダーの枠線の有無
      type: Boolean,
      default: false,
    },
    label_position: { // 'top', 'right', 'left', 'bottom' or true/falsy
      type: [Boolean, String],
      default: false,
    },
  },
  data () {
    return {
      days : [] , // emitする日付配列：クリックした順で格納される
      week : [
        { value : '日' , color : 'red'  },
        { value : '月' , color : null   },
        { value : '火' , color : null   },
        { value : '水' , color : null   },
        { value : '木' , color : null   },
        { value : '金' , color : null   },
        { value : '土' , color : 'blue' },
      ] ,
    };
  },
  computed: {
    _start_weekday () {
      let w = this.start_weekday ;
      while (w<0) {
        w += 7 ;
      }
      return w %= 7 ;
    },
    _week () { // _start_weekdayによる並び替え
      let arr = [];
      for (let i = 0 ; i < 7 ; i++) {
        arr.push(this.week[(i+this._start_weekday)%7]);
      }
      return arr ;
    },
    month_info () {
      let month = this.month > 12 && 12 ||
                  this.month <  1 &&  1 ||
                  this.month ;
      let date = new Date(this.year,month,0); // y年m月の月末日
      let last_date = date.getDate(); // 月末日

      date.setDate(1); // y年m月1日
      let first_week = date.getDay(); // 月初日の曜日

      this.filter_days(last_date); // 月変更による存在しない日の除外：31日とか
      this.emit_result();

      let result = {
        year       : this.year  ,
        month      ,
        last_date  ,
        first_week ,
      };
      this.$emit('calendar', result);
      return result ;
    },
    calendar () {
      let top = (this.month_info.first_week-this._start_weekday+7)%7 ;
      let weeks = Math.ceil((this.month_info.last_date+top)/7);
      return {
        top ,
        weeks ,
      };
    },
    style_position () {
      // labelの表示位置style
      return (
        this.label_position === 'bottom' && {display:'flex',flexDirection:'column-reverse'} ||
        this.label_position === 'right'  && {display:'flex',flexDirection:'row-reverse'   } ||
        this.label_position === 'left'   && {display:'flex',flexDirection:'row'           } ||
        null
      );
    },
    style_children () {
      // table,labelのstyle
      let is_x = /right|left/.test(this.label_position) ;
      let is_y = /top|bottom/.test(this.label_position) ;
      let is_t = !!this.label_position ;
      return {
        table:
          is_x && {width: '90%',height:'100%'} ||
          is_y && {width:'100%',height: '90%'} ||
          is_t && {width:'100%',height: '90%'} ||
          {width:'100%',height: '100%'}
        ,
        label:
          is_x && {width: '10%',height:'100%',writingMode:'vertical-rl'} ||
          {width:'100%',height: '10%',}
        ,
      };
    },
  },
  watch: {
    checked: { // checked配列が変わった時の初回emitとdaysへの格納
      immediate: true ,
      handler (val,old) {
        if (is_same_arr(val,old)) return ; // 配列では常にwatchが走ってしまう
        this.days = [...val] ; // 分割代入しないと参照代入になってしまい、潜在的不具合につながる。
        this.emit_result(); // 初回emit
      },
    },
  },
  methods: {
    calc_day(row,col) { // 行列から日付の取得
      let r = (row-1)*7 + col - this.calendar.top ;
      return r>=1 && r<=this.month_info.last_date && r || null ;
    },
    check_style(row,col) { // チェック日付のスタイル
      let day = this.calc_day(row,col) ;
      return this.days.indexOf(day)!==-1 ? {backgroundColor:'gray'} : null ;
    },
    click_day(row,col) { // クリック時の処理
      if (this.disabled) return ;

      let day = this.calc_day(row,col) ;
      if (!day) return ;

      let index = this.days.indexOf(day) ;
      if (index===-1) {this.days.push(day);}
      else {this.days.splice(index,1);}

      this.emit_result();
    },
    emit_result() { // emit処理
      this.$emit('days',this.days);
    },
    filter_days(last_date) { // 月末日を超えた日付を除外
      this.days = this.days.filter(val=>val<=last_date);
    },
  },
};
</script>
