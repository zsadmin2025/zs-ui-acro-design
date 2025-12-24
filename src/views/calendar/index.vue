<template>
  <div>
    <zs-container layout="left-right">
      <template #left> 左侧 </template>
      <template #right-main>
        <FullCalendar ref="fullCalendar" :options="calendarOptions">
          <template #eventContent="arg">
            <b>{{ arg.event.title }}</b>
          </template>
        </FullCalendar>
      </template>
    </zs-container>
  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listPlugin from '@fullcalendar/list';
  import multiMonthPlugin from '@fullcalendar/multimonth';
  import interactionPlugin from '@fullcalendar/interaction';

  export default {
    components: {
      FullCalendar, // make the <FullCalendar> tag available
    },
    data() {
      return {
        calendarOptions: {
          plugins: [
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
            multiMonthPlugin,
          ],
          multiMonthMaxColumns: 1, // force a single column
          droppable: true,
          initialView: 'dayGridMonth',
          selectable: true,
          selectMirror: true,
          timeZone: 'local',
          dateClick: this.handleDateClick,
          height: '100%',
          events: [
            { title: 'event 1', date: '2025-08-15' },
            { title: 'event 2', date: '2025-08-25' },
            {
              start: '2025-08-10 10:00:00',
              end: '2025-08-10 16:00:00',
              display: 'background',
            },
          ],
          schedulerLicenseKey: 'XXX',
          locale: 'zh-cn',
          headerToolbar: {
            left: 'prevYear,prev,next,nextYear today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          },
          buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日',
            list: '列表',
            dayGridMonth: '月',
            timeGridWeek: '周',
            timeGridDay: '日',
          },
          bootstrapFontAwesome: {
            close: 'fa-times',
            prev: 'fa-chevron-left',
            next: 'fa-chevron-right',
            prevYear: 'fa-angle-double-left',
            nextYear: 'fa-angle-double-right',
          },
        },
      };
    },
    methods: {
      handleDateClick(arg) {
        // eslint-disable-next-line no-alert
        alert(`date click! ${arg.dateStr}`);
      },
      toggleWeekends() {
        this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
      },
      apiClick() {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.next();
      },
    },
  };
</script>
