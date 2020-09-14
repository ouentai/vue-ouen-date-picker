/**
  ミックスインの機能
    - BaseCalendarを拡張する

  使い方
    - mixinしたあとに
    - コンポーネントの好きな場所にBaseCalendarを配置する : importはmixinで行っている
      <BaseCalendar
        :border='border'
        :ym='ym'
        :year='year'
        :month='month'
        :week-labels='weekLabels'
        :start-week='startWeek'
        :disabled='disabled'
        :checked-color='checkedColor'
        :checked='checked'
        @info:calendar='$emit("info:calendar", $event)'
        @click:day='$emit("click:day", $event)'
        />
    - see above example, you can customize props and @ event.

  interface : BaseCalendar
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
*/

import BaseCalendar from '../components/BaseCalendar';

export default {
  components: {
    BaseCalendar ,
  },
  props: {
    border       : Boolean ,
    ym           : Number  ,
    year         : Number  ,
    month        : Number  ,
    weekLabels   : Array   ,
    startWeek    : Number  ,
    disabled     : Boolean ,
    checkedColor : String  ,
    checked      : Array   ,
  },
};
