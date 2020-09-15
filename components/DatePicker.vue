<!--
  コンポーネントの機能
    - カレンダーの日付を複数取得する : 日付を複数選択できる
  interface
    - input : BaseCalendar の input interface
    - output : emit
      - info:calendar : object : 表示されているカレンダーの情報
      - update:checked : array <day> : props.checked にdayの扱いを反映して返す


-->
<script>
import Calendarable from '../mixin/Calendarable';

export default {
  name: 'DatePicker',
  mixins: [
    Calendarable ,
  ],
  methods: {
    setDay(day) {
      if (!this.checked) {
        this.$emit("update:checked", [day]);
        return ;
      }
      const index = this.checked.indexOf(day) ;
      const arr = this.checked.slice() ;
      if (index===-1) {
        arr.push(day);
      } else {
        arr.splice(index,1);
      }
      this.$emit("update:checked", arr)
    },
  },
};
</script>

<template>
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
    @click:day='setDay'
    />
</template>
